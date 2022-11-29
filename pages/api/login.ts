import { NextApiRequest,NextApiResponse } from "next";
import jwt from 'jsonwebtoken'
import mysql from "../../model/mysql";
import {serialize} from 'cookie'

interface Option {
    expiresIn: string
}

interface Playload {
    id_mahasiswa: string
}

interface Identitas {
    username: string,
    password: string
}
  
type Data = {
    status: string
}
  
export default async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    if(req.method != 'POST') return res.status(405).json({status: 'method not allowed'})

    try{
        const {username, password}: Identitas = req.body

        // check mahasiswa
        const mhs = await mysql('mahasiswa').where('id_mahasiswa',username)
        if(!mhs.length) return res.status(404).json({status : 'mahasiswa not found'})
        if(username !== password) return res.status(404).json({status : 'invalid password'})

        // create token
        const playload: Playload = {id_mahasiswa: username} 
        const option: Option = {expiresIn: '1d'}
        const token: string = jwt.sign(playload,'mahasiswa-login',option)

        res.setHeader('Set-Cookie',serialize('token',token,{
            httpOnly: true,
            secure: true,
            maxAge: 60 * 60 * 24,
            path: '/'
        }))

        return res.status(200).json({status: 'success'})
    }catch(err: any){
        return res.status(500).json({status: err.message})
    }
}