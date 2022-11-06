import * as dotenv from "dotenv";
dotenv.config();

const daos = {
    memory: async () => {
        const { default: DAOChatsMemory } = await import("./chats/ChatsDaoMemory.js")
        return {
            chatsDAO: new DAOChatsMemory(),
        }
    }
}

export default daos[process.env.TIPO]