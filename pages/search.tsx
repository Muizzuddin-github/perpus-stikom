import { GetServerSideProps } from "next";

import Card from "../components/card";
import Navbar from "../components/navbar";

export const getServerSideProps: GetServerSideProps =
  async function (context) {
    const { req } = context
    const url = new URL(req.url, req.headers.referer)
    const berdasarkan = url.searchParams.get('berdasarkan')
    const cari = url.searchParams.get('cari')
    let res
    let data
    if (berdasarkan == 'judulBuku') {
      res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${cari}`)
      data = await res.json()
    }
    else if (berdasarkan == 'isbn') {
      res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${cari}`)
      data = await res.json()
    }
    return {
      props: {
        data: data
      }
    }
  }

export default function (props: any) {
  return (
    <>
      <Navbar />
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
    </>
  )
}