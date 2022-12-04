import { NextApiRequest,NextApiResponse } from "next";
import mysql from "../../../model/sqlite3";


type Data = {
    status: string,
    data: Array<any>
}

export default async function(req: NextApiRequest, res: NextApiResponse<Data>){
    if(req.method !== 'GET') return res.status(405).json({status: "method not allowed",data: []})

    try{
        const data = await mysql({pb: "peminjaman_buku"}).join({b: "buku"},'pb.kode_buku','b.kode_buku').join({d: "deskripsi"},'b.isbn','d.isbn').select('pb.id_pinjaman','d.judul_buku','d.gambar_buku','d.pengarang').groupBy('d.judul_buku').count({jumlah_dipinjam : 'd.judul_buku'}).orderBy('jumlah_dipinjam','desc').limit(6)
        
        return res.status(200).json({status: "success",data})
    }catch(err: any){
        return res.status(500).json({status: err.message, data: []})
    }

}