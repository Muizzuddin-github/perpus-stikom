import type { NextApiRequest, NextApiResponse } from 'next'
import mysql from '../../../model/mysql'

interface Buku {
    kode_buku: string,
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
        const books = await mysql('buku').join('deskripsi','buku.isbn','deskripsi.isbn').where('buku.status_dipinjam',false).orderBy('buku.created_at','asc').limit(20).select('buku.kode_buku','deskripsi.judul_buku','deskripsi.gambar_buku','deskripsi.pengarang')


        return res.status(200).json({status: "success", data: books})

    }catch(err: any){
        return res.status(500).json({status: err.message,data: []})
    }
}