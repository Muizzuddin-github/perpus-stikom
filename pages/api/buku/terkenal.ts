import { NextApiRequest,NextApiResponse } from "next";
import sqlite3Conn from "../../../model/sqlite3";


type Data = {
    status: string,
    data: Array<any>
}

export default async function(req: NextApiRequest, res: NextApiResponse<Data>){
    if(req.method !== 'GET') return res.status(405).json({status: "method not allowed",data: []})

    try{
        const data = await (await sqlite3Conn()).all('select buku.isbn,buku.judul_buku,buku.gambar_buku,buku.pengarang,buku.jumlah_halaman,count(*) as dipinjam_sebanyak from peminjaman_buku inner join buku on buku.isbn=peminjaman_buku.isbn group by buku.isbn order by dipinjam_sebanyak desc,peminjaman_buku.tanggal_peminjaman asc')
        
        return res.status(200).json({status: "success",data})
    }catch(err: any){
        return res.status(500).json({status: err.message, data: []})
    }

}