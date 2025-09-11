import ExcelJS from 'exceljs';

export async function excelSalvador(dataToInsert: any, items: any, tipoExcel: String, workbook: any, worksheet: any, boldBorderStyle: any, outputDir: any, path: any): Promise<string> {
    let newFilePath: any = '';

    if (tipoExcel === 'BEAUTY') {
        // --- Insertar datos de cabecera ---
        // Aplica estilos de borde aquí si también quieres los campos de cabecera con bordes
        const clientCodeCell = worksheet.getCell('H1');
        clientCodeCell.value = `Cliente N°: ${dataToInsert.clientCode}`;
        clientCodeCell.border = boldBorderStyle; // Aplicar borde

        const clientNameCell = worksheet.getCell('H3');
        clientNameCell.value = `${dataToInsert.clientName}`;
        clientNameCell.border = {
                            top: { style: 'medium' as ExcelJS.BorderStyle, color: { argb: 'FF000000' } }, // Negro
                            left: { style: 'medium' as ExcelJS.BorderStyle, color: { argb: 'FF000000' } }
                        };

        const clientAddressCell = worksheet.getCell('H5');
        clientAddressCell.value = `${dataToInsert.clientAddress}`;
        clientAddressCell.border = {
                                left: { style: 'medium' as ExcelJS.BorderStyle, color: { argb: 'FF000000' } },
                            };

        const clientNifCell = worksheet.getCell('H4');
        clientNifCell.value = `${dataToInsert.clientNif}`;
        clientNifCell.border = {
                                left: { style: 'medium' as ExcelJS.BorderStyle, color: { argb: 'FF000000' } },
                            };

        const clientPhoneCell = worksheet.getCell('H7');
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
            cellA.value = item.CODIGO;
            cellA.border = boldBorderStyle;

            const cellB = worksheet.getCell(`B${currentRowForNewItems}`);
            cellB.value = item.PRODUCTO;
            cellB.border = boldBorderStyle;

            const cellC = worksheet.getCell(`C${currentRowForNewItems}`);
            cellC.value = item.FRAGANCIA;
            cellC.border = boldBorderStyle;

            const cellD = worksheet.getCell(`D${currentRowForNewItems}`);
            cellD.value = item.CONTENIDO;
            cellD.border = boldBorderStyle;

            const cellE = worksheet.getCell(`E${currentRowForNewItems}`);
            cellE.value = item.DETALLE;
            cellE.border = boldBorderStyle;

            const cellF = worksheet.getCell(`F${currentRowForNewItems}`);
            cellF.value = item.COMPOSICION;
            cellF.border = boldBorderStyle;

            const cellG = worksheet.getCell(`G${currentRowForNewItems}`);
            cellG.value = item.ORIGEN;
            cellG.border = boldBorderStyle;

            const cellH = worksheet.getCell(`H${currentRowForNewItems}`);
            cellH.value = item.MARCA;
            cellH.border = boldBorderStyle;

            const cellI = worksheet.getCell(`I${currentRowForNewItems}`);
            cellI.value = item.CANTIDAD;
            cellI.border = boldBorderStyle;

            const cellJ = worksheet.getCell(`J${currentRowForNewItems}`);
            cellJ.value = item.PRECIO;
            cellJ.border = boldBorderStyle;

            const cellK = worksheet.getCell(`K${currentRowForNewItems}`);
            cellK.value = item.TOTAL;
            cellK.border = boldBorderStyle;

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

        const despacho = worksheet.getCell(`A${realRowsTotal + 6}`);
        despacho.value = `Via de Despacho: ${dataToInsert.clientDespacho}`;

        const totalNetoCell = worksheet.getCell(`K${realRowsTotal}`);
        totalNetoCell.value = dataToInsert.totalNeto;
        totalNetoCell.border = boldBorderStyle; // Aplicar borde

        const lastRowBeauty = worksheet.lastRow.number;
        worksheet.pageSetup.printArea = `A1:K${lastRowBeauty}`;
        worksheet.views = [{ state: 'normal', showGridLines: true }];

        const newFileName = `documento_${dataToInsert.invoiceSerie}_${dataToInsert.invoiceNumber}_${dataToInsert.invoicePais}_${tipoExcel}.xlsx`;
        newFilePath = path.join(outputDir, newFileName);

        await workbook.xlsx.writeFile(newFilePath);

        
    } else if (tipoExcel === 'ACC') {
        // --- Insertar datos de cabecera ---
        // Aplica estilos de borde aquí si también quieres los campos de cabecera con bordes
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
            // *** ESTO ES LO CLAVE: Insertar una nueva fila en la posición actual ***
            // Esto empujará todas las filas (incluyendo los campos debajo de la tabla de ítems)
            // hacia abajo para hacer espacio para el nuevo ítem.
            worksheet.insertRow(currentRowForNewItems, []);

            // Asignar valores a las celdas de la nueva fila.
            // Las columnas son A, B, C, D, E, F, G, H, I, J, K, L.
            const cellA = worksheet.getCell(`A${currentRowForNewItems}`);
            cellA.value = item.CODIGO;
            cellA.border = boldBorderStyle;

            const cellB = worksheet.getCell(`B${currentRowForNewItems}`);
            cellB.value = item.CONTENIDO;
            cellB.border = boldBorderStyle;

            const cellC = worksheet.getCell(`C${currentRowForNewItems}`);
            cellC.value = item.DETALLE;
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

            // Si necesitas calcular un subtotal de los ítems
            // subtotal += item.TOTAL; // Si item.TOTAL es el total por línea

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

        const despacho = worksheet.getCell(`A${realRowsTotal + 6}`);
        despacho.value = `Via de Despacho: ${dataToInsert.clientDespacho}`;

        const totalNetoCell = worksheet.getCell(`I${realRowsTotal}`);
        totalNetoCell.value = dataToInsert.totalNeto;
        totalNetoCell.border = boldBorderStyle; // Aplicar borde

        const lastRowBeauty = worksheet.lastRow.number;
        worksheet.pageSetup.printArea = `A1:I${lastRowBeauty}`;
        worksheet.views = [{ state: 'normal', showGridLines: true }];

        const newFileName = `documento_${dataToInsert.invoiceSerie}_${dataToInsert.invoiceNumber}_${dataToInsert.invoicePais}_${tipoExcel}.xlsx`;
        newFilePath = path.join(outputDir, newFileName);

        await workbook.xlsx.writeFile(newFilePath);
    }

    return newFilePath;
}