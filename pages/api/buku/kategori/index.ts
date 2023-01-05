import { NextApiRequest,NextApiResponse } from "next";
import sqlite3Conn from "../../../../model/sqlite3";

interface kategori {
    id_kategori: number
    nama: string
}

type Data = {
    status: string
    message: string
    data: Array<kategori>
}

export default async function(req: NextApiRequest, res: NextApiResponse<Data>){

    try{
        const db = await sqlite3Conn()
        if(req.method === 'POST'){

            const checkKategori = await db.all('SELECT * FROM kategori WHERE nama = ?',req.body.nama)

            if(checkKategori.length){
                return res.status(400).json({
                    status: 'bad request',
                    message: "kategori sudah ada",
                    data: []
                })
            }

            const data = await db.all('INSERT INTO kategori (nama) VALUES (?)',[req.body.nama])
            return res.status(200).json({
                status: "success",
                message: "berhasil menambah kategori",
                data
            })
        }else if(req.method == 'GET'){
            const data = await db.all('select * from kategori')
            return res.status(200).json({
                status: "success",
                message: "semua kategori",
                data
            })
        }else{
            return res.status(405).json({
                status: "method not allowed",
                message: "hanya boleh POST dan GET",
                data: []
            })
        }
        
    }catch(err: any){
        return res.status(500).json({
            status: "internal server error",
            message: err.message, 
            data: []
        })
    }

}