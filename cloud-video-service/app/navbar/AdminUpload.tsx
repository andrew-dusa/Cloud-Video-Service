'use client';

import { Fragment } from "react";
import { isUserAdmin, uploadVideo } from "../firebase/functions";
import Image from "next/image";
import styles from "./upload.module.css";
import { User } from "firebase/auth";
import { useState, useEffect } from "react";
import { onAuthStateChangedHelper } from "../firebase/firebase"; 

export default function AdminUpload() {
    const[user, setUser] = useState<User | null>(null);

    useEffect(() => { // Check if the user is logged in
        const unsubscribe = onAuthStateChangedHelper((user)=>{
            setUser(user);
        });
        return() => unsubscribe(); // Unsubscribe from the listener when the component is unmounted
    });

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.item(0);
        if (file) {
            handleUpload(file, user?.uid); // Pass the user's UID to the handleUpload function
        }
    };

    const handleUpload = async (file: File, uid: string | undefined) => {
        if (isUserAdmin(uid)) { // Check if the user's UID is equal to the admin UID
            try {
                const response = await uploadVideo(file);
                alert(`File uploaded successfully. Response: ${JSON.stringify(response)}`);
            } catch (error) {
                alert(`Failed to upload file: ${error}`);
            }
        } else {
            alert("Only authorized users can upload. Please check my GitHub for examples of proper behavior: https://github.com/andrew-dusa/Cloud-Video-Service");
        }
    };

    return (
        <Fragment>
            <input
                id="upload"
                className={styles.uploadInput}
                type="file"
                accept="video/*"
                onChange={handleFileChange}
            />
            <label htmlFor="upload" className={styles.uploadButton}>
                <Image width={160} height={50} src="/upload.svg" alt="upload" />
            </label>
        </Fragment>
    );
}