import { DataSource } from 'typeorm'

const dbUser = process.env.DB_USER
const dbPassword = process.env.DB_PASSWORD
const dbHost = process.env.DB_HOST
const dbPort = process.env.DB_PORT
const dbDatabase = process.env.DB_DATABASE

export const dataSource =  new DataSource({
    type: 'postgres',
    host: dbHost,
    port: Number(dbPort), 
    username: dbUser,
    password: dbPassword,
    database: dbDatabase,
    entities: ['src/entities/*.ts'],
    synchronize: true,
    logging: "all"
})