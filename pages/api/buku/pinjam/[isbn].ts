import { NextApiRequest,NextApiResponse } from "next";
import sqlite3 from "../../../../model/sqlite3";

interface Info {
    kode_buku: string
    isbn: string
}

type Data = {
    status: string,
    data: Array<Info>
}


export default async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    if(req.method !== 'GET') return res.status(405).json({status : "method not allowed", data:[]})

    try{
        const getRandomBook = await sqlite3('buku').where({isbn: req.query.isbn, status_dipinjam: false}).select('kode_buku','isbn').first()

        if(!getRandomBook){
            return res.status(404).json({status: "Maaf stok buku sudah habis",data: []})
        }

        // // update status dipinjam
        await sqlite3('buku').update({status_dipinjam: true}).where('kode_buku',getRandomBook.kode_buku)

        await sqlite3('peminjaman_buku').insert({nim_mahasiswa: '1121101710',kode_buku: getRandomBook.kode_buku,tanggal_pengembalian: new Date().toISOString()})

        return res.status(201).json({status: "success", data: [getRandomBook]})


    }catch(err: any){
        return res.status(500).json({status: err.message, data: []})
    }
}