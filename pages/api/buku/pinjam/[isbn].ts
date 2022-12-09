import { NextApiRequest,NextApiResponse } from "next";
import sqlite3 from "../../../../model/sqlite3";

type Data = {
    status: string,
    data: Array<any>
}


export default async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    if(req.method !== 'GET') return res.status(405).json({status : "method not allowed", data:[]})

    try{
        const getRandomBook = await sqlite3('buku').where({isbn: req.query.isbn, status_dipinjam: false}).first()

        // // update status dipinjam
        await sqlite3('buku').update({status_dipinjam: true}).where('kode_buku',getRandomBook.kode_buku)

        const bukuDipinjam = await sqlite3('peminjaman_buku').insert({nim_mahasiswa: '1121101710',kode_buku: getRandomBook.kode_buku,tanggal_pengembalian: new Date()})

        return res.status(200).json({status: "success", data: bukuDipinjam})


    }catch(err: any){
        return res.status(500).json({status: err.message, data: []})
    }
}