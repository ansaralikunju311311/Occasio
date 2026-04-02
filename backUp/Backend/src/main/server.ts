

import "../shared/config/env.js"
import app from '../main/app.js'

import { initializaApp } from '../shared/loaders/index.js'
import { clearExpiredOtpJob } from "../shared/loaders/index.js"
const startServer = async (): Promise<void> => {

    try {
        await initializaApp();
        clearExpiredOtpJob()
        app.listen(3001, () => {
            console.log(`the server is running propelrly`)
        })
    } catch (error) {
        console.log(error)
    }

}
startServer()