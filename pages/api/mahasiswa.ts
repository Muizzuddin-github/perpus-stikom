import type { NextApiRequest, NextApiResponse } from 'next'
import mysql from '../../model/sqlite3'

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
  if(req.method !== "GET") return res.status(405).json({status : "method not allowed",data : []})

  try{
    const mahasiswa = await mysql.select('*').from("mahasiswa")
    return res.status(200).json({status : "success",data : mahasiswa})

  }catch(err: any){
    return res.status(500).json({status: err.message,data: []})
  }
}