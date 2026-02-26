import { connectDateBase } from "../config/database.js"
export const initializaApp = async():Promise<void>=>{

 await connectDateBase()

}