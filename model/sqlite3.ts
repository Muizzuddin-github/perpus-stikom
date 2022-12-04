import knex from "knex"

interface Connector {
    filename: string
}

interface Client {
    client: string,
    connection: Connector,
    useNullAsDefault: boolean
}

const sqlite3Connect: Client = {
    client: 'sqlite3',
    connection: {
      filename: "./perpustakaan"
    },
    useNullAsDefault: true
}

const sqlite3 = knex(sqlite3Connect);
export default sqlite3;