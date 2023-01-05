import { NextApiRequest,NextApiResponse } from "next";
import sqlite3Conn from "../../../model/sqlite3";
import fs from 'fs'
import { parseBodyRequest,moveUploadedFile } from "../../../utils/funcUpload";

export const config = {
    api : {
      bodyParser : false
    }
}

interface Detil {
    isbn: string
    judul: string
    gambar: string
    penerbit: string
    jumlah_halaman: number
    deskripsi: string
    nomor_rak: number
    pengarang: string
    created_at: string
    id_kategori: number
    jumlah_stok: number
}


type Data = {
    status: string
    message: string
    data: Array<Detil>
}

export default async function(req:NextApiRequest, res:NextApiResponse<Data>){


    try{
        const db = await sqlite3Conn()
        const checkBuku = await db.all(`SELECT ds.isbn,ds.judul,ds.gambar,ds.penerbit,ds.jumlah_halaman,ds.deskripsi,buku.nomor_rak,ds.pengarang,buku.id_kategori, COUNT() as jumlah_stok ,COUNT() as jumlah_stok  FROM deskripsi_buku as ds LEFT JOIN buku ON ds.isbn=buku.isbn where ds.isbn = ${req.query.isbn} AND buku.status_peminjaman=false`)
        
        if(!checkBuku.length) return res.status(404).json({
            status: "not found",
            message : "maaf data isbn tidak ditemukan",
            data: []
        })

        if(req.method === 'GET'){
            return res.status(200).json({
                status: "success",
                message: "detil buku",
                data: checkBuku
            })
    
        }else if(req.method === 'DELETE'){
            if(!checkBuku.length){
                return res.status(404).json({status: 'not found',message: 'buku tidak ada', data: []})
            }

            // check apakah buku sedang dipinjam atau tidak
        const checkDipinjam = await db.all(`SELECT * FROM peminjaman_buku as pb INNER JOIN buku ON pb.kode_buku=buku.kode_buku WHERE buku.isbn=${req.query.isbn} and pb.status_peminjaman = true`)
            if(checkDipinjam.length){
                return res.status(400).json({status: 'bad request',message: 'buku sedang dipinjam, tidak boleh dihapus', data: []})
            }

            
            await db.run(`DELETE FROM deskripsi_buku WHERE isbn = ${req.query.isbn}`)
            await db.run(`DELETE FROM buku WHERE isbn = ${req.query.isbn}`)

            // hapus gambar
            fs.unlinkSync(`${process.cwd()}/public/images/${checkBuku[0].gambar}`)
            return res.status(200).json({status : 'success',message: "buku berhasil dihapus",data: []})
        }else if(req.method === 'PUT'){


            const form = await parseBodyRequest(req)
            const strJSON = JSON.stringify(form)
            const parse = JSON.parse(strJSON)
            const buku = parse.fields
            let gambar: string = ''

            if(parse.files.gambar){
                const mimetypeFile = parse.files.gambar.mimetype.split('/')
                if(mimetypeFile[0] !== 'image'){
                    // hapus file
                    fs.unlinkSync(parse.files.gambar.filepath);
                    return res.status(400).json({
                        status: "bad request",
                        message: "file diupload hanya boleh gambar",
                        data: []
                    })
                }
    
    
                // check ext file yang diizinkan
                const ext = ['jpeg','jpg','png']
    
                if(!ext.includes(mimetypeFile[1])){
                    fs.unlinkSync(parse.files.gambar.filepath);
                    return res.status(400).json({
                        status: "bad request",
                        message: "ext file hanya boleh png jpg dan jpeg",
                        data: []
                    })
                }
    
                // ubah file biner yang diupload jadi file asli
                gambar = moveUploadedFile(parse.files.gambar)
            }else{
                gambar = checkBuku[0].gambar
            }
            
            
            await db.run('update deskripsi_buku set judul=?,gambar=?,penerbit=?,jumlah_halaman=?,deskripsi=?,pengarang=? where isbn=?',buku.judul_buku,gambar,buku.penerbit,+buku.jumlah_halaman,buku.deskripsi,buku.pengarang,req.query.isbn)

            if(parse.files.gambar){
                fs.unlinkSync(`${process.cwd()}/public/images/${checkBuku[0].gambar}`)
            }
            
            return res.status(200).json({
                status : "succsess",
                message: "berhasil mengubah data",
                data: []
            })
        }else{
            return res.status(405).json({status: "method not allowed",message: "hanya boleh method GET DELETE dan PUT saja",data: []})
        }


    }catch(err: any){
        return res.status(500).json({
            status:'internal server error',
            message : err.message,
            data: []
        })
    }

}