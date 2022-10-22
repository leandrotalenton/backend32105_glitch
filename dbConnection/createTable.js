import knex from 'knex';
import mySqlConfig from './mySqlConfig.js';
import sqliteConfig from './sqliteConfig.js';

const KnexMySQL = knex(mySqlConfig)
const KnexSQLite3 = knex(sqliteConfig)

KnexSQLite3.schema.createTable("messages", (table) => {
    table.increments("id");
    table.string("autor");
    table.string("msj");
    table.string("date");
}).then(() => {
    console.log("Tabla creada");
}).catch((err) => {
    console.log(err);
}).finally(() => {
    KnexSQLite3.destroy();
});

KnexMySQL.schema.createTable("products", (table) => {
    table.string("title");
    table.integer("price");
    table.string("thumbnail");
    table.increments("id");
}).then(() => {
    console.log("Tabla creada");
}).catch((err) => {
    console.log(err);
}).finally(() => {
    KnexMySQL.destroy();
});
