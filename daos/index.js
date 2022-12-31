import * as dotenv from "dotenv";
dotenv.config();

const daos = {
    memory: async () => {
        const { default: DAOChatsMemory } = await import("./chats/ChatsDaoMemory.js")
        return {
            chatsDAO: new DAOChatsMemory(),
        }
    },
    fs: async () => {
        const { default: DAOChatsFs } = await import("./chats/ChatsDaoFs.js")
        return {
            chatsDAO: new DAOChatsFs(),
        }
    },
    mongo: async () =>  {
        const { default: DAOChatsMongo } = await import("./chats/ChatsDaoMongo.js")
        return {
            chatsDAO: new DAOChatsMongo(),
        }
    }
}

export default daos[process.env.TIPO]