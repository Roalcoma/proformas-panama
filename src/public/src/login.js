document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const companySelect = document.getElementById('companySelect');
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('errorMessage');

    localStorage.removeItem('isAuthenticated')

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Evita que el formulario se envíe de forma predeterminada

        errorMessage.textContent = ''; // Limpia mensajes de error previos

        const company = companySelect.value;
        const password = passwordInput.value;

        localStorage.removeItem('DB')
        localStorage.setItem('DB', company)

        if (!company) {
            errorMessage.textContent = 'Por favor, selecciona una empresa.';
            return;
        }

        if (!password) {
            errorMessage.textContent = 'Por favor, ingresa tu contraseña.';
            return;
        }

        // --- SIMULACIÓN DE AUTENTICACIÓN (ESTO DEBE SER UNA LLAMADA A TU SERVIDOR REAL) ---
        console.log(`Intentando iniciar sesión con Empresa: ${company}, Contraseña: ${password}`);

       
        // SIMULACIÓN DE SESIÓN INICIADA (NO SEGURO PARA PRODUCCIÓN)
        localStorage.removeItem('isAuthenticated')
        localStorage.setItem('isAuthenticated', 'true');
        window.location.href = '/generador-facturas'; // Redirige a la página principal
       
            
       
    });

    async function verificarPassword(e) {
        try {
            const fetchLogin = await fetch(`http://172.20.1.67:9000/auth/login?password=${e.target.value}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            const data = await fetchLogin.json()

            console.log(data)

            loadCompanies(data.user)
        } catch (error) {
            console.error('Error al cargar empresas:', error);
            errorMessage.textContent = 'No se pudieron cargar las empresas.';
        }
    }

    // Opcional: Puedes cargar las opciones del select dinámicamente aquí
    // Por ejemplo, si tienes una API para obtener la lista de empresas:
    
    function loadCompanies(companies) {
        try {
            companySelect.innerHTML = ''; // Limpia y añade el placeholder
            companies.forEach(comp => {
                const option = document.createElement('option');
                option.value = comp.DB; // Asume que cada empresa tiene un ID
                option.textContent = comp.DB; // Asume que cada empresa tiene un nombre
                companySelect.appendChild(option);
            });
        } catch (error) {
            console.error('Error al cargar empresas:', error);
            errorMessage.textContent = 'No se pudieron cargar las empresas.';
        }
    }

    password.addEventListener('change', (e) => {verificarPassword(e)})
    
});