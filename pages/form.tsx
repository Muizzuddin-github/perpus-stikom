import { HtmlHTMLAttributes, useRef, useState } from "react"
import { GetServerSideProps } from "next";

export default function Form(props: any){

    const [isbn,setIsbn] = useState('')
    const [judul,setJudul] = useState('')
    const [penerbit,setPenerbit] = useState('')
    const [pengarang,setPengarang] = useState('')
    const [jumlahHalaman,setJumlahHalaman] = useState('')
    const [nomorRak,setNomorRak] = useState('')
    const [stokBuku,setStokBuku] = useState('')
    const [deskripsi,setDeskripsi] = useState('')
    const [kategoriID,setKategoriID] = useState('')
    const [gambar,setGambar] = useState('');

    const formRef = useRef<HTMLFormElement>(null)


    const handleImage = (e: any) => {
        if(e.target.files){
            const img = e.target.files[0]
            setGambar(img)
        }
    }
    
    const submit = async (e: any) => {
        e.preventDefault()
        
        /* 
        untuk mengirimkan data yang ada filenya
        ktia gunakan new FormData()
        */
        const formData = new FormData()
        formData.append('isbn',isbn)
        formData.append('judul_buku',judul)
        formData.append('penerbit',penerbit)
        formData.append('pengarang',pengarang)
        formData.append('jumlah_halaman',jumlahHalaman)
        formData.append('nomor_rak',nomorRak)
        formData.append('stok_buku',stokBuku)
        formData.append('deskripsi',deskripsi)
        formData.append('id_kategori',kategoriID)
        formData.append('gambar_buku',gambar)

        await (await fetch('/api/buku',{
            method : 'POST',
            body : formData
        })).json()

        alert('berhasil menambahkan buku')

        // reset value form
        if(formRef.current) {
            formRef.current.reset();
          }
    
        setIsbn('')
        setJudul('')
        setPenerbit('')
        setPengarang('')
        setJumlahHalaman('')
        setNomorRak('')
        setStokBuku('')
        setDeskripsi('')
        setKategoriID('')
        setGambar('')
    }


    return <>
    <h1>cobain upload file</h1>

    <form ref={formRef} onSubmit={submit} style={{padding: "20px"}}>
        <label htmlFor="isbn">isbn</label><br />
        <input type="number" id="isbn" required onChange={e => setIsbn(e.target.value)} /><br />

        <label htmlFor="judul-buku">judul buku</label><br />
        <input type="text" id="judul-buku" onChange={e => setJudul(e.target.value)}required/><br />

        <label htmlFor="penerbit">penerbit</label><br />
        <input type="text" id="penerbit" required onChange={e => setPenerbit(e.target.value)} /><br />

        <label htmlFor="pengarang">pengarang</label><br />
        <input type="text" id="pengarang" required onChange={e => setPengarang(e.target.value)}  /><br />
        
        <label htmlFor="jumlah-halaman">jumlah halaman</label><br />
        <input type="number" id="jumlah-halaman" required onChange={e => setJumlahHalaman(e.target.value)} /><br />

        <label htmlFor="nomor-rak">nomor rak</label><br />
        <input type="number" id="nomor-rak" required onChange={e => setNomorRak(e.target.value)}/><br />

        <label htmlFor="stok-buku">stok buku</label><br />
        <input type="number" id="stok-buku" required onChange={e => setStokBuku(e.target.value)}  /><br />

        <label htmlFor="deskripsi">deskripsi</label><br />
        <textarea id="deskripsi" required onChange={e => setDeskripsi(e.target.value)}></textarea><br />



        <label htmlFor="gambar">gambar</label><br />
        <input type="file" id="gambar" onChange={e => handleImage(e)} required /><br /><br />

        <select required onChange={e => setKategoriID(e.target.value) }>
            <option value="0">pilih kategori</option>
            {props.kategori.map((kt: any) => (
                <option key={kt.id_kategori} value={kt.id_kategori}>{kt.kategori}</option>
            ))}
        </select><br /><br />


        <button type="submit">tambah</button>
    </form>

    </>
}



export const getServerSideProps: GetServerSideProps = async (context) => {

    const {data} = await (await fetch('http://127.0.0.1:3000/api/buku/kategori')).json()

    return {
        props: {
            kategori: data
        }
    }
}