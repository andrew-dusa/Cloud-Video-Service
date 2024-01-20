import express from "express";
import { convertVideo, deleteProcessedVideo, deleteRawVideo, downloadRawVideo, setupDirectories, uploadProcessedVideo } from "./storage";
import { isVideoNew, setVideo } from "./firestore";

setupDirectories();
const app = express();
app.use(express.json());

app.post("/process-video", async (req, res) => {
    let data;
    try{
        const message = Buffer.from(req.body.message.data, 'base64').toString('utf8');
        data = JSON.parse(message);
        if(!data.name){
            throw new Error('Invalid message payload recieved,');
        }
    }
    catch(error){
        console.error(error);
        return res.status(400).send('Bad Request: Missing filename.')
    }

    const inputFileName = data.name; // Format is UID-DATE-Extenstion
    const outputFileName = `processed-${inputFileName}`;
    const videoId = inputFileName.split('.')[0];

    if(!isVideoNew(videoId)) {
        return res.status(400).send('Bad Request: Video already processing or processed');
    } else {
        await setVideo(videoId, {
            id: videoId,
            uid: videoId.split('-')[0],
            status: 'processing' // set the status to processing
        });
    }
    //Download raw video from Cloud Storage
    await downloadRawVideo(inputFileName);

    //Convert the video to 360p
    try{
        await convertVideo(inputFileName, outputFileName);
    }catch(err){ //if it fails, delete the raw and processed video
        await Promise.all([ // we will do these concurrently
            deleteRawVideo(inputFileName),
            deleteProcessedVideo(outputFileName)
        ]);
        console.error(err); // log the error
        return res.status(500).send('Internal Server Error; video processing failed.');
    }
    //Upload the processed video to Cloud Storage
    await uploadProcessedVideo(outputFileName);
    await setVideo(videoId, { //change the status to processed
        status: 'processed',
        filename: outputFileName
    })

    await Promise.all([ // we will do these concurrently
            deleteRawVideo(inputFileName),
            deleteProcessedVideo(outputFileName)
        ]);

    return res.status(200).send(`Processing finished succesfully.`);


});
const port = process.env.PORT || 3000; // use the port from the environment variables, or 3000 if it's not set
app.listen(port, () => {
    console.log(`Video processing service listening at http://localhost:${port}`);
});