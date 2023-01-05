import { NextApiRequest,NextApiResponse } from "next";
import sqlite3Conn from "../../../model/sqlite3";


type Data = {
    status : string,
    message: string
    data: Array<any>
}

export default async (req: NextApiRequest,res:NextApiResponse<Data>) => {
    if(req.method !== 'GET') return res.status(405).json({
        status: "method not allowed",
        message : 'request metho hanya boleh GET',
        data: []
    })

    try{

        const db = await sqlite3Conn()
        const start = req.query.start || 0
        const limit = req.query.limit || 0

        const riwayat = await db.all(`SELECT pb.kode_buku,pb.nim,pb.tanggal_peminjaman,pb.tanggal_pengembalian FROM peminjaman_buku AS pb INNER JOIN buku AS b on b.kode_buku=pb.kode_buku WHERE pb.status_peminjaman = false LIMIT ${limit} OFFSET ${start}`)

        return res.status(200).json({
            status: "success",
            message: "data buku yang sedang dipinjam",
            data: riwayat
        })

    }catch(err: any){
        return res.status(500).json({status: 'internal server error',message: err.message,data: []})
    }
}