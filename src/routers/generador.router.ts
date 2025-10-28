import express from "express";
import { GeneradorController } from "../controllers/generador.controller";

export const generadorRouter = express.Router();

generadorRouter.get("/process-template", GeneradorController.processTemplate);

generadorRouter.get("/preview-proformas", GeneradorController.profomasList)

generadorRouter.get("/download-zip", GeneradorController.downloadZip);