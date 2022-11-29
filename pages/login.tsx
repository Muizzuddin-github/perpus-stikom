import Navbar from "../components/navbar";
import { useState } from "react";
import Router from "next/router";

export default function Login() {
  const [username,setUsername] = useState('')
  const [password,setPassword] = useState('')

  const submit = async (e: any) => {
    e.preventDefault()
    try{
      fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username,
          password: password
        })
      })
      Router.push('/')
    }catch(err: any){
      console.log(err.message)
    }

  }
  return (
    <>
      <Navbar />
      <main>
        <form onSubmit={submit}  style={{ width: 'fit-content', margin: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.67rem' }}>
          <span className="material-icons" style={{ fontSize: '6rem' }}>
            account_circle
          </span>
          <input type="text" name="nim" id="nim" placeholder="NIM" required={true} onChange={e => setUsername(e.target.value) } />
          <input type="password" name="sandi" id="sandi" placeholder="Sandi" required={true} onChange={e => setPassword(e.target.value)} />
          <button type="submit">Login</button>
        </form>
      </main>
    </>
  )
}