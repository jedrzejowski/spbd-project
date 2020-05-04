import pg from "pg";
import Deferred from "./lib/Deferred";

interface QueryResult<T = any> {
    rows: T[],
    fields: {
        name: string
        format: string
    }[]
}

const pool = new pg.Pool({
    user: "spbd",
    host: "localhost",
    password: "spbd",
    database: "spbd",
    port: 5432
});

export const databaseReady = new Deferred();

pool.on("connect", () => {
    databaseReady.resolve();
});

pool.on("error", (error) => {
    databaseReady.reject();

    console.error("Krytyczny błąd bazy danych")
    console.error(error);
    process.exit(1);
});


export function queryDatabase<T = any>(query: string, params: any[]): Promise<QueryResult<T>> {
    return pool.query(query, params);
}