import { NextApiRequest,NextApiResponse } from "next";
import sqlite3 from "../../../../model/sqlite3";

type Data = {
    status: string
    data: Array<any>
}


export default async function(req: NextApiRequest, res: NextApiResponse<Data>){
    if(req.method !== 'GET') return res.status(405).json({status: 'method not allowed',data: []})

    try{
        const stok = await sqlite3('buku').join('deskripsi','buku.isbn','deskripsi.isbn').where({'deskripsi.isbn': req.query.isbn,'buku.status_dipinjam': false}).groupBy('deskripsi.judul_buku').count({stok : 'deskripsi.judul_buku'}).select('deskripsi.judul_buku')

        return res.status(200).json({status: 'success', data: stok})

    }catch(err: any){
        return res.status(500).json({status: err.message, data: []})
    }
}