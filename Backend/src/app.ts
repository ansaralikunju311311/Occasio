// import express from 'express';
// // import "../shared/config/passport/google.strategy.js"
// // import authRoutes from "../modules/auth/presentation/auth.routes.js";
// // import adminRoutes from "../modules/auth/presentation/admin.routes.js"
// // import userRoutes from '../modules/auth/presentation/user/user.routes.js'
// // import { errorMiddleware } from '../middleware/error.middleware.js';
// // import eventRouter from "../modules/events/presentation/event.routes.js"
import "./shared/config/passport/google.strategy"
 import passport from 'passport';
 import cors from 'cors'
import cookieParser from 'cookie-parser';
// const app = express();

// app.use(express.json())
// app.use(express.urlencoded({ extended: true }));
// app.use(passport.initialize())
// app.use(cookieParser())
// app.use(cors({
//     origin: "http://localhost:5173",
//     credentials: true
// }))
// app.get('/', (req, res) => {
//     res.send('helooo')
// })
// app.use("/api/auth", authRoutes);
// app.use("/api/admin",adminRoutes);
// app.use("/api/user",userRoutes);
// app.use("/api/events",eventRouter)
// app.use((_req, res) => {
//     res.status(404).json({ message: 'the page not found' })
// });
// app.use(errorMiddleware)
// export default app



// src/app.ts
import express from "express";
import authRoutes from '../src/presentation/routes/auth.routes'
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize())
app.use(cookieParser())
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))
app.use(express.json());
app.use("/api/auth", authRoutes);
app.get('/',(req,res)=>{
    res.send('the server is running proeprly')
})

export default app;