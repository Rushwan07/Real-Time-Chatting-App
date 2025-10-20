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
    if (!file) return;

    const storage = getStorage(app);
    const uniqueName = `${Date.now()}-${file.name}`;
    const storageRef = ref(storage, `profileImages/${uniqueName}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    setFileName(file.name);
    setProgress(0);
    setError(null);
    setDownloadURL(null);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // update progress
        const percent = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        // Force re-render — ensures even small progress changes appear
        requestAnimationFrame(() => setProgress(percent));
      },
      (err) => {
        console.error("Upload error:", err);
        setError(err.message);
      },
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        setDownloadURL(url);
        setProgress(100);
      }
    );

    // clean up listener on unmount
    return () => uploadTask.cancel?.();
  }, [file]);

  return { progress, error, downloadURL, fileName };
};

export default useFirebaseUpload;
