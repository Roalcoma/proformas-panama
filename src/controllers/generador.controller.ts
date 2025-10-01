import express from "express";
import archiver from "archiver";
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

                console.log('Empieza la creación del archivo Excel');

                let marca: string

                if(db === 'BBW_NEW'){
                    marca = 'BBW'
                } else if(db === 'VSFC_PMA'){
                    marca = 'VSFA'
                } else if(db === 'VSBA') {
                    marca = 'VSBA'
                } else {
                    marca = 'BEAUTY'
                }

                const archivoExcel = await generateExcel(sampleData, tipoExcel as string, marca);

                console.log('Archivo Excel generado:', archivoExcel);
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
            const zipFileName = `Facturas_${serieFac}_${numFacIni}_${numFacFin}_${tipoExcelLet}.zip`;
            const zipFilePath = path.join(outputDir, zipFileName);
            
            // Verificar si el archivo ya existe
            if (fs.existsSync(zipFilePath)) {
                console.log('Archivo ZIP ya existe, enviando directamente:', zipFileName);
                
                // Leer el archivo y enviarlo
                const fileBuffer = fs.readFileSync(zipFilePath);
                
                // Configurar headers para forzar descarga con nombre específico
                res.setHeader('Content-Type', 'application/zip');
                res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${encodeURIComponent(zipFileName)}`);
                res.setHeader('Content-Length', fileBuffer.length);
                res.send(fileBuffer);
                
                // Limpiar después de enviar
                setTimeout(async () => {
                    try {
                        const filesAndDirsInOutputDir = await fs.promises.readdir(outputDir);
                        for (const item of filesAndDirsInOutputDir) {
                            const itemPath = path.join(outputDir, item);
                            await fs.promises.rm(itemPath, { recursive: true, force: true });
                        }
                        console.log('Limpieza completada.');
                    } catch (cleanupErr: any) {
                        console.error('Error en limpieza:', cleanupErr.message);
                    }
                }, 1000);
                return;
            }

            // Si no existe, crearlo
            const output = fs.createWriteStream(zipFilePath);
            const archive = archiver('zip', {
                zlib: { level: 9 }
            });

            output.on('close', () => {
                console.log(`ZIP creado: ${archive.pointer()} bytes en ${zipFilePath}`);
                
                // Leer el archivo y enviarlo
                const fileBuffer = fs.readFileSync(zipFilePath);
                
                console.log('Enviando archivo con nombre:', zipFileName);
                res.setHeader('Content-Type', 'application/zip');
                res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${encodeURIComponent(zipFileName)}`);
                res.setHeader('Content-Length', fileBuffer.length);
                res.send(fileBuffer);

                // Limpiar después de enviar
                setTimeout(async () => {
                    try {
                        const filesAndDirsInOutputDir = await fs.promises.readdir(outputDir);
                        for (const item of filesAndDirsInOutputDir) {
                            const itemPath = path.join(outputDir, item);
                            await fs.promises.rm(itemPath, { recursive: true, force: true });
                        }
                        console.log('Limpieza completada.');
                    } catch (cleanupErr: any) {
                        console.error('Error en limpieza:', cleanupErr.message);
                    }
                }, 1000);
            });

            archive.on('warning', (err) => {
                console.warn('Archiver advertencia:', err.message);
            });

            archive.on('error', (err) => {
                console.error('Archiver error FATAL:', err.message);
                throw err; 
            });

            archive.pipe(output);

            console.log('Añadiendo archivos al ZIP...');
            try {
                const filesInOutputDir = await fs.promises.readdir(outputDir);
                const filesToCompress = filesInOutputDir.filter(item => 
                    item !== zipFileName && (item.endsWith('.xlsx') || item.endsWith('.pdf'))
                );

                if (filesToCompress.length === 0) {
                    console.warn('No se encontraron archivos para comprimir.');
                }

                for (const fileName of filesToCompress) {
                    const filePath = path.join(outputDir, fileName);
                    const stats = await fs.promises.stat(filePath);
                    if (stats.isFile()) {
                        console.log(`Añadiendo '${fileName}' al ZIP.`);
                        archive.file(filePath, { name: fileName });
                    }
                }
            } catch (readDirError: any) {
                console.error('Error al leer directorio:', readDirError.message);
                throw new Error('No se pudo leer el directorio de archivos.');
            }

            console.log('Finalizando ZIP...');
            await archive.finalize();
        } catch (error) {
            console.error('Error al crear ZIP:', error);
            res.status(500).send('Error al crear el archivo ZIP.');
        }
    }

}
