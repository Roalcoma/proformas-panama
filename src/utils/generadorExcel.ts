import ExcelJS from 'exceljs';
import path from "path";
import { ClassExcelPanama } from './Mappeos/excelPanama';
import { ClassExcelCostaRica } from './Mappeos/excelCostaRica';
import { ClassExcelColombia } from './Mappeos/excelColombia';
import { ClassExcelEcuador } from './Mappeos/excelEcuador';
import { ClassExcelArgentina } from './Mappeos/excelArgentina';
import { ClassExcelSalvador } from './Mappeos/excelSalvador';
import { ClassExcelCuracao } from './Mappeos/excelCuracao';
import { ClassExcelParaguay } from './Mappeos/excelParaguay';
import { ClassExcelUruguay } from './Mappeos/excelUruguay';
import { ClassExcelVenezuela } from './Mappeos/excelVenezuela';
import { ClassExcelPeru } from './Mappeos/excelPeru';
import { ClassExcelGuatemala } from './Mappeos/excelGuatemala';
import { ClassExcelRD } from './Mappeos/excelRD';

// Ruta al directorio de plantillas
const templatesDir = path.join(__dirname, '..', 'templates');
//const templatePath = path.join(templatesDir, 'PA.xlsx');

// Ruta al directorio temporal para los archivos generados
const outputDir = path.join(__dirname, '..', 'generated_files'); // Renombrado para ser más genérico

// Objeto de estilo para bordes negrita
const boldBorderStyle = {
    top: { style: 'medium' as ExcelJS.BorderStyle, color: { argb: 'FF000000' } }, // Negro
    left: { style: 'medium' as ExcelJS.BorderStyle, color: { argb: 'FF000000' } },
    bottom: { style: 'medium' as ExcelJS.BorderStyle, color: { argb: 'FF000000' } },
    right: { style: 'medium' as ExcelJS.BorderStyle, color: { argb: 'FF000000' } }
};

export async function generateExcel(sampleData: any, tipoExcel: string, marca: string): Promise<any> {
    const dataToInsert = sampleData;

    let templatePath: string = '';

    if (marca === 'BBW') {
        templatePath = path.join(templatesDir, `${dataToInsert.invoicePais}_${tipoExcel}.xlsx`);
    } else {
        if (tipoExcel === 'BEAUTY') {
            templatePath = path.join(templatesDir, `VSFA_${dataToInsert.invoicePais}_${tipoExcel}.xlsx`);
        } else {
            templatePath = path.join(templatesDir, `VSFA_${tipoExcel}.xlsx`);
        }
    }

    console.log('Estoy en generador excel')

    //console.log('Datos a insertar:', dataToInsert);

    const items = dataToInsert.items;
    if (!items || items.length === 0) {
        throw new Error('Error: No se encontraron ítems para insertar.');
    }

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(templatePath);

    const worksheet = workbook.getWorksheet(1);

    if (!worksheet) {
        throw new Error('Error: No se encontró la hoja de trabajo en la plantilla.');
    }

    //console.log('Worksheet found:', worksheet);

    if (marca === 'BBW') {
        console.log('Estoy en BBW')
        if (dataToInsert.invoicePais === 'PA') {
            const newFilePath = await ClassExcelPanama.excelPanama(dataToInsert, items, tipoExcel, workbook, worksheet, boldBorderStyle, outputDir, path);
            //console.log('Archivo generado en:', newFilePath);
            return newFilePath;
        }

        if (dataToInsert.invoicePais === 'SV') {
            const newFilePath = await ClassExcelSalvador.excelSalvador(dataToInsert, items, tipoExcel, workbook, worksheet, boldBorderStyle, outputDir, path);
            //console.log('Archivo generado en:', newFilePath);
            return newFilePath;
        }

        if (dataToInsert.invoicePais === 'CO') {
            const newFilePath = await ClassExcelColombia.excelColombia(dataToInsert, items, tipoExcel, workbook, worksheet, boldBorderStyle, outputDir, path);
            //console.log('Archivo generado en:', newFilePath);
            return newFilePath;
        }

        if (dataToInsert.invoicePais === 'GT') {
            const newFilePath = await ClassExcelGuatemala.excelGuatemala(dataToInsert, items, tipoExcel, workbook, worksheet, boldBorderStyle, outputDir, path);
            //console.log('Archivo generado en:', newFilePath);
            return newFilePath;
        }

        if (dataToInsert.invoicePais === 'CW') {
            const newFilePath = await ClassExcelCuracao.excelCuracao(dataToInsert, items, tipoExcel, workbook, worksheet, boldBorderStyle, outputDir, path);
            //console.log('Archivo generado en:', newFilePath);
            return newFilePath;
        }

        if (dataToInsert.invoicePais === 'PE') {
            const newFilePath = await ClassExcelPeru.excelPeru(dataToInsert, items, tipoExcel, workbook, worksheet, boldBorderStyle, outputDir, path);
            //console.log('Archivo generado en:', newFilePath);
            return newFilePath;
        }

        if (dataToInsert.invoicePais === 'CR') {
            const newFilePath = await ClassExcelCostaRica.excelCostaRica(dataToInsert, items, tipoExcel, workbook, worksheet, boldBorderStyle, outputDir, path);
            //console.log('Archivo generado en:', newFilePath);
            return newFilePath;
        }

        if (dataToInsert.invoicePais === 'EC') {
            const newFilePath = await ClassExcelEcuador.excelEcuador(dataToInsert, items, tipoExcel, workbook, worksheet, boldBorderStyle, outputDir, path);
            //console.log('Archivo generado en:', newFilePath);
            return newFilePath;
        }

        if (dataToInsert.invoicePais === 'AR') {
            const newFilePath = await ClassExcelArgentina.excelArgentina(dataToInsert, items, tipoExcel, workbook, worksheet, boldBorderStyle, outputDir, path);
            //console.log('Archivo generado en:', newFilePath);
            return newFilePath;
        }

        if (dataToInsert.invoicePais === 'PY') {
            const newFilePath = await ClassExcelParaguay.excelParaguay(dataToInsert, items, tipoExcel, workbook, worksheet, boldBorderStyle, outputDir, path);
            //console.log('Archivo generado en:', newFilePath);
            return newFilePath;
        }

        if (dataToInsert.invoicePais === 'DO') {
            const newFilePath = await ClassExcelRD.excelRD(dataToInsert, items, tipoExcel, workbook, worksheet, boldBorderStyle, outputDir, path);
            //console.log('Archivo generado en:', newFilePath);
            return newFilePath;
        }

        if (dataToInsert.invoicePais === 'UY') {
            const newFilePath = await ClassExcelUruguay.excelUruguay(dataToInsert, items, tipoExcel, workbook, worksheet, boldBorderStyle, outputDir, path);
            //console.log('Archivo generado en:', newFilePath);
            return newFilePath;
        }

        if (dataToInsert.invoicePais === 'VE') {
            console.log('Estoy en excelVenezuela')
            const newFilePath = await ClassExcelVenezuela.excelVenezuela(dataToInsert, items, tipoExcel, workbook, worksheet, boldBorderStyle, outputDir, path);
            //console.log('Archivo generado en:', newFilePath);
            return newFilePath;
        }

    } else if (marca === 'VSFA' || marca === 'VSBA') {
        console.log('Estoy en VSFA')
        if (dataToInsert.invoicePais === 'PA') {
            const newFilePath = await ClassExcelPanama.excelPanamaVSFA(dataToInsert, items, tipoExcel, workbook, worksheet, boldBorderStyle, outputDir, path);
            //console.log('Archivo generado en:', newFilePath);
            return newFilePath;
        }

        if (dataToInsert.invoicePais === 'CO') {
            const newFilePath = await ClassExcelColombia.excelColombiaVSFA(dataToInsert, items, tipoExcel, workbook, worksheet, boldBorderStyle, outputDir, path);
            //console.log('Archivo generado en:', newFilePath);
            return newFilePath;
        }

        if (dataToInsert.invoicePais === 'CR') {
            const newFilePath = await ClassExcelCostaRica.excelCostaRicaVSFA(dataToInsert, items, tipoExcel, workbook, worksheet, boldBorderStyle, outputDir, path);
            //console.log('Archivo generado en:', newFilePath);
            return newFilePath;
        }

        if (dataToInsert.invoicePais === 'EC') {
            const newFilePath = await ClassExcelEcuador.excelEcuadorVSFA(dataToInsert, items, tipoExcel, workbook, worksheet, boldBorderStyle, outputDir, path);
            //console.log('Archivo generado en:', newFilePath);
            return newFilePath;
        }

        if (dataToInsert.invoicePais === 'SV') {
            const newFilePath = await ClassExcelSalvador.excelSalvadorVSFA(dataToInsert, items, tipoExcel, workbook, worksheet, boldBorderStyle, outputDir, path);
            //console.log('Archivo generado en:', newFilePath);
            return newFilePath;
        }

        if (dataToInsert.invoicePais === 'PY') {
            const newFilePath = await ClassExcelParaguay.excelParaguayVSFA(dataToInsert, items, tipoExcel, workbook, worksheet, boldBorderStyle, outputDir, path);
            //console.log('Archivo generado en:', newFilePath);
            return newFilePath;
        }

        if (dataToInsert.invoicePais === 'UY') {
            const newFilePath = await ClassExcelUruguay.excelUruguayVSFA(dataToInsert, items, tipoExcel, workbook, worksheet, boldBorderStyle, outputDir, path);
            //console.log('Archivo generado en:', newFilePath);
            return newFilePath;
        }

        if (dataToInsert.invoicePais === 'VE') {
            const newFilePath = await ClassExcelVenezuela.excelVenezuelaVSFA(dataToInsert, items, tipoExcel, workbook, worksheet, boldBorderStyle, outputDir, path);
            //console.log('Archivo generado en:', newFilePath);
            return newFilePath;
        }

        if (dataToInsert.invoicePais === 'PE') {
            const newFilePath = await ClassExcelPeru.excelPeruVSFA(dataToInsert, items, tipoExcel, workbook, worksheet, boldBorderStyle, outputDir, path);
            //console.log('Archivo generado en:', newFilePath);
            return newFilePath;
        }

        if (dataToInsert.invoicePais === 'GT') {
            const newFilePath = await ClassExcelGuatemala.excelGuatemalaVSFA(dataToInsert, items, tipoExcel, workbook, worksheet, boldBorderStyle, outputDir, path);
            //console.log('Archivo generado en:', newFilePath);
            return newFilePath;
        }
        if (dataToInsert.invoicePais === 'AR') {
            const newFilePath = await ClassExcelArgentina.excelArgentinaVSFA(dataToInsert, items, tipoExcel, workbook, worksheet, boldBorderStyle, outputDir, path);
            //console.log('Archivo generado en:', newFilePath);
            return newFilePath;
        }
        if (dataToInsert.invoicePais === 'DO') {
            const newFilePath = await ClassExcelRD.excelRDVSFA(dataToInsert, items, tipoExcel, workbook, worksheet, boldBorderStyle, outputDir, path);
            //console.log('Archivo generado en:', newFilePath);
            return newFilePath;
        }
        if (dataToInsert.invoicePais === 'CW') {
            const newFilePath = await ClassExcelCuracao.excelCuracaoVSFA(dataToInsert, items, tipoExcel, workbook, worksheet, boldBorderStyle, outputDir, path);
            //console.log('Archivo generado en:', newFilePath);
            return newFilePath;
        }
    }

}