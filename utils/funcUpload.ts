import formidable from "formidable";
import { NextApiRequest } from "next";
import fs from 'fs'


export const parseBodyRequest = (
    req: NextApiRequest
    ):Promise<{fields: formidable.Fields; files: formidable.File}> => {

    const options: formidable.Options = {
      uploadDir : "public/images"
    } 

    return new Promise((resolve: any,reject: any) =>{
      const form = formidable(options)
      form.parse(req,(err,fields: formidable.Fields,files: formidable.Files) => {
        if(err){
          reject('err')
        }

        resolve({fields,files})
      })
    })
  
  
}

export const moveUploadedFile = (file: any) => {
  const waktu = Date.now()
  const newFileName = `${waktu}_${file.originalFilename}`
  const data = fs.readFileSync(file.filepath);
  fs.writeFileSync(`public/images/${newFileName}`, data);
  fs.unlinkSync(file.filepath);
  return newFileName
  
};