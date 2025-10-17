import { useState, useEffect } from "react";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import app from "../firebase";

const useFirebaseUpload = (file) => {
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [downloadURL, setDownloadURL] = useState(null);
  const [fileName, setFileName] = useState(null);

  useEffect(() => {
    if (!file?.name) return;

    const storage = getStorage(app);
    const fileName = `${new Date().getTime()}-${file.name}`;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
    setFileName(file.name);

    const handleUpload = () => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(Math.floor(progress));
        },
        (error) => {
          console.error("Upload error:", error);
          setError(error);
        },
        async () => {
          try {
            const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);

            setDownloadURL(downloadUrl);
          } catch (error) {
            console.error("Error getting download URL:", error);
            setError(error);
          }
        }
      );
    };

    handleUpload();

    return () => {
      // Cancel the upload if the component unmounts or the file changes
      uploadTask.cancel();
    };
  }, [file]);

  return { progress, error, downloadURL, fileName };
};

export default useFirebaseUpload;
