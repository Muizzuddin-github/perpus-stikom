import Navbar from "../components/navbar";

export default function Login() {
  return (
    <>
      <Navbar />
      <main>
        <form action="/login" method="post" style={{ width: 'fit-content', margin: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.67rem' }}>
          <span className="material-icons" style={{ fontSize: '6rem' }}>
            account_circle
          </span>
          <input type="text" name="nim" id="nim" placeholder="NIM" required={true} />
          <input type="password" name="sandi" id="sandi" placeholder="Sandi" required={true} />
          <button type="submit">Login</button>
        </form>
      </main>
    </>
  )
}