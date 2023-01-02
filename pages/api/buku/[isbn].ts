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
    judul_buku: string
    gambar_buku: string
    penerbit: string
    jumlah_halaman: number
    deskripsi: string
    nomor_rak: number
    pengarang: string
    stok_buku: number
    stok_tersedia: number
    created_at: string
    id_kategori: number
}


type Data = {
    status: string
    message: string
    data: Array<Detil>
}

export default async function(req:NextApiRequest, res:NextApiResponse<Data>){


    try{
        const db = await sqlite3Conn()
        const checkBuku = await db.all(`select * from buku where isbn = ${req.query.isbn}`)
        
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
            const checkDipinjam = await db.all(`select * from peminjaman_buku where isbn=${req.query.isbn} and status_peminjaman = true`)
            if(checkDipinjam.length){
                return res.status(400).json({status: 'bad request',message: 'buku sedang dipinjam, tidak boleh dihapus', data: []})
            }

            // hapus gambar
            fs.unlinkSync(`${process.cwd()}/public/images/${checkBuku[0].gambar_buku}`)

            await db.run(`delete from buku where isbn = ${req.query.isbn}`)
            await db.run(`delete from peminjaman_buku where isbn = ${req.query.isbn}`)
            return res.status(200).json({status : 'success',message: "buku berhasil dihapus",data: checkBuku})
        }else if(req.method === 'PUT'){


            const form = await parseBodyRequest(req)
            const strJSON = JSON.stringify(form)
            const parse = JSON.parse(strJSON)
            const buku = parse.fields
            let gambar_buku = ''

            if(parse.files.gambar_buku){
                const mimetypeFile = parse.files.gambar_buku.mimetype.split('/')
                if(mimetypeFile[0] !== 'image'){
                    // hapus file
                    fs.unlinkSync(parse.files.gambar_buku.filepath);
                    return res.status(400).json({
                        status: "bad request",
                        message: "file diupload hanya boleh gambar",
                        data: []
                    })
                }
    
    
                // check ext file yang diizinkan
                const ext = ['jpeg','jpg','png']
    
                if(!ext.includes(mimetypeFile[1])){
                    fs.unlinkSync(parse.files.gambar_buku.filepath);
                    return res.status(400).json({
                        status: "bad request",
                        message: "ext file hanya boleh png jpg dan jpeg",
                        data: []
                    })
                }
    
                // ubah file biner yang diupload jadi file asli
                gambar_buku = moveUploadedFile(parse.files.gambar_buku)
            }else{
                gambar_buku = checkBuku[0].gambar_buku
            }
            

            // ada yang pinjam buku ini ga
            if(checkBuku[0].stok_buku > checkBuku[0].stok_tersedia){
                
                // check stok buku baru tidak boleh < dari stok buku
                if(parse.fields.stok_buku < checkBuku[0].stok_buku){
                    fs.unlinkSync(`${process.cwd()}/public/images/${gambar_buku}`)
                    return res.status(400).json({
                        status: "bad request",
                        message: "stok yang anda ubah tidak boleh lebih kecil dari stok yang tersedia karena buku sudah ada yang meminjam",
                        data: []
                    })
                }else{

                    const selisih = +buku.stok_buku - checkBuku[0].stok_buku
                    const stok_tersedia = selisih + checkBuku[0].stok_tersedia

                    await db.run('update buku set judul_buku=?,gambar_buku=?,penerbit=?,jumlah_halaman=?,deskripsi=?,nomor_rak=?,pengarang=?,stok_buku=?,stok_tersedia=?,id_kategori=? where isbn=?',buku.judul_buku,gambar_buku,buku.penerbit,+buku.jumlah_halaman,buku.deskripsi,+buku.nomor_rak,buku.pengarang,+buku.stok_buku,+stok_tersedia,+buku.id_kategori,req.query.isbn)

                    if(parse.files.gambar_buku){
                        fs.unlinkSync(`${process.cwd()}/public/images/${checkBuku[0].gambar_buku}`)
                    }

                    return res.status(200).json({
                        status : "succsess",
                        message: "berhasil mengubah data",
                        data: []
                    })
                }
            }
        
            
            await db.run('update buku set judul_buku=?,gambar_buku=?,penerbit=?,jumlah_halaman=?,deskripsi=?,nomor_rak=?,pengarang=?,stok_buku=?,stok_tersedia=?,id_kategori=? where isbn=?',buku.judul_buku,gambar_buku,buku.penerbit,+buku.jumlah_halaman,buku.deskripsi,+buku.nomor_rak,buku.pengarang,+buku.stok_buku,+buku.stok_buku,+buku.id_kategori,req.query.isbn)

            if(parse.files.gambar_buku){
                fs.unlinkSync(`${process.cwd()}/public/images/${checkBuku[0].gambar_buku}`)
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