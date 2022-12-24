import { NextApiRequest,NextApiResponse } from "next";
import sqlite3Conn from "../../../model/sqlite3";

interface kategori {
    id_kategori: number
    kategori: string
}

type Data = {
    status: string,
    data: Array<kategori>
}

export default async function(req: NextApiRequest, res: NextApiResponse<Data>){
    if(req.method !== 'GET') return res.status(405).json({status: "method not allowed",data: []})

    try{
        const data = await (await sqlite3Conn()).all('select * from kategori')
        
        return res.status(200).json({status: "success",data})
    }catch(err: any){
        return res.status(500).json({status: err.message, data: []})
    }

}