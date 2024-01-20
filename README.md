# Brief Summary 
We use Google Cloud services to deploy a scalable, containerized video service using Docker and Firebase. We use advanced Pub/Sub features to allow users to upload videos to a storage bucket and automatically process and compress the video using ffmpeg. The video is then uploaded to a Firebase database where the client fetches some of the newest videos from the database. We also use Firebase Authentication to only allow authenticated users to manage video uploads on the site.
You can find the Cloud Video Service [HERE](https://cloud-video-service-sujh6ughja-uc.a.run.app)

Before signing in:
<img width="1720" alt="Screenshot 2024-01-19 at 2 42 30 PM" src="https://github.com/andrew-dusa/Cloud-Video-Service/assets/93221044/dc6ecfeb-4134-44e0-bd33-11135cdec67a">
After signing in:
<img width="1720" alt="Screenshot 2024-01-19 at 2 42 42 PM" src="https://github.com/andrew-dusa/Cloud-Video-Service/assets/93221044/5be62b4e-d66a-4ee1-8e36-4fa333c68d59">
Watch Page: 
<img width="1720" alt="Screenshot 2024-01-19 at 7 18 06 PM" src="https://github.com/andrew-dusa/Cloud-Video-Service/assets/93221044/22b7e807-698c-4c67-b937-dd78b0f37d9a">
When you Click Upload:
<img width="1720" alt="Screenshot 2024-01-19 at 2 43 48 PM" src="https://github.com/andrew-dusa/Cloud-Video-Service/assets/93221044/09b85357-eadc-4759-aa10-60011b9a18c1">

## Key System Components

1. **Video Storage - Cloud Storage:**
   - Utilizes Google Cloud Storage for hosting both raw and processed videos.
   - Ensures scalability and cost-effectiveness in handling large video files.

2. **Upload Events - Cloud Pub/Sub:**
   - Cloud Pub/Sub manages video upload events, providing durability and asynchronous video processing.
   - Enables seamless integration with other cloud services.
   - We use the subscription to send a push request to the video processing service.

3. **Processing - Cloud Run:**
   - Dynamic scaling using Cloud Run for video processing.
   - Implements ffmpeg for transcoding videos efficiently.

4. **Web Client - Next.js:**
   - Next.js powers the web client, offering a responsive and user-friendly interface.

5. **Database - Firestore:**
   - Firestore stores processed video metadata, such as the user id of the original poster.
   - Facilitates the display of videos.

6. **Video API - Firebase Functions:**
   - Firebase Functions create a flexible API for video upload and metadata retrieval.
   - Allows for the creation of unique upload URLs to avoid collisions.

7. **Authentication - Firebase Auth:**
   - Firebase Auth handles user authentication, streamlining the integration of Google Sign In.
   - Ensures a secure and seamless sign-up process.
   - Allows us to only allow authenticated users to manage video uploads.

## Design

### Uploading

- Authenticated users leverage signed URLs from a public Firebase Function to upload videos securely.
- Direct upload to Cloud Storage simplifies video management, utilizing Google Cloud's capabilities.

### Processing

- Cloud Pub/Sub manages video upload events, decoupling video processing from uploads.
- Cloud Run workers process videos using ffmpeg, dynamically scaling to handle varying workloads.
- Processed videos and metadata stored in Cloud Storage and Firestore for efficient retrieval.
  
### User Sign Up

- Users sign up effortlessly using their Google account, powered by Firebase Auth.
- Firebase Auth creates a user record with a unique ID and email address.

## Technology Stack

- **Frontend:**
  - [Next.js](https://nextjs.org/): Crafting a responsive web client for an immersive user experience.

- **Backend:**
  - [Firebase Functions](https://firebase.google.com/docs/functions): Powering a versatile API for effective video management.
  - [Firestore](https://firebase.google.com/docs/firestore): Storing and retrieving comprehensive video metadata.

- **Cloud Services:**
  - [Google Cloud Storage](https://cloud.google.com/storage): Scalable hosting for both original and processed videos.
  - [Cloud Pub/Sub](https://cloud.google.com/pubsub): Event-driven architecture optimizing video processing.
  - [Cloud Run](https://cloud.google.com/run): Dynamic scaling for video processing workers.

- **Authentication:**
  - [Firebase Auth](https://firebase.google.com/docs/auth): Secure user authentication seamlessly integrated with Google Sign In.

- **Deployment:**
  - [Docker](https://www.docker.com/): Leveraging Docker images for streamlined and consistent deployment.

For more details, refer to the [Firebase Auth documentation](https://firebase.google.com/docs/auth), [Cloud Storage documentation](https://cloud.google.com/storage/docs), [Cloud Pub/Sub documentation](https://cloud.google.com/pubsub/docs), [Cloud Run documentation](https://cloud.google.com/run/docs), [Firestore documentation](https://firebase.google.com/docs/firestore), and [Docker documentation](https://www.docker.com/).

This project, inspired by the NeetCode series, is a video processing service enabling users to sign in with their Google account, upload videos, and browse uploaded content. The application leverages various cloud services, showcasing a robust architecture for video storage, processing, and metadata management.
