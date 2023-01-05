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
    judul: string
    gambar: string
    jumlah_halaman: number
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
            const kategori = req.query.kategori || ''
            const judul = req.query.judul || ''

            let books: Array<Buku> = []

            if(kategori){
                if(judul){
                    books = await db.all(`SELECT db.isbn,db.judul,db.gambar,db.jumlah_halaman,db.pengarang FROM deskripsi_buku AS db INNER JOIN buku AS b ON db.isbn=b.isbn INNER JOIN kategori AS k ON b.id_kategori=k.id_kategori WHERE k.nama=? AND db.judul LIKE ? GROUP BY db.isbn LIMIT ? OFFSET ?`,kategori,`%${judul}%`,+limit,+start)
                }else{
                    books = await db.all(`SELECT db.isbn,db.judul,db.gambar,db.jumlah_halaman,db.pengarang FROM deskripsi_buku AS db INNER JOIN buku AS b ON db.isbn=b.isbn INNER JOIN kategori AS k ON b.id_kategori=k.id_kategori WHERE k.nama=? GROUP BY db.isbn LIMIT ? OFFSET ?`,kategori,+limit,+start)
                }
            }else if(judul){
                books = await db.all(`SELECT db.isbn,db.judul,db.gambar,db.jumlah_halaman,db.pengarang FROM deskripsi_buku AS db INNER JOIN buku AS b ON db.isbn=b.isbn INNER JOIN kategori AS k ON b.id_kategori=k.id_kategori WHERE db.judul LIKE ? GROUP BY db.isbn LIMIT ? OFFSET ?`,`%${judul}%`,+limit,+start)
            }else{
                books = await db.all(`SELECT db.isbn,db.judul,db.gambar,db.jumlah_halaman,db.pengarang FROM deskripsi_buku AS db INNER JOIN buku AS b ON db.isbn=b.isbn INNER JOIN kategori AS k ON b.id_kategori=k.id_kategori GROUP BY db.isbn LIMIT ? OFFSET ?`,+limit,+start)
            }
    
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

            const checkBuku = await db.all(`SELECT * FROM deskripsi_buku where isbn = ${parse.fields.isbn}`)

            if(checkBuku.length){
                // hapus file
                fs.unlinkSync(parse.files.gambar.filepath);
                return res.status(400).json({
                    status: 'bad request',
                    message: 'isbn sudah ada',
                    data: []
                })
            }
            
            // limit file 10mb
            const limiSize:number = 10 * 1024 * 1024

            if(parse.files.gambar.size > limiSize){

                // hapus file
                fs.unlinkSync(parse.files.gambar.filepath);
                return res.status(400).json({
                    status: "bad request",
                    message: "file yang anda upload terlalu besar max 10",
                    data: []
                })
            }

            // check file

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
            const gambar = moveUploadedFile(parse.files.gambar)
            const fields = parse.fields


            await db.run(`INSERT INTO deskripsi_buku (isbn,judul,gambar,penerbit,jumlah_halaman,deskripsi,pengarang) VALUES (?,?,?,?,?,?,?)`,[fields.isbn,fields.judul,gambar,fields.penerbit,+fields.jumlah_halaman,fields.deskripsi,fields.pengarang])

            return res.status(201).json({status : 'created',message: "buku berhasil ditambah",data: []})
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