import type { NextApiRequest, NextApiResponse } from 'next'
import sqlite3Conn from '../../../model/sqlite3'
import { parseBodyRequest,moveUploadedFile } from '../../../utils/funcUpload'
import fs from 'fs'


export const config = {
    api : {
      bodyParser : false
    }
}

interface Buku {
    isbn: string
    judul_buku: string
    gambar_buku: string
    pengarang: string
}
  
type Data = {
    status: string
    message: string
    data: Array<Buku>
}
  
export default async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    try{
        const db = await sqlite3Conn()
        if(req.method === 'GET'){
            const start = req.query.start || 0
            const limit = req.query.limit || 0
    
            const books = await db.all(`select isbn,judul_buku,gambar_buku,pengarang,jumlah_halaman from buku limit ${+limit} offset ${+start}`)
    
            return res.status(200).json({
                status: "success",
                message : "seluruh data buku", 
                data: books
            })
        }else if(req.method === 'POST'){

            // check folder images
            if(!fs.existsSync('public/images')){
                fs.mkdirSync('public/images')
            }
  
            // ambil informasi dab upload file ke uploadDir
            const form = await parseBodyRequest(req)
            const strJSON = JSON.stringify(form)
            const parse = JSON.parse(strJSON)

            const checkBuku = await db.all(`select * from buku where isbn = ${parse.fields.isbn}`)

            if(checkBuku.length){
                // hapus file
                fs.unlinkSync(parse.files.gambar_buku.filepath);
                return res.status(400).json({
                    status: 'bad request',
                    message: 'isbn sudah ada',
                    data: []
                })
            }
            
            // limit file 10mb
            const limiSize:number = 10 * 1024 * 1024

            if(parse.files.gambar_buku.size > limiSize){

                // hapus file
                fs.unlinkSync(parse.files.gambar_buku.filepath);
                return res.status(400).json({
                    status: "bad request",
                    message: "file yang anda upload terlalu besar max 10",
                    data: []
                })
            }

            // check file

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
            const gambar_buku = moveUploadedFile(parse.files.gambar_buku)
            const fields = parse.fields


            await db.run(`insert into buku (isbn,judul_buku,gambar_buku,penerbit,jumlah_halaman,deskripsi,nomor_rak,pengarang,stok_buku,stok_tersedia,id_kategori) values (?,?,?,?,?,?,?,?,?,?,?)`,[fields.isbn,fields.judul_buku,gambar_buku,fields.penerbit,+fields.jumlah_halaman,fields.deskripsi,+fields.nomor_rak,fields.pengarang,+fields.stok_buku,+fields.stok_buku,+fields.id_kategori])

            return res.status(201).json({status : 'created',message: "buku berhasil ditambah",data: [fields]})
        }else{
            return res.status(405).json({status: "method not allowed",message: "hanya boleh method GET dan POST saja",data: []})
        }


    }catch(err: any){
        return res.status(500).json({
            status: "internal server error",
            message: err.message,
            data: []
        })
    }
}