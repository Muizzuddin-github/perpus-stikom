import card from './scss/card.module.scss'
import Image from 'next/image'
import Link from 'next/link'

interface DataDetil {
  image: string,
  title: string,
  author: string,
  pageCount: string
  id: string
}

export default function (props: DataDetil) {
  return (
    <li className={card.card}>
      <figure>
        <Link href={`/book/${props.id}`}> <Image src={props.image} width={140} height={180} alt={props.title} /></Link>
      </figure>
      <p>{props.title}</p>
      <p>{props.author || 'unknown'}</p>
      <p>{props.pageCount} Halaman</p>
    </li>
  )
}