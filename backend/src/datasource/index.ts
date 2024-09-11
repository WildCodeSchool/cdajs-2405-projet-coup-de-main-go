import { config } from "dotenv";
import { DataSource } from "typeorm";

config();

const dbUser: string = process.env.DB_USER || "";
const dbPassword: string = process.env.DB_PASSWORD || "";
const dbHost: string = process.env.DB_HOST || "";
const dbPort: number = parseInt(process.env.DB_PORT || "", 10);
const dbDatabase: string = process.env.DB_DATABASE || "";

export const dataSource = new DataSource({
    type: "postgres",
    host: dbHost,
    port: dbPort,
    username: dbUser,
    password: dbPassword,
    database: dbDatabase,
    entities: ["src/entities/*.ts"],
    synchronize: true,
    logging: "all",
});
