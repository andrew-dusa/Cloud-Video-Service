'use client';

import { useSearchParams } from "next/navigation";

export default function Watch(){
    const videoPrefix = 'Put your bucket URL here'
    const videoSrc = useSearchParams().get('v');

    return (
        <div>
            <h1>Watch Page</h1>
            <video controls src={videoPrefix + videoSrc}/>
        </div>
    );
}