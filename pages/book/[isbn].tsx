import Head from "next/head";
import book from '../../styles/Book.module.css'
import { GetServerSideProps } from "next";
import Image from "next/image";
import Link from "next/link";


const Book = (props: any) => {
    return <> 
    <Head>
        <title>Perpustakaan STIKOM PGRI Banyuwangi</title>
    </Head>
    <main className={book.main}>
        <section className={book.gmbr}>
            <figure>
                <Image src={`/images/${props.detilBuku.gambar_buku}`} width={200} height={240} alt={props.detilBuku.judul_buku} priority />
                <figcaption>{props.detilBuku.judul_buku}</figcaption>
            </figure>
        </section>
        <section className={book.detil}>
            <h1>{props.detilBuku.judul_buku}</h1>
            <p>{props.detilBuku.pengarang}</p>
            <Link href={'/'}> Kembali</Link>
        </section>
    </main>
</>;
}
export default Book;


export const getServerSideProps: GetServerSideProps = async function(context){
    const isbn = context.params?.isbn
    const {data} = await(await fetch(`http://localhost:3000/api/buku/${isbn}`)).json()
    return {
        props: {detilBuku: data[0]}
    }
}