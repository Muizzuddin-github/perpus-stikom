import { NextApiRequest,NextApiResponse } from "next";
import sqlite3Conn from "../../../../model/sqlite3";

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

    if(req.method !== 'GET'){
        return res.status(405).json({
            status: "method not allowed",
            message: "hanya boleh method GET saja",
            data: []
        })
    }


    try{
        const db = await sqlite3Conn()
        const checkBuku = await db.get(`select * from buku where isbn = ${req.query.isbn}`)
    
        
        if(!checkBuku) return res.status(404).json({
            status: "not found",
            message : "maaf data isbn tidak ditemukan",
            data: []
        })

        const checkStok: number = checkBuku.stok_tersedia
        if(checkStok <= 0){
            return res.status(400).json({
                status: "bad request",
                message: "stok buku telah habis",
                data: []
            })
        }

        await db.run(`update buku set stok_tersedia=? where isbn=?`,checkStok - 1,req.query.isbn)
        const date = new Date()
        const tanggal = date.toISOString().slice(0,10)
        const waktu = date.toISOString().slice(11,-5)

        await db.run('insert into peminjaman_buku (nim_mahasiswa,isbn,tanggal_pengembalian,status_peminjaman) values (?,?,?,?)',['1121101710',checkBuku.isbn,`${tanggal} ${waktu}`,true])

        checkBuku.stok_tersedia--
        return res.status(200).json({
            status: "success",
            message: "berhasil meminjam",
            data: [checkBuku]
        })


    }catch(err: any){
        return res.status(500).json({
            status:'internal server error',
            message : err.message,
            data: []
        })
    }

}