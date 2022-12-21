import { open } from "sqlite"
import sqlite3 from "sqlite3"



interface Client {
    filename: string,
    driver: any
}

const sqlite3Connect: Client = {
    filename: "./perpustakaan",
    driver: sqlite3.cached.Database
}


const sqlite3Conn = async function(){
    return await open(sqlite3Connect)
}

export default sqlite3Conn