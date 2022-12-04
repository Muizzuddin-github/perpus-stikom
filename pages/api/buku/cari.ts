import { NextApiRequest,NextApiResponse } from "next";
import sqlite3 from "../../../model/sqlite3";


interface Search {
    kode_buku: string
    judul_buku: string
    gambar_buku: string
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
            data = await sqlite3('buku').join('deskripsi','buku.isbn','deskripsi.isbn').where('deskripsi.judul_buku',judul).select('buku.kode_buku','buku.nomor_rak','deskripsi.judul_buku','deskripsi.gambar_buku','deskripsi.deskripsi','deskripsi.pengarang','deskripsi.penerbit','deskripsi.isbn')
        }else if(req.query.isbn){
            data = await sqlite3('buku').join('deskripsi','buku.isbn','deskripsi.isbn').where('deskripsi.isbn',req.query.isbn).select('buku.kode_buku','buku.nomor_rak','deskripsi.judul_buku','deskripsi.gambar_buku','deskripsi.deskripsi','deskripsi.pengarang','deskripsi.penerbit','deskripsi.isbn')
        }

        if(!data.length) return res.status(404).json({status: "not found",data: []})
        return res.status(200).json({status: "success",data})

    }catch(err: any){
        return res.status(500).json({status: err.message, data: []})
    }


}