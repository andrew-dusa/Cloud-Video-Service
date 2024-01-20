import { Storage } from '@google-cloud/storage';
import fs from 'fs';
import ffmpeg from 'fluent-ffmpeg';
import { doesNotReject } from 'assert';

const storage = new Storage(); //creates a new instance of the google cloud storage class

const rawVideoBucketName = "raw-videos"
const processedVideoBucketName = "processed-videos";

const localRawVideoPath = "./raw-videos";
const localProcessedVideoPath = "./processed-videos";


// Creates the local directories for raw and processed videos
export function setupDirectories(){
    ensureDirectoryExistence(localRawVideoPath);
    ensureDirectoryExistence(localProcessedVideoPath);
}

/** 
* @param rawVideoName - the name of the file to convert from {@link localRawVideoPath}
* @param processedVideoName - the name of the file to convert to {@link localProcessedVideoPath}
* @returns A promise that resolves when the video has been converted  
*/
export function convertVideo(rawVideoName: string, processedVideoName: string){
    return new Promise<void>((resolve, reject) => {
        ffmpeg(`${localRawVideoPath}/${rawVideoName}`)
        .outputOptions('-vf', 'scale=-1:360') // 360p
        .on('end', ()  => {
            console.log('Processing finished successfully');
            resolve();
        })
        .on('error', function(err: any) {
            console.log('An error occurred: ' + err.message);
            reject(err);
        })
        .save(`${localProcessedVideoPath}/${processedVideoName}`);
    });
}
/**
 * @param fileName - the name of the file to download from the 
 * {@link rawVideoBucketName} bucket into the {@link localRawVideoPath} folder
 * @returns A promise the resolves when the file has been downloaded.
 */
export async function downloadRawVideo(fileName: string){ //has to return a promise because it is an async function
    await storage.bucket(rawVideoBucketName)
        .file(fileName)
        .download({destination: `${localRawVideoPath}/${fileName}` });
    console.log(
        `gs://${rawVideoBucketName}/${fileName} downloaded to ${localRawVideoPath}/${fileName}.`
    )
}

/**
 * @param fileName - the name of the file to upload from the 
 * {@link localProcessedVideoPath} folder onto the {@link processedVideoBucketName}.
 * @returns A promise that resolves when the file has been uploaded.
 */
export async function uploadProcessedVideo(fileName:string){
    const bucket = storage.bucket(processedVideoBucketName)

    await bucket.upload(`${localProcessedVideoPath}/${fileName}`, {
        destination: fileName
    });
    console.log(
        `gs://${localProcessedVideoPath}/${fileName} downloaded to ${processedVideoBucketName}/${fileName}.`
    );
    await bucket.file(fileName).makePublic();
}

/**
 * @param filePath - the path of the file to delete.
 * @returns A promise that resolves when the file has been deleted.
 */

function deleteFile(filePath: string): Promise<void> {
    return new Promise((resolve, reject) => {
        if(fs.existsSync(filePath)){
            fs.unlink(filePath, (err) => {
                if(err){
                    console.log(`failed to delete file at ${filePath}`,err);
                    reject(err)
                }else{
                    console.log(`File deleted at ${filePath}`);
                    resolve();
                }
            })
        } else{
            console.log(`File not found at ${filePath}, skipping the delete.`);
            resolve();
        }
    });
}

/**
 * @param fileName - the name of the file to delete from the 
 * {@link localRawVideoPath} folder.
 * @returns A promise that resolves when the file has been deleted.
 */
export function deleteRawVideo(fileName: string){
    return deleteFile(`${localRawVideoPath}/${fileName}`);
}

/**
 * @param fileName - the name of the file to delete from the 
 * {@link localProcessedVideoPath} folder.
 * @returns A promise that resolves when the file has been deleted.
 */
export function deleteProcessedVideo(fileName: string){
    return deleteFile(`${localProcessedVideoPath}/${fileName}`);
}


/**
 * Ensures that a directory exists, creating it if necessary.
 * @param {string} dirPath - the directory path to check
 */
function ensureDirectoryExistence(dirPath: string){
    if(!fs.existsSync(dirPath)){
        fs.mkdirSync(dirPath, {recursive: true}); //recursive: true enables creating nested directories
        console.log(`directory created at ${dirPath}`);
    }
}