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

        const checkMahasiswa = await db.get('select * from mahasiswa where nim_mahasiswa=?',req.query.nim)

        if(!checkMahasiswa){
            return res.status(404).json({
                status: 'not found',
                message: 'nim mahasiswa tidak ditemukan',
                data: []
            })
        }

        const checkBuku = await db.get('select * from buku where isbn=?',req.query.isbn)

        if(!checkBuku){
            return res.status(404).json({
                status: 'not found',
                message: 'isbn buku tidak ditemukan',
                data: []
            })
        }

        if(checkBuku.stok_tersedia >= checkBuku.stok_buku){
            return res.status(400).json({
                status: "bad request",
                message: "buku yang dikembalikan sudah sesuai dengan stok buku",
                data: []

            })
        }
        


        await db.run('update buku set stok_tersedia=stok_tersedia + 1 where isbn=?',req.query.isbn)
        await db.run('update peminjaman_buku set status_peminjaman=? where nim_mahasiswa=? and isbn=? and status_peminjaman=?',true,req.query.nim,req.query.isbn,false)

        return res.status(200).json({
            status: "success",
            message: "peminjaman buku telah selesai",
            data: []
        })

    }catch(err: any){
        return res.status(500).json({
            status : "internal server error",
            message: err.message,
            data: []
        })
    }

}