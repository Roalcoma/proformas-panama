import express from "express";
import archiver from "archiver";
import ExcelJS from 'exceljs';
import path from "path";
import fs from "fs";
import { GeneradorModel } from "../models/generador.model";
import { generateExcel } from "../utils/generadorExcel";

// Ruta al directorio temporal para los archivos generados
const outputDir = path.join(__dirname, '..', 'generated_files'); // Renombrado para ser más genérico

let serieFac: string;
let numFacIni: number;
let numFacFin: number;
let tipoExcelLet: string;


const getDataClient = async (numSerie: string, numFacturaIni: string, numFacturaFin: string, db: string) => {
    return await GeneradorModel.getDataByClient(
        numSerie as string,
        parseInt(numFacturaIni as string, 10),
        parseInt(numFacturaFin as string, 10),
        db as string
    );
}


export class GeneradorController {
    static async processTemplate(req: express.Request, res: express.Response): Promise<void> {
        try {
            const { numSerie, numFacturaIni, numFacturaFin, tipoExcel, db } = req.query;

            if (
                typeof numSerie !== 'string' ||
                typeof numFacturaIni !== 'string' ||
                typeof numFacturaFin !== 'string' ||
                typeof tipoExcel !== 'string' ||
                typeof db !== 'string'
            ) {
                res.status(400).send('Parámetros de consulta inválidos o faltantes.');
                return;
            }

            const infoCliente: any = await getDataClient(numSerie, numFacturaIni, numFacturaFin, db)

            serieFac = numSerie as string;
            numFacIni = parseInt(numFacturaIni as string, 10);
            numFacFin = parseInt(numFacturaFin as string, 10);
            tipoExcelLet = tipoExcel as string;

            console.log('Información del cliente obtenida:', infoCliente);

            if (!infoCliente || infoCliente.length === 0) {
                res.status(404).send('No se encontraron datos para el cliente especificado.');
                return;
            }

            const arrayData: Array<any> = [];

            for (let index = 0; index < infoCliente.length; index++) {
                const cliente = infoCliente[index];
                console.log('Datos del cliente:', cliente);
                console.log('Entramos en el ForEach para obtener los ítems');
                const itemData = await GeneradorModel.getData(
                    cliente.NUMSERIE,
                    cliente.NUMFAC,
                    tipoExcel as string,
                    db as string
                );


                const sampleData = {
                    clientName: cliente.NOMBRECLIENTE,
                    clientCode: cliente.CODCLIENTE,
                    clientAddress: cliente.DIRECCION1,
                    clientNif: cliente.NIF20,
                    clientPhone: cliente.TELEFONO,
                    clientMoneda: cliente.MONEDA,
                    clientDespacho: cliente.VIADESPACHO,
                    clientFormaPago: cliente.FORMAPAGO,
                    clientPeso: cliente.PESONETO,
                    clientBulto: cliente.TOTALCAJABULTO,
                    invoiceDate: cliente.FECHA,
                    invoiceNumber: cliente.NUMFAC,
                    invoiceSerie: cliente.NUMSERIE,
                    invoicePais: cliente.CODPAIS,
                    totalUnidades: itemData[0].TOTAL_UNIDADES,
                    totalBruto: itemData[0].TOTAL_BRUTO,
                    totalNeto: itemData[0].TOTAL_NETO,
                    items: itemData
                };

                arrayData.push(sampleData);

                const archivoExcel = await generateExcel(sampleData, tipoExcel as string);

                console.log('Datos de los ítems obtenidos:', sampleData);
            }

            res.status(200).json({
                message: 'Archivo Excel generado y guardado con éxito.',
            });

        } catch (error: any) {
            console.error('Error al procesar la plantilla Excel:', error);
            res.status(500).send(`Error interno del servidor al procesar la plantilla: ${error.message}`);
        }
    }

    static async profomasList(req: express.Request, res: express.Response){
        const { numSerie, numFacturaIni, numFacturaFin, db } = req.query;

        if (
            typeof numSerie !== 'string' ||
            typeof numFacturaIni !== 'string' ||
            typeof numFacturaFin !== 'string' ||
            typeof db !== 'string'
        ) {
            res.status(400).send('Parámetros de consulta inválidos o faltantes.');
            return;
        }

        const infoCliente: any = await getDataClient(numSerie, numFacturaIni, numFacturaFin, db)

        console.log(infoCliente)

        res.status(200).json({
            message: 'Información del cliente obtenida con éxito',
            clientes: infoCliente
        })
    }

    static async downloadZip(req: express.Request, res: express.Response): Promise<void> {
        try {
            const zipFileName = `Facturas_${serieFac}_${numFacIni}_${numFacFin}_${tipoExcelLet}.zip`; // Añadido Date.now() para nombre único
            const zipFilePath = path.join(outputDir, zipFileName);
            const output = fs.createWriteStream(zipFilePath);
            const archive = archiver('zip', {
                zlib: { level: 9 } // Nivel de compresión (0-9)
            });

            output.on('close', () => {
                console.log(`ZIP creado: ${archive.pointer()} bytes en ${zipFilePath}`);
                // =========================================================
                // 5. ENVIAR EL ARCHIVO ZIP PARA DESCARGA
                // =========================================================
                res.download(zipFilePath, zipFileName, async (err) => {
                    if (err) {
                        console.error('Error al descargar el ZIP con res.download():', err);
                    } else {
                        console.log('ZIP enviado al cliente con éxito.');
                    }
                    // ===================================================================
                    // 6. LIMPIAR TODOS LOS ARCHIVOS Y CARPETAS EN EL DIRECTORIO DE SALIDA
                    //    (Esta parte se ejecuta después de intentar la descarga)
                    // ===================================================================
                    try {
                        console.log('Iniciando limpieza de TODOS los archivos y subcarpetas en el directorio de salida...');
                        const filesAndDirsInOutputDir = await fs.promises.readdir(outputDir);
                        
                        for (const item of filesAndDirsInOutputDir) {
                            const itemPath = path.join(outputDir, item);
                            // fs.promises.rm es robusto: borra archivos o directorios.
                            // recursive: true para borrar contenido de subcarpetas (si las hubiera).
                            // force: true para ignorar errores si el archivo/carpeta ya no existe (ej. si se borró manualmente).
                            await fs.promises.rm(itemPath, { recursive: true, force: true });
                            console.log(`Eliminado: ${itemPath}`);
                        }
                        console.log('Todos los archivos y carpetas en el directorio de salida han sido eliminados.');
                    } catch (cleanupErr: any) {
                        console.error('Error al limpiar TODO el directorio de salida:', cleanupErr.message);
                    }
                });
            });

            archive.on('warning', (err) => {
                console.warn('Archiver advertencia:', err.message);
            });

            archive.on('error', (err) => {
                console.error('Archiver error FATAL:', err.message);
                // Si el error ocurre en archiver antes de que se envíe la respuesta,
                // lanza el error para que el bloque try/catch superior lo maneje.
                throw err; 
            });

            archive.pipe(output);

            console.log('Añadiendo archivos al ZIP desde el directorio de salida...');
            try {
                // Leer todos los elementos (archivos y carpetas) en el directorio outputDir
                const filesInOutputDir = await fs.promises.readdir(outputDir);
                
                // Filtrar solo los archivos que serán comprimidos.
                // Excluye el propio archivo ZIP que se está creando para evitar errores.
                const filesToCompress = filesInOutputDir.filter(item => 
                    item !== zipFileName && (item.endsWith('.xlsx') || item.endsWith('.pdf')) // Puedes añadir más extensiones si lo necesitas
                );

                if (filesToCompress.length === 0) {
                    console.warn('Advertencia: No se encontraron archivos relevantes en el directorio de salida para comprimir. El ZIP podría estar vacío.');
                }

                for (const fileName of filesToCompress) {
                    const filePath = path.join(outputDir, fileName);
                    const stats = await fs.promises.stat(filePath);
                    if (stats.isFile()) { // Asegurarse de que es un archivo y no una carpeta
                        console.log(`Añadiendo '${fileName}' desde '${filePath}' al ZIP.`);
                        archive.file(filePath, { name: fileName }); // 'name' es el nombre del archivo dentro del ZIP
                    } else {
                        console.log(`Saltando '${fileName}' (no es un archivo o no tiene la extensión deseada).`);
                    }
                }
            } catch (readDirError: any) {
                console.error('Error al leer el directorio de salida para añadir archivos al ZIP:', readDirError.message);
                // Propagar el error para que sea capturado por el bloque try/catch superior.
                throw new Error('No se pudo leer el directorio de archivos para comprimir.'); 
            }

            console.log('Finalizando el archivo ZIP...');
            // Finaliza el archivo ZIP. Esto es CRÍTICO para que el ZIP se complete.
            // Disparará el evento 'output.on("close")' cuando termine de escribir.
            await archive.finalize();
        } catch (error) {
            console.error('Error al crear el archivo ZIP:', error);
            res.status(500).send('Error al crear el archivo ZIP.');
        }
    }
}
