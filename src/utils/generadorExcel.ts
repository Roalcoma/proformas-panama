import ExcelJS from 'exceljs';
import path from "path";
import { ClassExcelPanama } from './Mappeos/excelPanama';
import { excelSalvador } from './Mappeos/excelSalvador';
import { excelColombia } from './Mappeos/excelColombia';
import { excelCuracao } from './Mappeos/excelCuracao';
import { excelCostaRica } from './Mappeos/excelCostaRica';
import { excelParaguay } from './Mappeos/excelParaguay';
import { excelRD } from './Mappeos/excelRD';
import { excelUruguay } from './Mappeos/excelUruguay';
import { excelVenezuela } from './Mappeos/excelVenezuela';
import { excelEcuador } from './Mappeos/excelEcuador';
import { ClassExcelArgentina } from './Mappeos/excelArgentina';
import { excelPeru } from './Mappeos/excelPeru';
import { excelGuatemala } from './Mappeos/excelGuatemala';

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

    const templatePath = path.join(templatesDir, `${marca}_${dataToInsert.invoicePais}_${tipoExcel}.xlsx`);

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

    if(marca === 'BBW') {
        console.log('Estoy en BBW')
        if (dataToInsert.invoicePais === 'PA') {
            const newFilePath = await ClassExcelPanama.excelPanama(dataToInsert, items, tipoExcel, workbook, worksheet, boldBorderStyle, outputDir, path);
            //console.log('Archivo generado en:', newFilePath);
            return newFilePath;
        }
    
        if (dataToInsert.invoicePais === 'SV') {
            const newFilePath = await excelSalvador(dataToInsert, items, tipoExcel, workbook, worksheet, boldBorderStyle, outputDir, path);
            //console.log('Archivo generado en:', newFilePath);
            return newFilePath;
        }
    
        if (dataToInsert.invoicePais === 'CO') {
            const newFilePath = await excelColombia(dataToInsert, items, tipoExcel, workbook, worksheet, boldBorderStyle, outputDir, path);
            //console.log('Archivo generado en:', newFilePath);
            return newFilePath;
        }
    
        if (dataToInsert.invoicePais === 'GT') {
            const newFilePath = await excelGuatemala(dataToInsert, items, tipoExcel, workbook, worksheet, boldBorderStyle, outputDir, path);
            //console.log('Archivo generado en:', newFilePath);
            return newFilePath;
        }
    
        if (dataToInsert.invoicePais === 'CW') {
            const newFilePath = await excelCuracao(dataToInsert, items, tipoExcel, workbook, worksheet, boldBorderStyle, outputDir, path);
            //console.log('Archivo generado en:', newFilePath);
            return newFilePath;
        }
    
        if (dataToInsert.invoicePais === 'PE') {
            const newFilePath = await excelPeru(dataToInsert, items, tipoExcel, workbook, worksheet, boldBorderStyle, outputDir, path);
            //console.log('Archivo generado en:', newFilePath);
            return newFilePath;
        }
    
        if (dataToInsert.invoicePais === 'CR') {
            const newFilePath = await excelCostaRica(dataToInsert, items, tipoExcel, workbook, worksheet, boldBorderStyle, outputDir, path);
            //console.log('Archivo generado en:', newFilePath);
            return newFilePath;
        }
    
        if (dataToInsert.invoicePais === 'EC') {
            const newFilePath = await excelEcuador(dataToInsert, items, tipoExcel, workbook, worksheet, boldBorderStyle, outputDir, path);
            //console.log('Archivo generado en:', newFilePath);
            return newFilePath;
        }
    
        if (dataToInsert.invoicePais === 'GT') {
            const newFilePath = await excelGuatemala(dataToInsert, items, tipoExcel, workbook, worksheet, boldBorderStyle, outputDir, path);
            //console.log('Archivo generado en:', newFilePath);
            return newFilePath;
        }
    
        if (dataToInsert.invoicePais === 'AR') {
            const newFilePath = await ClassExcelArgentina.excelArgentina(dataToInsert, items, tipoExcel, workbook, worksheet, boldBorderStyle, outputDir, path);
            //console.log('Archivo generado en:', newFilePath);
            return newFilePath;
        }
    
        if (dataToInsert.invoicePais === 'PY') {
            const newFilePath = await excelParaguay(dataToInsert, items, tipoExcel, workbook, worksheet, boldBorderStyle, outputDir, path);
            //console.log('Archivo generado en:', newFilePath);
            return newFilePath;
        }
    
        if (dataToInsert.invoicePais === 'DO') {
            const newFilePath = await excelRD(dataToInsert, items, tipoExcel, workbook, worksheet, boldBorderStyle, outputDir, path);
            //console.log('Archivo generado en:', newFilePath);
            return newFilePath;
        }
    
        if (dataToInsert.invoicePais === 'UY') {
            const newFilePath = await excelUruguay(dataToInsert, items, tipoExcel, workbook, worksheet, boldBorderStyle, outputDir, path);
            //console.log('Archivo generado en:', newFilePath);
            return newFilePath;
        }
    
        if (dataToInsert.invoicePais === 'VE') {
            console.log('Estoy en excelVenezuela')
            const newFilePath = await excelVenezuela(dataToInsert, items, tipoExcel, workbook, worksheet, boldBorderStyle, outputDir, path);
            //console.log('Archivo generado en:', newFilePath);
            return newFilePath;
        }
        
    } else if (marca === 'VSFA') {
        console.log('Estoy en VSFA')
        if (dataToInsert.invoicePais === 'PA') {
            const newFilePath = await ClassExcelPanama.excelPanamaVSFA(dataToInsert, items, tipoExcel, workbook, worksheet, boldBorderStyle, outputDir, path);
            //console.log('Archivo generado en:', newFilePath);
            return newFilePath;
        }
    } else if (marca === 'VSBA') {
        console.log('Estoy en VSBA')
    }


}