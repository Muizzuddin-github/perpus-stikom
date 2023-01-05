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

    if(req.method !== 'POST'){
        return res.status(405).json({
            status: "method not allowed",
            message: "hanya boleh method GET saja",
            data: []
        })
    }


    try{
        const db = await sqlite3Conn()
        const checkMhs = await db.all('SELECT * FROM mahasiswa WHERE nim=?',req.body.nim)

        if(checkMhs.length === 0){
            return res.status(404).json({
                status: "not found",
                message : "maaf nim mahasiswa tidak ditemukan",
                data: []
            })
        }

        const checkBuku = await db.get('SELECT * FROM buku WHERE kode_buku=?',req.body.kode_buku)
    
        
        if(!checkBuku){
            return res.status(404).json({
                status: "not found",
                message : "maaf kode buku tidak ditemukan",
                data: []
            })
        }else if(checkBuku.status_peminjaman){
            return res.status(404).json({
                status: "not found",
                message : "maaf kode buku ini sudah ada yang meminjam",
                data: []
            })
        }

        

        await db.run(`UPDATE buku SET status_peminjaman=? where kode_buku=?`,true,req.body.kode_buku)

        const tigaHariKedepan: number = Date.now() + 259200000
        const date:Date = new Date(tigaHariKedepan)
        const tanggal = date.toISOString().slice(0,10)
        const waktu = date.toISOString().slice(11,-5)

        await db.run('INSERT INTO peminjaman_buku (nim,kode_buku,tanggal_pengembalian,status_peminjaman) values (?,?,?,?)',[req.body.nim,req.body.kode_buku,`${tanggal} ${waktu}`,true])

        return res.status(200).json({
            status: "success",
            message: "berhasil meminjam",
            data: []
        })


    }catch(err: any){
        return res.status(500).json({
            status:'internal server error',
            message : err.message,
            data: []
        })
    }

}