import type { NextApiRequest, NextApiResponse } from 'next'
import sqlite3Conn from '../../../model/sqlite3'

interface Tambah {
    isbn: string
    judul_buku: string
    gambar_buku: string
    penerbit: string
    jumlah_halaman: string
    deskripsi: string
    nomor_rak: number
    pengarang: string
    stok_buku: number
    stok_tersedia: number
    id_kategori: number
}

interface Buku {
    isbn: string
    judul_buku: string
    gambar_buku: string
    pengarang: string
}
  
type Data = {
    status: string
    message: string
    data: Array<Buku>
}
  
export default async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    try{
        const db = await sqlite3Conn()
        if(req.method === 'GET'){
            const start = req.query.start || 0
            const limit = req.query.limit || 0
    
            const books = await db.all(`select isbn,judul_buku,gambar_buku,pengarang,jumlah_halaman from buku limit ${+limit} offset ${+start}`)
    
            return res.status(200).json({
                status: "success",
                message : "seluruh data buku", 
                data: books
            })
        }else if(req.method === 'POST'){
            
            const checkBuku = await db.all(`select * from buku where isbn = ${req.body.isbn}`)

            if(checkBuku.length){
                return res.status(400).json({
                    status: 'bad request',
                    message: 'isbn sudah ada',
                    data: []
                })
            }

            const {
                isbn,judul_buku,
                gambar_buku,penerbit,
                jumlah_halaman,deskripsi,
                nomor_rak,pengarang,
                stok_buku,stok_tersedia,
                id_kategori
            }: Tambah = req.body

            await db.run(`insert into buku (isbn,judul_buku,gambar_buku,penerbit,jumlah_halaman,deskripsi,nomor_rak,pengarang,stok_buku,stok_tersedia,id_kategori) values (?,?,?,?,?,?,?,?,?,?,?)`,[isbn,judul_buku,gambar_buku,penerbit,jumlah_halaman,deskripsi,nomor_rak,pengarang,stok_buku,stok_tersedia,id_kategori])
            return res.status(201).json({status : 'created',message: "buku berhasil ditambah",data: [req.body]})
        }else{
            return res.status(405).json({status: "method not allowed",message: "hanya boleh method GET dan POST saja",data: []})
        }


    }catch(err: any){
        return res.status(500).json({
            status: "internal server error",
            message: err.message,
            data: []
        })
    }
}