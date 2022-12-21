import type { NextApiRequest, NextApiResponse } from 'next'
import sqlite3Conn from '../../model/sqlite3'

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
    const db = await sqlite3Conn()
    const mhs = await db.all('select * from mahasiswa')
    return res.status(200).json({status : "success",data : mhs})

  }catch(err: any){
    return res.status(500).json({status: err.message,data: []})
  }
}