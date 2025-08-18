import ExcelJS from 'exceljs';

export async function excelParaguay(dataToInsert: any, items: any, tipoExcel: String, workbook: any, worksheet: any, boldBorderStyle: any, outputDir: any, path: any): Promise<string> {
    let newFilePath: any = '';

    const clientCodeCell = worksheet.getCell('G1');
    clientCodeCell.value = `Cliente N°: ${dataToInsert.clientCode}`;
    clientCodeCell.border = boldBorderStyle; // Aplicar borde

    const clientNameCell = worksheet.getCell('G3');
    clientNameCell.value = `${dataToInsert.clientName}`;
    clientNameCell.border = {
                        top: { style: 'medium' as ExcelJS.BorderStyle, color: { argb: 'FF000000' } }, // Negro
                        left: { style: 'medium' as ExcelJS.BorderStyle, color: { argb: 'FF000000' } }
                    };

    const clientAddressCell = worksheet.getCell('G5');
    clientAddressCell.value = `${dataToInsert.clientAddress}`;
    clientAddressCell.border = {
                            left: { style: 'medium' as ExcelJS.BorderStyle, color: { argb: 'FF000000' } },
                        };

    const clientNifCell = worksheet.getCell('G4');
    clientNifCell.value = `${dataToInsert.clientNif}`;
    clientNifCell.border = {
                            left: { style: 'medium' as ExcelJS.BorderStyle, color: { argb: 'FF000000' } },
                        };

    const clientPhoneCell = worksheet.getCell('G7');
    clientPhoneCell.value = `Teléfono: ${dataToInsert.clientPhone}`;
    clientPhoneCell.border = {
                        left: { style: 'medium' as ExcelJS.BorderStyle, color: { argb: 'FF000000' } },
                        bottom: { style: 'medium' as ExcelJS.BorderStyle, color: { argb: 'FF000000' } }
                    };  

    const invoiceDateCell = worksheet.getCell('A9');
    invoiceDateCell.value = dataToInsert.invoiceDate;
    invoiceDateCell.border = boldBorderStyle; // Aplicar borde

    const invoiceNumberCell = worksheet.getCell('B9');
    invoiceNumberCell.value = dataToInsert.invoiceNumber;
    invoiceNumberCell.border = boldBorderStyle; // Aplicar borde

    // --- Lógica para INSERTAR nuevos ítems sin eliminar filas ---

    const startRowForItems = 12; // La fila donde se empezará a insertar los ítems.
                            // Todas las filas desde aquí hacia abajo se desplazarán.
    const startRowForTotals = 13; // Fila donde empiezan los totales.

    const realRowsTotal = startRowForTotals + items.length

    let currentRowForNewItems = startRowForItems; // La fila donde se insertará el primer nuevo ítem
    let subtotal = 0; // Si necesitas calcular un subtotal de los ítems insertados.

    // Itera sobre los ítems de la data
    items.forEach((item: any) => {
        
        worksheet.insertRow(currentRowForNewItems, []);

        const cellA = worksheet.getCell(`A${currentRowForNewItems}`);
        cellA.value = item.ARTICULO;
        cellA.border = boldBorderStyle;

        const cellB = worksheet.getCell(`B${currentRowForNewItems}`);
        cellB.value = item.CONTENIDO;
        cellB.border = boldBorderStyle;

        const cellC = worksheet.getCell(`C${currentRowForNewItems}`);
        cellC.value = item.DESCRIPCION;
        cellC.border = boldBorderStyle;

        const cellD = worksheet.getCell(`D${currentRowForNewItems}`);
        cellD.value = item.COMPOSICION;
        cellD.border = boldBorderStyle;

        const cellE = worksheet.getCell(`E${currentRowForNewItems}`);
        cellE.value = item.ORIGEN;
        cellE.border = boldBorderStyle;

        const cellF = worksheet.getCell(`F${currentRowForNewItems}`);
        cellF.value = item.MARCA;
        cellF.border = boldBorderStyle;

        const cellG = worksheet.getCell(`G${currentRowForNewItems}`);
        cellG.value = item.CANTIDAD;
        cellG.border = boldBorderStyle;

        const cellH = worksheet.getCell(`H${currentRowForNewItems}`);
        cellH.value = item.PRECIO;
        cellH.border = boldBorderStyle;

        const cellI = worksheet.getCell(`I${currentRowForNewItems}`);
        cellI.value = item.TOTAL;
        cellI.border = boldBorderStyle;

        currentRowForNewItems++; // Avanza a la siguiente fila para el próximo ítem
    });

    const totalUnidadesCell = worksheet.getCell(`C${realRowsTotal}`);
    totalUnidadesCell.value = dataToInsert.totalUnidades;
    totalUnidadesCell.border = boldBorderStyle; // Aplicar borde

    const pesoBruto = worksheet.getCell(`C${realRowsTotal + 2}`);
    pesoBruto.value = dataToInsert.clientPeso;
    pesoBruto.border = boldBorderStyle; // Aplicar borde

    const totalCajas = worksheet.getCell(`C${realRowsTotal + 1}`);
    totalCajas.value = dataToInsert.clientBulto;
    totalCajas.border = boldBorderStyle; // Aplicar borde

    const formaPago = worksheet.getCell(`A${realRowsTotal + 4}`);
    formaPago.value = `Forma de Pago: ${dataToInsert.clientFormaPago}`;

    const moneda = worksheet.getCell(`A${realRowsTotal + 5}`);
    moneda.value = `Moneda de Negociación: ${dataToInsert.clientMoneda}`;

    const despacho = worksheet.getCell(`A${realRowsTotal + 7}`);
    despacho.value = `Via de Despacho: ${dataToInsert.clientDespacho}`;

    const totalBrutoCell = worksheet.getCell(`I${realRowsTotal}`);
    totalBrutoCell.value = dataToInsert.totalBruto;
    totalBrutoCell.border = boldBorderStyle; // Aplicar borde

    const totalNetoCell = worksheet.getCell(`I${realRowsTotal + 2}`);
    totalNetoCell.value = dataToInsert.totalNeto;
    totalNetoCell.border = boldBorderStyle; // Aplicar borde

    const newFileName = `documento_${dataToInsert.invoiceSerie}_${dataToInsert.invoiceNumber}_${dataToInsert.invoicePais}_${tipoExcel}.xlsx`;
    newFilePath = path.join(outputDir, newFileName);

    await workbook.xlsx.writeFile(newFilePath);

        
   

    return newFilePath;
}