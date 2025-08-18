import express from "express";
import { AuthModel } from "../models/auth.model";

export class AuthController {
    static async login(req: express.Request, res: express.Response): Promise<void> {
        const { password } = req.query;

        if (!password || typeof password !== "string") {
            res.status(400).json({ message: "La contraseña es requerida" });
            return;
        }

        const user = await AuthModel.login(password);

        // Aquí deberías validar las credenciales contra tu base de datos o servicio de autenticación
        if (user.length > 0) {
            // Simulación de un inicio de sesión exitoso
            res.status(200).json({ message: "Inicio de sesión exitoso", user: user });
        } else {
            // Simulación de un inicio de sesión fallido
            res.status(401).json({ message: "Usuario no existe" });
        }
    }
}