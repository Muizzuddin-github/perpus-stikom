import { GetStaticProps } from "next";
import Head from "next/head";

import Card from "../components/card";
import Navbar from "../components/navbar";
import Header from '../components/header'
import home from '../styles/Home.module.css'
import { useState } from "react";

export const getStaticProps: GetStaticProps =
  async function (context) {
    const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${'lego'}&maxResults=${6}`)
    const data = await res.json()

    const daftarBuku = await (await fetch(`https://www.googleapis.com/books/v1/volumes?q=${'lego'}&maxResults=${20}`)).json()

    return {
      props: {
        data: [data,daftarBuku]
      }
    }
  }

export default function Home(props: any) {

  const [bookList, setBookList] = useState(props.data[1].items)


  return (
    <>
      <Head>
        <title>Perpustakaan STIKOM PGRI Banyuwangi</title>
      </Head>
      <Navbar setBookList={setBookList}/>
      <Header />
      <main className={home.main}>
        <section className={home.buku}>
          <h2>Buku Terbaru</h2>
          <ul>
            {props.data[0].items.map(function (v: any, i: number) {
              try {
                return (<Card
                    author={v.volumeInfo.authors}
                    image={v.volumeInfo.imageLinks.thumbnail}
                    pageCount={v.volumeInfo.pageCount}
                    title={v.volumeInfo.title}
                    key={v.id}
                    id={v.id}
                  />
                )
              }
              catch(err: any) {
                console.log(err.message)
              }
            })}
          </ul>
        </section>

        <section className={home.buku}>
          <h2> Paling Sering Dipinjam</h2>
          <ul>
            {props.data[0].items.map(function (v: any, i: number) {
              return (
                <Card
                  author={v.volumeInfo.authors}
                  image={'/vercel.svg'}
                  pageCount={v.volumeInfo.pageCount}
                  title={v.volumeInfo.title}
                  key={v.id}
                  id={v.id}
                />
              )
            })}
          </ul>
        </section>

        <section className={home['book-list']} id='book-list'>
          <h2> Daftar Buku</h2>
          <ul>
            {bookList.length ? bookList.map(function (v: any, i: number) {
              return (
                <Card
                  author={v.volumeInfo.authors}
                  image={v.volumeInfo.imageLinks?.thumbnail || '/vercel.svg'}
                  pageCount={v.volumeInfo.pageCount}
                  title={v.volumeInfo.title}
                  key={v.id}
                  id={v.id}
                />
              )
            }) : <section className={home['not-found']}>Pencarian tidak ditemukan</section>}
          </ul>
        </section>
      </main>
    </>
  )
}
