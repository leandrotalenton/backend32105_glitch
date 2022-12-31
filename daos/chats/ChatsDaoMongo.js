import { ContainerMongoDb } from "../../containers/ContainerMongoDb.js";

class DAOChatsMongo extends ContainerMongoDb {
    constructor() {
        super(
            "chats",
            {
                autor: {
                    nombre: {type: String, required: true},
                    apellido: {type: String, required: true},
                    edad: {type: String, required: true},
                    alias: {type: String, required: true},
                    avatar: {type: String, required: true}
                },
                msj: {type: String, required: true},
                date: {type: String, required: true}
            }
        );
    }
}

export default DAOChatsMongo