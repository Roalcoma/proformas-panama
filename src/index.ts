import express from "express";
import path from "path";
import cors from "cors";
import { generadorRouter } from "./routers/generador.router";
import { authRouter } from "./routers/auth.router";
import "dotenv/config";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to handle JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// 1. Servir archivos estáticos
// Esto le dice a Express que la carpeta 'public' contiene archivos que se pueden solicitar directamente.
app.use(express.static(path.join(__dirname, 'public')));

// Rutas
app.use("/generador", generadorRouter);
app.use("/auth", authRouter);

// 3. "Catch-all" o ruta comodín: Para cualquier otra petición GET, envía el index.html
// Esto debe ir al final, después de las rutas de API y los estáticos.
app.get('/generador-facturas', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pages', 'index.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pages', 'login.html'));
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
    console.log(`Envía una petición POST a http://localhost:${PORT}/generador/process-template para generar un documento.`);
});