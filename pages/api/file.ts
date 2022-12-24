import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import { parseBodyRequest,moveUploadedFile } from '../../utils/funcUpload'


/* 

matikan body parse agar parsenya dihandle oleh formidable

Fitur body parser merupakan sebuah mekanisme yang digunakan untuk mengubah data yang dikirimkan ke API dari format asli menjadi format yang lebih mudah diproses oleh AP
*/
export const config = {
  api : {
    bodyParser : false
  }
}

interface Mahasiswa {
  id_mahasiswa: string,
  nama: string,
  jurusan: string
}

type Data = {
  status: string
  data: Array<Mahasiswa>
}







export default async (req: NextApiRequest, res: NextApiResponse<Data>) => {

  try{

    if(!fs.existsSync('public/images')){
      fs.mkdirSync('public/images')
    }


    
    const form = await parseBodyRequest(req)

    // jadikan data json dari resolve 
    const strJSON = JSON.stringify(form)
    // jadikan object dits
    const parse = JSON.parse(strJSON)

    /*
    pindahkan file dari path C user app data local temp 
    ketempat yang diinginkan 
    */
    moveUploadedFile(parse.files.file)

    



    return res.status(200).json({status : "success",data : []})

  }catch(err: any){
    return res.status(500).json({status: err.message,data: []})
  }
}