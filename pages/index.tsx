import { GetServerSideProps } from "next";
import Head from "next/head";

import Card from "../components/card";
import Navbar from "../components/navbar";
import Header from '../components/header'
import home from '../styles/Home.module.css'
import { useEffect, useState } from "react";


export default function Home(props: any) {

  const [kategori,setKategori] = useState('')
  const [judul,setJudul] = useState('bj')

  useEffect(function(){
    fetch(`http://localhost:3000/api/buku?start=0&limit=6&judul=${judul}&kategori=${kategori}`).then(res => res.json()).then(res => console.log(res))
  },[])


  return (
    <>

    </>
  )
}


export const getServerSideProps: GetServerSideProps =
  async function (context){

    return {
      props: {

      }
    }
  }
