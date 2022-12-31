import { ContainerMongoDb } from "../../containers/ContainerMongoDb.js";

class DAOProductosMongo extends ContainerMongoDb {
    constructor() {
        super(
            "productos",
            {
                title:{type: String, required: true},
                price:{type: String, required: true},
                thumbnail:{type: String, required: true},
            }
        );
    }
}

export default DAOProductosMongo