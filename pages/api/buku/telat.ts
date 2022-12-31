import { NextApiRequest,NextApiResponse } from "next";
import sqlite3Conn from "../../../model/sqlite3";

type Data = {
    status: string
    message: string
    data: Array<any>
}


export default async (req: NextApiRequest,res: NextApiResponse<Data>) => {
    if(req.method !== 'GET'){
        return res.status(405).json({
            status: "method not allowed",
            message: "hanya boleh method GET",
            data: []
        })
    }

    try{
        
    const telat = await (await sqlite3Conn()).all("SELECT * FROM peminjaman_buku WHERE DATETIME('now') > tanggal_pengembalian and status_peminjaman = true")

    return res.status(200).json({
        status: "success",
        message: 'data mahasiswa yang telat mengembalikan buku',
        data: telat
    })
    }catch(err: any){
        return res.status(500).json({
            status: 'internal server error',
            message: err.message,
            data: []
        })
    }

}