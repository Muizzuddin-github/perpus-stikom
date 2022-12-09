import type { NextApiRequest, NextApiResponse } from 'next'
import sqlite3 from '../../../../model/sqlite3'

interface Peminjaman {
    isbn: string,
    judul_buku: string
    gambar_buku: string
    penerbit: string
    pengarang: string
    jumlah_halaman: number
    tanggal_peminjaman: string
    tanggal_pengembalian: string
}
  
type Data = {
    status: string
    data: Array<any>
}
  
export default async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    if(req.method !== 'GET') return res.status(405).json({status: "method not allowed", data: []})

    try{
        if(req.query.status === 'proses'){
            const pinjaman = await sqlite3('peminjaman_buku').join('buku','peminjaman_buku.kode_buku','buku.kode_buku').join('deskripsi','deskripsi.isbn','buku.isbn').select('deskripsi.isbn','deskripsi.judul_buku','deskripsi.gambar_buku','deskripsi.penerbit','deskripsi.pengarang','deskripsi.jumlah_halaman','peminjaman_buku.tanggal_peminjaman','peminjaman_buku.tanggal_pengembalian').where({'peminjaman_buku.status_peminjaman': false,'peminjaman_buku.nim_mahasiswa': '1121101710'})

            if(!pinjaman.length) return res.status(404).json({status: 'anda belum pernah meminjam',data: []})
            
            return res.status(200).json({status: "success", data: pinjaman})
        }else if(req.query.status === 'selesai'){
            const pinjaman = await sqlite3('peminjaman_buku').join('buku','peminjaman_buku.kode_buku','buku.kode_buku').join('deskripsi','deskripsi.isbn','buku.isbn').select('deskripsi.isbn','deskripsi.judul_buku','deskripsi.gambar_buku','deskripsi.penerbit','deskripsi.pengarang','deskripsi.jumlah_halaman','peminjaman_buku.tanggal_peminjaman','peminjaman_buku.tanggal_pengembalian').where({'peminjaman_buku.status_peminjaman': true,'peminjaman_buku.nim_mahasiswa': '1121101710'}).limit(10)

            if(!pinjaman.length) return res.status(404).json({status: 'anda belum pernah meminjam',data: []})
            
            return res.status(200).json({status: "success", data: pinjaman})
        }else{
            return res.status(400).json({status: "pilih proses atau selesai diparamter url",data: []})
        }
        

       

    }catch(err: any){
        return res.status(500).json({status: err.message,data: []})
    }
}