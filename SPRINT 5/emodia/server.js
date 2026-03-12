import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import session from "express-session";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src/views"));

app.use(express.static(path.join(__dirname, "src/public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    secret: "emodia-secret-2025",
    resave: false,
    saveUninitialized: false,
  })
);

// ROTAS
import authRoutes from "./src/routes/authRoutes.js";
import dashboardRoutes from "./src/routes/dashboardRoutes.js";
import emotionRoutes from "./src/routes/emotionRoutes.js";

app.use("/", authRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/emotions", emotionRoutes);

app.listen(5000, () => console.log("Servidor rodando em http://localhost:5000"));
