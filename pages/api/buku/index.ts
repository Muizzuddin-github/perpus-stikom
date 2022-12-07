import type { NextApiRequest, NextApiResponse } from 'next'
import sqlite3 from '../../../model/sqlite3'

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
        const start = req.query.start || 0
        const limit = req.query.limit || 0

        const books = await sqlite3('deskripsi').select('isbn','judul_buku','gambar_buku','pengarang','jumlah_halaman').limit(+limit).offset(+start)

        return res.status(200).json({status: "success", data: books})

    }catch(err: any){
        return res.status(500).json({status: err.message,data: []})
    }
}