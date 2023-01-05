import { NextApiRequest,NextApiResponse } from "next";
import sqlite3Conn from "../../../model/sqlite3";


type Data = {
    status: string
    message: String
    data: Array<any>
}


export default async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    if(req.method !== 'GET') return res.status(405).json({
        status: "method not allowed",
        message: "hanya boleh menggunakan GET",
        data : []
    })


    try{

        const db = await sqlite3Conn()

        const checkMahasiswa = await db.get('SELECT * FROM peminjaman_buku WHERE nim=? AND status_peminjaman=?',req.query.nim,true)

        if(!checkMahasiswa){
            return res.status(404).json({
                status: 'not found',
                message: 'mahasiswa tidak sedang meminjam buku',
                data: []
            })
        }

        const checkBuku = await db.get('SELECT * FROM peminjaman_buku WHERE nim = ? AND kode_buku=? AND status_peminjaman=?',req.query.nim,req.query.kode,true)

        if(!checkBuku){
            return res.status(404).json({
                status: 'not found',
                message: 'kode buku tidak ditemukan',
                data: []
            })
        }

        await db.run('UPDATE buku SET status_peminjaman=? WHERE kode_buku=?',false,req.query.kode)

        await db.run('UPDATE peminjaman_buku SET status_peminjaman = false WHERE status_peminjaman = true AND kode_buku = 9789794336052001 AND nim = 1121101710')


        return res.status(200).json({
            status: "success",
            message: "peminjaman buku telah selesai",
            data: [checkBuku]
        })

    }catch(err: any){
        return res.status(500).json({
            status : "internal server error",
            message: err.message,
            data: []
        })
    }

}