import mongoose from 'mongoose'

await mongoose.connect('mongodb+srv://LeandroCoder:Coder123123@clusterleandrocoder.fyskstk.mongodb.net/leandroCoderDb?retryWrites=true&w=majority', { serverSelectionTimeoutMS: 4000 })

class ContainerMongoDb {
    constructor(collection, scheme) {
        this.db = mongoose.model(collection, scheme)
    }

    async create(newDocument) {
        try {
            await this.db.create(newDocument)
        } catch (e) {
            console.log(e)
        }
    }

    async read() {
        try {
            const documents = await this.db.find({})
            return documents
        } catch (e) {
            console.log(e)
        }
    }

    async readById(id) {
        try {
            const document = await this.db.findOne({_id: id})
            if (document) {
                return document
            }
        } catch (e) {
            console.log(e)
        }
    }

    async updateById(id, newDocument) {
        try {
            const {modifiedCount} = await this.db.replaceOne({_id: id}, newDocument)
            if ( modifiedCount > 0 ) {
                return `Se ha actualizado el item ${id}`
            } else {
                return `no se encuentra un item con el ID especificado`
            }
        } catch (e) {
            console.log(e)
        }
    }

    async deleteById(id) {
        try {
            const { deletedCount } = await this.db.deleteOne({_id: id}) //{ n, nDeleted }
            if (deletedCount > 0) {
                return `se elimino el item con ID ${id}`;
            } else {
                return `no se encuentra un item con el ID especificado`
            }
        } catch (e) {
            console.log(e)
        }
    }

    async deleteAll() {
        try {
            await this.db.deleteMany({})
        } catch (e) {
            console.log(e)
        }
    }
}

export { ContainerMongoDb }