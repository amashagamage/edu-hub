import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../configs/firebaseConfig";


export const uploadFile = async (file, folderPath = 'paf-posts', onProgress) => {
  if (!file) {
    console.error("No file provided for upload");
    throw new Error("No file provided for upload");
  }
  
  try {
    console.log(`Starting upload to ${folderPath}/${file.name} (${file.size} bytes)`);
    
    // Use the folderPath parameter to determine where to store the file
    const path = `${folderPath}/${Date.now()}-${file.name}`;
    const fileRef = ref(storage, path);
    const uploadTask = uploadBytesResumable(fileRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Track upload progress
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload progress: ${Math.round(progress)}%`);
          onProgress && onProgress(Math.round(progress));
        },
        (error) => {
          console.error("Upload failed during transfer:", error);
          reject(error);
        },
        async () => {
          try {
            console.log("Upload completed, getting download URL...");
            const url = await getDownloadURL(uploadTask.snapshot.ref);
            console.log("File URL:", url);
            resolve(url);
          } catch (error) {
            console.error("Failed to get download URL:", error);
            reject(error);
          }
        }
      );
    });
  } catch (error) {
    console.error(`Upload failed: ${error.message}`, error);
    throw new Error(`Upload failed: ${error.message}`);
  }
};
