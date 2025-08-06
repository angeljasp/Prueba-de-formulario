document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('serviceForm');
    const confirmation = document.getElementById('confirmation');
    const displayId = document.getElementById('displayId');
    const trackingInput = document.getElementById('tracking_id');

    // Generar ID único al cargar
    const generateID = () => {
        const datePart = Date.now().toString(36).toUpperCase();
        const randomPart = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        return `SOL-${datePart}-${randomPart}`;
    };

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = document.getElementById('submitBtn');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Enviando...';

        // Generar y asignar ID
        const trackingId = generateID();
        trackingInput.value = trackingId;

        try {
            // 1. Enviar a Netlify Forms
            const formData = new FormData(form);
            await fetch('/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(formData),
            });

            // 2. Enviar correo via EmailJS (usando la plantilla que te funcionaba)
            await emailjs.send(
                'service_puvhyly', // Tu servicio ID
                'template_hskgq77', // Tu template ID
                {
                    tracking_id: trackingId,
                    nombre: formData.get('nombre'),
                    email: formData.get('email'),
                    telefono: formData.get('telefono'),
                    detalles: formData.get('detalles')
                }
            );

            // Mostrar confirmación
            displayId.textContent = trackingId;
            confirmation.classList.remove('hidden');
            form.reset();

            // Configurar botón copiar
            document.getElementById('copyBtn').addEventListener('click', () => {
                navigator.clipboard.writeText(trackingId);
                alert('ID copiado al portapapeles');
            });

        } catch (error) {
            alert('Error al enviar: ' + error.message);
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Enviar Solicitud';
        }
    });
});
