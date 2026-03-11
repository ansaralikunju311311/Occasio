import express from 'express';
import "../shared/config/passport/google.strategy.js"
import authRoutes from "../modules/auth/presentation/auth.routes.js";
import { errorMiddleware } from '../middleware/error.middleware.js';
import passport from 'passport';
import cors from 'cors'
import cookieParser from 'cookie-parser';
const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize())
app.use(cookieParser())
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))
app.get('/', (req, res) => {
    res.send('helooo')
})
app.use("/api/auth", authRoutes);
app.use((_req, res) => {
    res.status(404).json({ message: 'the page not found' })
});
app.use(errorMiddleware)
export default app