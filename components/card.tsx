import card from './scss/card.module.scss'
import Image from 'next/image'
import Link from 'next/link'

interface DataDetil {
  judul_buku: string,
  gambar_buku: string,
  pengarang: string,
  jumlah_halaman: number
  isbn: string
}

export default function (props: DataDetil) {
  return (
    <li className={card.card}>
      <figure>
        <Link href={`/book/${props.isbn}`}> <Image src={props.gambar_buku} width={140} height={180} alt={props.judul_buku} priority /></Link>
      </figure>
      <p>{props.judul_buku}</p>
      <p>{props.pengarang || 'unknown'}</p>
      <p>{props.jumlah_halaman} Halaman</p>
    </li>
  )
}