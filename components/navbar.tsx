import Link from "next/link";

export default function () {
  return (
    <nav style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
      <Link href={{ pathname: '/' }}>
        <header>
          <h1>perpusSTIKOM</h1>
        </header>
      </Link>
      <form action="/search" method="get" style={{ display: 'flex' }}>
        <select name="berdasarkan" id="berdasarkan">
          <option value="judulBuku">Judul</option>
          <option value="isbn">ISBN</option>
        </select>
        <input type="cari" name="cari" id="cari" required={true} />
        <button type="submit"><span className="material-icons">
          search
        </span></button>
      </form>
      <Link href={{ pathname: '/login' }}>Login</Link>
    </nav>
  )
}