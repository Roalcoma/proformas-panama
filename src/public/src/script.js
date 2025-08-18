document.addEventListener('DOMContentLoaded', () => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (isAuthenticated !== 'true') {
        window.location.href = '/login';
    }

    const DB = localStorage.getItem('DB');


    const invoiceForm = document.getElementById('invoiceForm');
    const serieFacInput = document.getElementById('serieFac');
    const numFacIniInput = document.getElementById('numFacIni');
    const numFacFinInput = document.getElementById('numFacFin');
    const templateSelect = document.getElementById('templateSelect');
    const generateBtn = document.getElementById('generateBtn');

    const loadingSection = document.getElementById('loading');
    const downloadSection = document.getElementById('downloadSection');
    const downloadBtn = document.getElementById('downloadBtn');
    const resetBtn = document.getElementById('resetBtn');
    const messageElement = document.getElementById('message');

    const errorSection = document.getElementById('errorSection');
    const errorMessageElement = errorSection.querySelector('.error-message');
    const errorResetBtn = document.getElementById('errorResetBtn');

    const generatedDocsList = document.getElementById('generatedDocsList');


    //Elementos del modal de previsualización
    const previewModal = document.getElementById('previewModal');
    const previewTotal = document.getElementById('preview-proformas')
    const modalFacturaNumero = document.getElementById('modalFacturaNumero');
    const modalCliente = document.getElementById('modalCliente');
    const modalDocumentoCliente = document.getElementById('modalDocumentoCliente');
    const modalTotalBruto = document.getElementById('modalTotalBruto');
    const modalDescuento = document.getElementById('modalDescuento');
    const modalTotalNeto = document.getElementById('modalTotalNeto');
    const modalPais = document.getElementById('modalPais');
    const modalGenerateBtn = document.getElementById('confirmGenerateBtn')
    const modalCloseButton = document.getElementById('close-button')

    // NUEVAS REFERENCIAS Y VARIABLES PARA LA SIMULACIÓN DE CARGA AVANZADA
    const loadingMessage = document.getElementById('loadingMessage');
    const progressBar = document.getElementById('progressBar');
    const generatedFilesPreview = document.getElementById('generatedFilesPreview'); // Nuevo contenedor para los nombres de archivo en carga

    let simulatedFileNames = []; // Array para almacenar los nombres de archivo a simular

    // Función para resetear el estado de la simulación visual
    function resetLoadingSimulation() {
        progressBar.style.width = '0%';
        loadingMessage.textContent = 'Iniciando la generación de documentos...';
        if (generatedFilesPreview) {
            generatedFilesPreview.innerHTML = ''; // Limpiar la vista previa de archivos
            // Asegurarse de que el scroll esté al inicio al resetear
            generatedFilesPreview.scrollTop = 0; 
        }
        simulatedFileNames = []; // Limpiar los nombres de archivo simulados
    }

    // Función para mostrar una sección y ocultar las demás
    function showSection(sectionToShow) {
        invoiceForm.style.display = 'none';
        loadingSection.style.display = 'none';
        downloadSection.style.display = 'none';
        errorSection.style.display = 'none';

        if (sectionToShow) {
            sectionToShow.style.display = 'block';
        }
    }

    // Función para abrir el modal y mostrar la información
    function openPreviewModal(facturasData) {
        previewTotal.innerHTML = ''
        previewTotal.innerHTML = `Proformas a generar: ${facturasData.length}`
        modalBodyScrollable.innerHTML = ''; // Limpiar cualquier contenido previo

        

        if (facturasData && facturasData.length > 0) {
            facturasData.forEach((data, index) => {
                const card = document.createElement('div');
                card.classList.add('invoice-preview-card');
                card.innerHTML = `
                    <h3>Factura ${data.NUMSERIE} - ${data.NUMFAC}</h3>
                    <p><strong>Cliente:</strong> ${data.NOMBRECLIENTE}</p>
                    <p><strong>Nif20:</strong> ${data.NIF20}</p>
                    <p><strong>Total Bruto:</strong> ${data.TOTALBRUTO}</p>
                    <p><strong>Descuento:</strong> ${data.TOTDTOCOMERCIAL}</p>
                    <p><strong>Total Neto:</strong> ${data.TOTALNETO}</p>
                    <p><strong>País:</strong> ${data.PAIS}</p>
                `;
                modalBodyScrollable.appendChild(card);
            });
        } else {
            modalBodyScrollable.innerHTML = '<p>No hay facturas para previsualizar.</p>';
        }

        previewModal.style.display = 'flex'; // Mostrar el modal
    }

    // Función para cerrar el modal
    function closePreviewModal() {
        previewModal.style.display = 'none';
    }

    // Inicializar mostrando el formulario y reseteando la simulación
    showSection(invoiceForm);
    resetLoadingSimulation();

    invoiceForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const serieFac = serieFacInput.value;
        const numFacIni = parseInt(numFacIniInput.value, 10);
        const numFacFin = parseInt(numFacFinInput.value, 10);
        const selectedTemplate = templateSelect.value;

        console.log(DB)

        const facturasResponse = await fetch(`http://172.20.1.67:9000/generador/preview-proformas?numSerie=${serieFac}&numFacturaIni=${numFacIni}&numFacturaFin=${numFacFin}&db=${DB}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })

        const facturasData = (await facturasResponse.json()).clientes

        console.log(facturasData)

        openPreviewModal(facturasData)
        
    });

    modalCloseButton.addEventListener('click', () => {closePreviewModal()})

    modalGenerateBtn.addEventListener('click', async () => {
        const serieFac = serieFacInput.value;
        const numFacIni = parseInt(numFacIniInput.value, 10);
        const numFacFin = parseInt(numFacFinInput.value, 10);
        const selectedTemplate = templateSelect.value;

        closePreviewModal()

        if (generatedDocsList) {
            generatedDocsList.innerHTML = '';
        }

        resetLoadingSimulation(); // Resetear visualmente la simulación antes de iniciar
        showSection(loadingSection); // Mostrar la sección de carga

        

        if (!serieFac || isNaN(numFacIni) || isNaN(numFacFin) || numFacIni > numFacFin) {
            errorMessageElement.textContent = 'Por favor, complete todos los campos correctamente. El número inicial no puede ser mayor que el final.';
            showSection(errorSection);
            return;
        }

        // PRE-CALCULAR LOS NOMBRES DE ARCHIVO QUE SE SIMULARÁN
        simulatedFileNames = [];
        const numDocsToGenerate = numFacFin - numFacIni + 1;
        if (numDocsToGenerate > 0) {
            for (let i = 0; i < numDocsToGenerate; i++) {
                const currentDocNum = numFacIni + i;
                simulatedFileNames.push(`Proforma_${serieFac}_${currentDocNum}.xlsx`);
            }
        }

        // Simular el progreso visual de la generación
        const totalSimulatedTime = 4000;
        const fetchTimeout = 9000;      

        let progressInterval;
        let currentProgress = 0;
        let fileIndex = 0; 

        const animateProgress = () => {
            progressInterval = setInterval(() => {
                currentProgress += (100 / (totalSimulatedTime / 100)); // Ajuste para que siempre llegue al 100% en totalSimulatedTime
                if (currentProgress <= 100) {
                    progressBar.style.width = currentProgress + '%';
                    
                    // Lógica para aparecer los nombres de archivo
                    // Distribuye la aparición de archivos a lo largo de la barra de progreso
                    // Solo si hay archivos para mostrar
                    if (simulatedFileNames.length > 0) { 
                        const filesPerProgressStep = (100 / simulatedFileNames.length); 
                        const expectedFileIndex = Math.floor(currentProgress / filesPerProgressStep);

                        if (fileIndex < simulatedFileNames.length && expectedFileIndex >= fileIndex) {
                            const fileName = simulatedFileNames[fileIndex];
                            const fileItem = document.createElement('p');
                            fileItem.textContent = fileName;
                            fileItem.classList.add('file-name-item');
                            if (generatedFilesPreview) {
                                generatedFilesPreview.appendChild(fileItem);
                                setTimeout(() => {
                                    fileItem.classList.add('show');
                                    // *** SCROLL AUTOMÁTICO AQUÍ ***
                                    generatedFilesPreview.scrollTop = generatedFilesPreview.scrollHeight; 
                                }, 50); 
                            }
                            fileIndex++;
                            loadingMessage.textContent = `Generando: ${fileName}...`;
                        } else if (fileIndex === simulatedFileNames.length && currentProgress < 100) {
                            loadingMessage.textContent = `Finalizando documentos...`;
                        } else if (currentProgress >= 100) {
                            loadingMessage.textContent = `Documentos generados. Preparando para descarga...`;
                        }
                    } else { // Si no hay archivos para generar (ej. numFacIni > numFacFin)
                        loadingMessage.textContent = `Proceso completado. No se generaron documentos.`;
                    }

                } else {
                    clearInterval(progressInterval);
                }
            }, 100); // Actualiza cada 100ms
        };

        animateProgress();

        try {
            const responsePromise = fetch(`http://172.20.1.67:9000/generador/process-template?numSerie=${serieFac}&numFacturaIni=${numFacIni}&numFacturaFin=${numFacFin}&tipoExcel=${selectedTemplate}&db=${DB}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const result = await Promise.race([
                responsePromise,
                new Promise(resolve => setTimeout(() => resolve({ simulated: true }), fetchTimeout))
            ]);

            clearInterval(progressInterval);
            progressBar.style.width = '100%';
            loadingMessage.textContent = 'Documentos generados. Preparando para descarga...';

            setTimeout(async () => {
                if (result && result.simulated) {
                    const actualResponse = await responsePromise;
                    if (!actualResponse.ok) {
                        const errorData = await actualResponse.json();
                        throw new Error(errorData.message || 'Error al obtener los datos de la factura.');
                    }
                    const invoiceData = await actualResponse.json();
                    handleSuccess(invoiceData, serieFac, numFacIni, numFacFin);
                } else if (result && result instanceof Response) {
                    if (!result.ok) {
                        const errorData = await result.json();
                        throw new Error(errorData.message || 'Error al obtener los datos de la factura.');
                    }
                    const invoiceData = await result.json();
                    handleSuccess(invoiceData, serieFac, numFacIni, numFacFin);
                } else {
                    throw new Error('No se recibió respuesta del servidor.');
                }
            }, 500); 

        } catch (error) {
            clearInterval(progressInterval);
            console.error('Error en el proceso:', error);
            errorMessageElement.textContent = `Error: ${error.message}`;
            showSection(errorSection);
        }
    })

    function handleSuccess(invoiceData, serieFac, numFacIni, numFacFin) {
        console.log('Respuesta del JSON: ', invoiceData);

        const numDocsGenerated = numFacFin - numFacIni + 1;
        if (numDocsGenerated > 0 && generatedDocsList) {
            for (let i = 0; i < numDocsGenerated; i++) {
                const currentDocNum = numFacIni + i;
                const docLink = document.createElement('a');
                docLink.href = `#`;
                docLink.textContent = `Proforma_${serieFac}_${currentDocNum}.xlsx`;
                docLink.classList.add('doc-item');
                docLink.target = '_blank';
                docLink.title = `Simular descarga de Proforma_${serieFac}_${currentDocNum}.xlsx`;
                
                docLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    alert(`Simulando la apertura/descarga individual de: ${docLink.textContent}`);
                });
                
                generatedDocsList.appendChild(docLink);
            }
        } else if (numDocsGenerated <= 0) {
            messageElement.textContent = '¡Proceso completado, pero no se generaron documentos en el rango especificado!';
            console.warn('No se generaron documentos porque el rango es inválido o numDocsGenerated <= 0.');
        }

        messageElement.textContent = invoiceData.message || '¡Proformas generadas con éxito!';
        showSection(downloadSection);
    }

    downloadBtn.addEventListener('click', async () => {
        try {
            const response = await fetch(`http://172.20.1.67:9000/generador/download-zip`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                let errorData = { message: 'Error desconocido al descargar el archivo.' };
                try {
                    errorData = JSON.parse(errorText);
                } catch (e) {
                    errorData.message = errorText;
                }
                throw new Error(errorData.message || 'Error en la descarga del archivo.');
            }

            const contentDisposition = response.headers.get('Content-Disposition');
            let filename = 'facturas_generadas.zip';
            if (contentDisposition && contentDisposition.includes('filename=')) {
                const filenameMatch = contentDisposition.match(/filename\*?=['"]?(?:UTF-\d['"]*)?([^;\n]*?)['"]?$/i);
                if (filenameMatch && filenameMatch[1]) {
                    try {
                        filename = decodeURIComponent(filenameMatch[1].replace(/^UTF-8''/, ''));
                    } catch (e) {
                        console.warn('No se pudo decodificar el nombre de archivo del Content-Disposition:', e);
                        filename = filenameMatch[1].replace(/^UTF-8''/, '');
                    }
                }
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            messageElement.textContent = `¡${filename} generado y descarga iniciada!`;
        } catch (error) {
            console.error('Error en la descarga:', error);
            errorMessageElement.textContent = `Error de descarga: ${error.message}`;
            showSection(errorSection);
        }
    });

    resetBtn.addEventListener('click', () => {
        invoiceForm.reset();
        if (generatedDocsList) {
            generatedDocsList.innerHTML = '';
        }
        resetLoadingSimulation();
        showSection(invoiceForm);
    });

    errorResetBtn.addEventListener('click', () => {
        invoiceForm.reset();
        resetLoadingSimulation();
        showSection(invoiceForm);
    });
});