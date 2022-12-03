import header from './scss/header.module.scss'
import Link from 'next/link';
import Image from 'next/image';
import readingBook from '../public/reading-book.png'

const Header = () => {
    return ( 
        <header className={header.header}>
            <section>
                <h1>Baca Buku Dimanapun</h1>
                <section>
                    <p>Nikmati hari harimu dengan membaca buku</p>
                    <button type='button'><Link href={"/login"}>Ayo Mulai</Link></button>
                </section>
            </section>
            <figure>
                <Image src={readingBook} alt='reading book' width={540} height={340} priority/>
            </figure>
        </header>
     );
}
 
export default Header;