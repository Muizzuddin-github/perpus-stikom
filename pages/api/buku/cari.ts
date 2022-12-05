import { NextApiRequest,NextApiResponse } from "next";
import sqlite3 from "../../../model/sqlite3";


interface Search {
    isbn: string,
    judul_buku: string,
    gambar_buku: string,
    pengarang: string
}

type Data = {
    status: string,
    data: Array<Search>
}


export default async function(req: NextApiRequest, res: NextApiResponse<Data>){
    if(req.method !== 'GET') return res.status(405).json({status: "method not allowed", data: []})

    try{
        let data: Array<Search> = []
        if(req.query.judul){
            const judul: string = req.query.judul[0].toUpperCase() + req.query.judul.slice(1)
            data = await sqlite3('deskripsi').where('judul_buku',judul).select('isbn','judul_buku','gambar_buku','pengarang').limit(12)
        }else if(req.query.isbn){
            data = await sqlite3('deskripsi').where('isbn',req.query.isbn).select('isbn','judul_buku','gambar_buku','pengarang').limit(12)
        }

        if(!data.length) return res.status(404).json({status: "not found",data: []})
        return res.status(200).json({status: "success",data})

    }catch(err: any){
        return res.status(500).json({status: err.message, data: []})
    }


}