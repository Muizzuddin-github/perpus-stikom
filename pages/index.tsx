import { GetStaticProps } from "next";
import Head from "next/head";

import Card from "../components/card";
import Navbar from "../components/navbar";

export const getStaticProps: GetStaticProps =
  async function (context) {
    const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${'naruto'}&maxResults=${16}`)
    const data = await res.json()
    return {
      props: {
        data: data
      }
    }
  }

export default function Home(props: any) {
  return (
    <>
      <Head>
        <title>Perpustakaan STIKOM PGRI Banyuwangi</title>
      </Head>
      <Navbar />
      <main>
        <h2>Buku terbaru</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
          {props.data.items.map(function (v: any, i: number) {
            try {
              return (
                <Card
                  author={v.volumeInfo.authors.join(', ')}
                  image={v.volumeInfo.imageLinks.thumbnail}
                  pageCount={v.volumeInfo.pageCount}
                  title={v.volumeInfo.title}
                  key={i}
                />
              )
            }
            catch {
              return (<div>ex</div>)
            }
          })}
        </div>
        < h2 > Paling sering dipinjam</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
          {props.data.items.map(function (v: any, i: number) {
            return (
              <Card
                author={v.volumeInfo.authors.join(', ')}
                image={'/vercel.svg'}
                pageCount={v.volumeInfo.pageCount}
                title={v.volumeInfo.title}
                key={i}
              />
            )
          })}
        </div>
      </main>
    </>
  )
}
