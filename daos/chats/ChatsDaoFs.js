import { ContainerFs } from "../../containers/ContainerFs.js";

class DAOChatsFs extends ContainerFs{
    constructor(){
        super("./fileStorage/chats.json")
    }
}

export default DAOChatsFs