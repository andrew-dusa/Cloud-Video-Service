'use client';

import Image from "next/image";
import Link from "next/link";
import styles from "./navbar.module.css";
import SignIn from "./sign-in";
import { onAuthStateChangedHelper } from "../firebase/firebase";
import { useEffect, useState } from "react";
import { User } from "firebase/auth";
import AdminUpload from "./AdminUpload";

export default function NavBar(){
    // Check if the user is logged in
    const[user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChangedHelper((user)=>{
            setUser(user);
        });
        //cleanup subscription on unmount
        return() => unsubscribe();
    });
    return (
        <nav className={styles.nav}>
            <Link href="/">
                <Image width = {120} height ={24}
                src = "/VideoLogo.svg" alt="Video Logo"/>
            </Link> 
            {
                user && <AdminUpload /> 
            }
            <SignIn user={user}/>
        </nav>
    );
}
