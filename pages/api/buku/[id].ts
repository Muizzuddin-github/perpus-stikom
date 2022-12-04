import { NextApiRequest,NextApiResponse } from "next";
import sqlite3 from "../../../model/sqlite3";

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
    status: string,
    data: Array<Detil>
}

export default async function(req:NextApiRequest, res:NextApiResponse<Data>){
    if(req.method !== 'GET') return res.status(405).json({status: "method not allowed",data: []})


    try{
        const bookDetails = await sqlite3('buku').join('deskripsi','buku.isbn','deskripsi.isbn').where('buku.kode_buku',req.query.id).select('buku.kode_buku','buku.nomor_rak','deskripsi.judul_buku','deskripsi.gambar_buku','deskripsi.deskripsi','deskripsi.pengarang','deskripsi.penerbit','deskripsi.isbn')

        if(!bookDetails.length) return res.status(404).json({status: "not found",data: []})
        return res.status(200).json({status: "success",data: bookDetails})

    }catch(err: any){
        return res.status(500).json({status: err.message,data: []})
    }

}