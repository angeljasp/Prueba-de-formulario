// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    // Configura EmailJS
    emailjs.init('naOhhhdCRqiLYdV5P');
    
    // Selector internacional de teléfono
    const phoneInput = window.intlTelInput(document.querySelector("#telefono"), {
        initialCountry: "auto",
        geoIpLookup: callback => {
            fetch("https://ipapi.co/json")
                .then(res => res.json())
                .then(data => callback(data.country_code))
                .catch(() => callback("ec")); // Ecuador como fallback
        },
        utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
        separateDialCode: true
    });

    // Manejo del formulario
    const form = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Validación adicional de nombres/apellidos
        const nombres = document.getElementById('nombres').value.trim();
        const apellidos = document.getElementById('apellidos').value.trim();
        
        if (nombres.split(' ').length < 2 || apellidos.split(' ').length < 2) {
            alert("Por favor ingrese al menos 2 nombres y 2 apellidos completos");
            return;
        }

        // Mostrar estado de carga
        submitBtn.classList.add('loading');
        
        // Generar ID profesional (ej: JASPI-1A2B3C-456)
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
                    fecha: new Date(formData.get('fecha')).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    }),
                    reply_to: formData.get('email')
                }
            );

            // Mostrar confirmación
            showConfirmation(trackingId);
            form.reset();
            
        } catch (error) {
            console.error("Error completo:", error);
            alert(`Error al enviar: ${error.message || 'Por favor intente nuevamente'}`);
        } finally {
            submitBtn.classList.remove('loading');
        }
    });

    // Botón copiar ID
    document.getElementById('copyBtn')?.addEventListener('click', copyToClipboard);
});

// Generar ID de seguimiento profesional
function generateTrackingId() {
    const datePart = new Date().getTime().toString(36).toUpperCase();
    const randomPart = Math.floor(Math.random() * 900 + 100); // Número entre 100-999
    return `JASPI-${datePart}-${randomPart}`;
}

// Mostrar sección de confirmación
function showConfirmation(trackingId) {
    const confirmation = document.getElementById('confirmation');
    const trackingElement = document.getElementById('trackingId');
    
    trackingElement.textContent = trackingId;
    confirmation.style.display = 'block';
    
    // Scroll suave a la confirmación
    confirmation.scrollIntoView({ behavior: 'smooth' });
}

// Copiar ID al portapapeles
function copyToClipboard() {
    const id = document.getElementById('trackingId').textContent;
    navigator.clipboard.writeText(id);
    
    const copyBtn = document.getElementById('copyBtn');
    const originalText = copyBtn.querySelector('span').textContent;
    
    copyBtn.querySelector('span').textContent = '¡Copiado!';
    copyBtn.style.backgroundColor = '#27ae60';
    
    setTimeout(() => {
        copyBtn.querySelector('span').textContent = original
