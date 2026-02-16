import express from "express";
import routes from "./routes";
const app = express();

// Middlewares
app.use(express.json());

// Routes
// app.get("/", (req, res) => {
//   res.send("API is running..");
// });
app.use(routes);

export default app;