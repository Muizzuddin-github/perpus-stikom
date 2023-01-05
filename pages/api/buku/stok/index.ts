import { NextApiRequest,NextApiResponse } from "next";
import sqlite3Conn from "../../../../model/sqlite3";

interface CountDigit{
    [key: string] : string
}

type Data = {
    status: string
    message: string
    data: Array<any>
}


export default async (req: NextApiRequest, res:NextApiResponse<Data>) => {
    try{

        const db = await sqlite3Conn()
        const checkBuku = await db.all('SELECT * FROM deskripsi_buku WHERE isbn=?',req.body.isbn)

        if(checkBuku.length === 0){
            return res.status(404).json({
                status: "not found",
                message: "isbn tidak ditemukan",
                data: []
            })
        }

        if(req.method === "POST"){
            const dataTerakhir = await db.all("SELECT * FROM buku WHERE isbn=? ORDER BY kode_buku DESC",req.body.isbn)

            let kode_buku: string = `${req.body.isbn}001`
            if(dataTerakhir.length){
                let countTerakhir = +dataTerakhir[0].kode_buku.slice(-3)
                countTerakhir++

                if(countTerakhir > 999){
                    return res.status(400).json({
                        status: "bad request",
                        message: "maaf maximal stok adalah 999",
                        data: []
                    })
                }
                
                const countDigit: CountDigit = {
                    "1" : `00${countTerakhir}`,
                    "2" : `0${countTerakhir}`,
                    "3" : String(countTerakhir)
                }

                const count: number = String(countTerakhir).length
                const kode = `${req.body.isbn}${countDigit[count]}`

                kode_buku = kode
                
            }

            await db.run("INSERT INTO buku (kode_buku,isbn,nomor_rak,id_kategori) VALUES (?,?,?,?)",[kode_buku,req.body.isbn,req.body.nomor_rak,req.body.id_kategori])

            return res.status(201).json({
                status: "created",
                message: "stok buku berhasil ditambah",
                data: []
            })


        }else{
            return res.status(405).json({
                status: "method not allowed",
                message: "hanya boleh POST",
                data: []
            })
        }
    }catch(err: any){
        return res.status(500).json({
            status: "internal server error",
            message: err.message,
            data: []
        })
    }
}
