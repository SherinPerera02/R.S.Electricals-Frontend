import { createClient } from "@supabase/supabase-js"

const url = "https://ooliuqeclaffydrwnaqh.supabase.co"
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9vbGl1cWVjbGFmZnlkcnduYXFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2MzI0ODUsImV4cCI6MjA2OTIwODQ4NX0.3Q4CV9HnmlpTJXB-fyKj56-aSjuEYuGW9cc1ENxObME"
        
const supabase = createClient(url,key)

export default function fileUpload(file){

    const mediaUploadPromise = new Promise(
        (resolve, reject) => {

            if(file == null){
                reject("No file selected")
                return
            }
            
            const timeStamp = new Date().getTime()
            const newName = timeStamp + "_" + file.name

            supabase.storage.from("images").upload(newName,file,{
                upsert : false,
                cacheControl : "3600"
            }).then((uploadResult) => {
                console.log("Upload result:", uploadResult);
                
                if (uploadResult.error) {
                    console.error("Upload error:", uploadResult.error);
                    reject("Error uploading file: " + uploadResult.error.message);
                    return;
                }
                
                const { data } = supabase.storage.from("images").getPublicUrl(newName);
                console.log("Public URL data:", data);
                
                if (data && data.publicUrl) {
                    resolve(data.publicUrl);
                } else {
                    reject("Failed to get public URL");
                }
            }).catch((error) => {
                console.error("Upload catch error:", error);
                reject("Error uploading file: " + error.message);
            })
        }
 )        
    return mediaUploadPromise 
}