import { NextApiRequest,NextApiResponse } from "next";
import sqlite3Conn from "../../../model/sqlite3";

interface Ubah {
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

interface Detil {
    kode_buku: string
    nomor_rak: number
    judul_buku: string
    gambar_buku: string
    deskripsi: string
    pengarang: string
    penerbit: string
    isbn: string
}


type Data = {
    status: string
    message: string
    data: Array<Detil>
}

export default async function(req:NextApiRequest, res:NextApiResponse<Data>){


    try{
        const db = await sqlite3Conn()
        const checkBuku = await db.all(`select * from buku where isbn = ${req.query.isbn}`)
    
        
        if(!checkBuku.length) return res.status(404).json({
            status: "not found",
            message : "maaf data isbn tidak ditemukan",
            data: []
        })

        if(req.method === 'GET'){
            return res.status(200).json({
                status: "success",
                message: "detil buku",
                data: checkBuku
            })
    
        }else if(req.method === 'DELETE'){
            if(!checkBuku.length){
                return res.status(404).json({status: 'not found',message: 'buku tidak ada', data: []})
            }

            await db.run(`delete from buku where isbn = ${req.query.isbn}`)
            await db.run(`delete from peminjaman_buku where isbn = ${req.query.isbn}`)
            return res.status(200).json({status : 'success',message: "buku berhasil dihapus",data: checkBuku})
        }else if(req.method === 'PUT'){

            const {
                judul_buku,
                gambar_buku,penerbit,
                jumlah_halaman,deskripsi,
                nomor_rak,pengarang,
                stok_buku,stok_tersedia,
                id_kategori
            }: Ubah = req.body

           await db.run('update buku set judul_buku=?,gambar_buku=?,penerbit=?,jumlah_halaman=?,deskripsi=?,nomor_rak=?,pengarang=?,stok_buku=?,stok_tersedia=?,id_kategori=? where isbn=?',judul_buku,gambar_buku,penerbit,jumlah_halaman,deskripsi,nomor_rak,pengarang,stok_buku,stok_tersedia,id_kategori,req.query.isbn)

            return res.status(200).json({
                status : "succsess",
                message: "berhasil mengubah data",
                data: [req.body]
            })
        }else{
            return res.status(405).json({status: "method not allowed",message: "hanya boleh method GET DELETE dan PUT saja",data: []})
        }


    }catch(err: any){
        return res.status(500).json({
            status:'internal server error',
            message : err.message,
            data: []
        })
    }

}