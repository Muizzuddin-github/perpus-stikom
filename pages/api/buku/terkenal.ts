import { NextApiRequest,NextApiResponse } from "next";
import sqlite3Conn from "../../../model/sqlite3";


type Data = {
    status: string,
    data: Array<any>
}

export default async function(req: NextApiRequest, res: NextApiResponse<Data>){
    if(req.method !== 'GET') return res.status(405).json({status: "method not allowed",data: []})

    try{
        const data = await (await sqlite3Conn()).all('SELECT * FROM deskripsi_buku as db ORDER BY waktu_dibuat DESC limit 6')
        
        return res.status(200).json({status: "success",data})
    }catch(err: any){
        return res.status(500).json({status: err.message, data: []})
    }

}