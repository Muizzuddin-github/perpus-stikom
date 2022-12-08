import { GetServerSideProps } from "next";
import Head from "next/head";

import Card from "../components/card";
import Navbar from "../components/navbar";
import Header from '../components/header'
import home from '../styles/Home.module.css'
import { useState } from "react";

export const getServerSideProps: GetServerSideProps =
  async function (context){
    const {data: terbaru} = await (await fetch(`http://localhost:3000/api/buku/terbaru`)).json()
    const {data: terkenal} = await (await fetch(`http://localhost:3000/api/buku/terkenal`)).json()
    const {data: daftarBuku} = await (await fetch(`http://localhost:3000/api/buku?start=0&limit=6`)).json()

    return {
      props: { terbaru, terkenal, daftarBuku}
    }
  }

export default function Home(props: any) {

  const [bookList, setBookList] = useState(props.daftarBuku)


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
            {props.terbaru.map(function (buku: any, i: number) {
              try {
                return (<Card
                judul_buku={buku.judul_buku}
                gambar_buku={buku.gambar_buku}
                pengarang={buku.pengarang}
                jumlah_halaman={buku.jumlah_halaman}
                isbn={buku.isbn}
                key={i}
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
            {props.terkenal.map(function (buku: any, i: number) {
              return (<Card
                judul_buku={buku.judul_buku}
                gambar_buku={buku.gambar_buku}
                pengarang={buku.pengarang}
                jumlah_halaman={buku.jumlah_halaman}
                isbn={buku.isbn}
                key={i}
                  />
                )
            })}
          </ul>
        </section>

        <section className={home['book-list']} id='book-list'>
          <h2> Daftar Buku</h2>
          <ul>
            {bookList.length ? bookList.map(function (buku: any, i: number) {
              return (
                <Card
                judul_buku={buku.judul_buku}
                gambar_buku={buku.gambar_buku}
                pengarang={buku.pengarang}
                jumlah_halaman={buku.jumlah_halaman}
                isbn={buku.isbn}
                key={i}
                />
              )
            }) : <section className={home['not-found']}>Pencarian tidak ditemukan</section>}
          </ul>
        </section>
      </main>
    </>
  )
}
