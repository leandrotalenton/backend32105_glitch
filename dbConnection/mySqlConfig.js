import * as dotenv from "dotenv";
dotenv.config();

const connection = {
    client: 'mysql',
    connection:
    {
        host: process.env.DB_PRODUCTOS_HOST,
        port: process.env.DB_PRODUCTOS_PORT,
        user: process.env.DB_PRODUCTOS_USER,
        database: process.env.DB_PRODUCTOS_DATABASE
    }
};

export default connection;