import Link from "next/link";
import navbar from './scss/navbar.module.scss'
import { useEffect,useState } from "react";

export default function (props: any) {

  const [src,setSrc] = useState('')
  const [srcBy,setSrcBy] = useState('judulBuku')
  
    useEffect(function(){
        document.addEventListener('scroll',function(){
            const nav: any  = document.querySelector('nav')
            if(nav){
              if(scrollY <= 138){
                nav.classList.add('nav-color')
              }else if(scrollY > 138 && scrollY < 366){
                  nav.classList.remove('nav-color')
              }else{
                  nav.classList.add('nav-color')
              }
            }
        })
    },[]) 

    const search = async (e: any) => {
      e.preventDefault()

      if(srcBy === 'judulBuku'){
        const booksProms = (await fetch(`https://www.googleapis.com/books/v1/volumes?q=${src}`)).json()
        booksProms.then((books: any) => props.setBookList(books.items || []))
      }else if(srcBy === 'ISBN'){
        const booksProms = (await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${src}`)).json()
        booksProms.then((books: any) => props.setBookList(books.items || []))
      }
      location.href = '#book-list'
    }



return (
<nav className={`${navbar.navbar} nav-color`}>
    <Link href={"/"}><h1>Perpustakaan</h1></Link>
  <form onSubmit={search}>
    <input type="cari" name="cari" id="cari" placeholder="Cari" required={true} onChange={e => setSrc(e.target.value)} />
    <select onChange={e => setSrcBy(e.target.value)}>
      <option value="judulBuku">Judul</option>
      <option value="ISBN">ISBN</option>
    </select>
    <button type="submit">
      <span className="material-icons">search</span>
    </button>
  </form>
  <button type="button"><Link href={{pathname: '/login'}}>Login</Link></button>
</nav>
)
}