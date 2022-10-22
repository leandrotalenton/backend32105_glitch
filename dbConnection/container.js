import knex from "knex";

export class Container{
    constructor(config, table) {
        this.knex = knex(config);
        this.table = table;
    }

    async save(newItem){
        try {
            return await this.knex.insert(newItem).into(this.table);
        } catch (err) {
            console.log(err);
        }
    }

    async getById(id){
        try {
            return await this.knex.from(this.table).select("*").where("id", id);
        } catch (err) {
            console.log(err);
        }
    }

    async editById(id, newItem){
        try {
            return await this.knex(this.table).where("id", id).update(newItem);
        } catch (err) {
            console.log(err);
        }
    }

    async getAll(){
        try {
            return await this.knex.from(this.table).select("*");
        } catch (err) {
            console.log(err);
        }
    }

    async deleteById(id){
        try {
            return await this.knex(this.table).where("id", id).del();
        } catch (err) {
            console.log(err);
        }
    }

    async deleteAll(){
        try {
            return await this.knex(this.table).del();
        } catch (err) {
            console.log(err);
        }
    }
} 
