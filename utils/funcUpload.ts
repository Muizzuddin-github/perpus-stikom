import formidable from "formidable";
import { NextApiRequest } from "next";
import fs from 'fs'


export const parseBodyRequest = (
    req: NextApiRequest
    ):Promise<{fields: formidable.Fields; files: formidable.File}> => {

    const options: formidable.Options = {
      uploadDir : "public/images"
    } 

    /* 
    ambil request dan ambil struktur request yang dikirimkan 
    dan ubah menjadi struktur yang mudah dibaca (parse)

    dan upload file di path C user app data local temp
    dan kembalikan fields atau data selain file

    atau jika ada optionnnya maka diupload di
    uploadDir: path

    dan files akan mengembalikan informasi file yang telah diupload
    */
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
  // baca data dari path C user app data local temp secara default

  // atau jika ada option baca dari option untuk pathnya
  const data = fs.readFileSync(file.filepath);
  // simpan ditempat diinginkan
  fs.writeFileSync(`public/images/${newFileName}`, data);
  // hapus data dari path C user app data local temp secara default
  // sesuai option jika ada
  fs.unlinkSync(file.filepath);

  return newFileName
  
};