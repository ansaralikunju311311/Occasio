import app from '../main/app.js'
import dotenv from 'dotenv'

dotenv.config()
import { initializaApp } from '../shared/loaders/index.js'
const startServer = async () : Promise<void>=>{
    
    try {
        await initializaApp()
        app.listen(3001,()=>{
        console.log(`the server is running propelrly`)
    })
    } catch (error) {
        console.log(error)
    }
    
}
startServer()