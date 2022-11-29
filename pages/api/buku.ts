import type { NextApiRequest, NextApiResponse } from 'next'

interface Mahasiswa {
    id_mahasiswa: string,
    nama: string,
    jurusan: string
}
  
type Data = {
    status: string
    data: Array<Mahasiswa>
}
  
export default async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    try{
        if(req.method === 'GET'){

        }
    }catch(err: any){
        return res.status(500).json({status: err.message,data: []})
    }
}