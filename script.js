// Inicialización cuando el DOM está listo
document.addEventListener('DOMContentLoaded', function() {
    // Configurar año actual en el footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // Inicializar EmailJS con tu clave pública
    emailjs.init('naOhhhdCRqiLYdV5P');
    
    // Configurar selector de teléfono internacional
    const phoneInput = window.intlTelInput(document.getElementById('corporate-phone'), {
        initialCountry: "auto",
        geoIpLookup: function(callback) {
            fetch('https://ipapi.co/json')
                .then(function(response) {
                    return response.json();
                })
                .then(function(data) {
                    callback(data.country_code);
                })
                .catch(function() {
                    callback('us'); // Fallback a EE.UU.
                });
        },
        utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
        preferredCountries: ['ec', 'us', 'co', 'pe', 'mx', 'es'],
        separateDialCode: true,
        hiddenInput: "full_phone",
    });
    
    // Manejar envío del formulario
    const form = document.getElementById('corporateForm');
    const submitBtn = document.getElementById('corporateSubmitBtn');
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Validar nombres y apellidos
        const nombres = document.getElementById('corporate-names').value.trim();
        const apellidos = document.getElementById('corporate-lastnames').value.trim();
        
        if (nombres.split(' ').length < 2 || apellidos.split(' ').length < 2) {
            alert('Por favor ingrese al menos 2 nombres y 2 apellidos completos');
            return;
        }
        
        // Mostrar estado de carga
        submitBtn.classList.add('loading');
        
        // Generar ID de seguimiento profesional
        const trackingId = generateTrackingId();
        
        try {
            // 1. Enviar a Netlify Forms
            const formData = new FormData(form);
            formData.append('tracking_id', trackingId);
            formData.append('telefono_completo', phoneInput.getNumber());
            
            await fetch('/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(formData),
            });
            
            // 2. Enviar correo con EmailJS
            await emailjs.send(
                'service_wy6vkhd',
                'template_wmugv6o',
                {
                    tracking_id: trackingId,
                    nombres: nombres,
                    apellidos: apellidos,
                    email: formData.get('email'),
                    telefono: phoneInput.getNumber(),
                    mensaje: formData.get('mensaje'),
                    reply_to: formData.get('email'),
                    año_actual: new Date().getFullYear()
                }
            );
            
            // Mostrar confirmación
            showConfirmation(trackingId);
            form.reset();
            
        } catch (error) {
            console.error('Error completo:', error);
            showError('Ocurrió un error al enviar el formulario. Por favor intente nuevamente.');
        } finally {
            submitBtn.classList.remove('loading');
        }
    });
    
    // Configurar botón copiar ID
    document.getElementById('corporateCopyBtn')?.addEventListener('click', copyTrackingId);
});

// Función para formatear la fecha en formato DD-MM-YYYY
function formatDateForEmail(dateString) {
    if (!dateString) return 'No especificada';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Fecha inválida';
    
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}-${month}-${year}`;
}

// Generar ID de seguimiento profesional
function generateTrackingId() {
    const datePart = new Date().getTime().toString(36).toUpperCase();
    const randomPart = Math.floor(Math.random() * 900) + 100; // Número entre 100-999
    return `JASPI-${datePart}-${randomPart}`;
}

// Mostrar panel de confirmación
function showConfirmation(trackingId) {
    const confirmationPanel = document.getElementById('corporateConfirmation');
    const trackingElement = document.getElementById('corporateTrackingId');
    
    trackingElement.textContent = trackingId;
    confirmationPanel.classList.remove('hidden');
    
    // Scroll suave a la confirmación
    confirmationPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Copiar ID de seguimiento
function copyTrackingId() {
    const trackingId = document.getElementById('corporateTrackingId').textContent;
    navigator.clipboard.writeText(trackingId);
    
    const copyBtn = document.getElementById('corporateCopyBtn');
    copyBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
        ¡Copiado!
    `;
    
    setTimeout(() => {
        copyBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            Copiar ID
        `;
    }, 2000);
}

// Mostrar mensaje de error
function showError(message) {
    alert(message);
}
