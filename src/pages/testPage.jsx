import { useState } from "react"
import  mediaUpload from "../utils/mediaUpload"

export default function TestPage() {
    
    const [image , setImage] = useState(null)

    
    function fileUpload(){

        mediaUpload(image).then(
            (res)=>{
                console.log(res)

            }
        ).catch(
            (res)=>{
                console.log(res)
            }
        )
}

    return(
        <div className="w-full h-screen  flex justify-center items-center flex-col">
            
            <input type="file" className="file-input file-input-bordered w-full max-w-xs" 
            onChange={(e) => {

                setImage(e.target.files[0])
            }} />
            <button onClick={fileUpload} className="bg-green-500 text-white font-bold py-2 px-4 rounded">Upload</button>
        </div>
    )

}

//https://kfkwemmdbjfftxlntlcy.supabase.co
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtma3dlbW1kYmpmZnR4bG50bGN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMDMwNTUsImV4cCI6MjA2MjY3OTA1NX0.


// https://ooliuqeclaffydrwnaqh.supabase.co
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9vbGl1cWVjbGFmZnlkcnduYXFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2MzI0ODUsImV4cCI6MjA2OTIwODQ4NX0.3Q4CV9HnmlpTJXB-fyKj56-aSjuEYuGW9cc1ENxObME