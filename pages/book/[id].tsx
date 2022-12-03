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
                <Image src={props.data.imageLinks.thumbnail} width={200} height={240} alt={props.data.title} priority />
                <figcaption>{props.data.title}</figcaption>
            </figure>
        </section>
        <section className={book.detil}>
            <h1>{props.data.title}</h1>
            <p>{props.data.authors}</p>
            <Link href={'/'}> Kembali</Link>
        </section>
    </main>
</>;
}
export default Book;


export const getServerSideProps: GetServerSideProps = async function(context){
    const id = context.params?.id
    const {volumeInfo} = await(await fetch(`https://www.googleapis.com/books/v1/volumes/${id}`)).json()
    return {
        props: {
            data : volumeInfo
        }
    }
}