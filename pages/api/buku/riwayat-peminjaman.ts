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

        const dipinjam = await db.all(`select pb.id_peminjaman, d.isbn,d.judul_buku,d.gambar_buku,d.penerbit,d.jumlah_halaman,d.deskripsi,d.pengarang,pb.tanggal_peminjaman,pb.tanggal_pengembalian from peminjaman_buku as pb join buku as d on pb.isbn=d.isbn where pb.status_peminjaman = false limit ${+limit} offset ${+start}`)

        return res.status(200).json({
            status: "success",
            message: "data buku yang sedang dipinjam",
            data: dipinjam
        })

    }catch(err: any){
        return res.status(500).json({status: 'internal server error',message: err.message,data: []})
    }
}