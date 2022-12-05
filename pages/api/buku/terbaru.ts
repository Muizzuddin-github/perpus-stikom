import type { NextApiRequest, NextApiResponse } from 'next'
import mysql from '../../../model/sqlite3'

interface Buku {
    isbn: string,
    judul_buku: string,
    gambar_buku: string,
    pengarang: string
}
  
type Data = {
    status: string
    data: Array<Buku>
}
  
export default async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    if(req.method !== 'GET') return res.status(405).json({status: "method not allowed", data: []})

    try{
        const newBooks = await mysql('deskripsi').select('isbn','judul_buku','gambar_buku','pengarang').orderBy('created_at','desc').limit(6)
        return res.status(200).json({status: "success", data: newBooks})

    }catch(err: any){
        return res.status(500).json({status: err.message,data: []})
    }
}