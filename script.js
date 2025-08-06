document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('serviceForm');
    const confirmation = document.getElementById('confirmation');
    const submitBtn = document.getElementById('submitBtn');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        submitBtn.disabled = true;
        submitBtn.textContent = 'Enviando...';

        // Generar ID de seguimiento
        const trackingId = `JASPI-${Date.now().toString(36).toUpperCase()}`;
        
        try {
            // 1. Enviar a Netlify Forms
            const formData = new FormData(form);
            formData.append('tracking_id', trackingId);
            
            await fetch('/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(formData),
            });

            // 2. Enviar correo via EmailJS
            await emailjs.send(
                'service_wy6vkhd', // Nuevo service ID
                'template_wmugv6o', // Nuevo template ID
                {
                    tracking_id: trackingId,
                    nombre: formData.get('nombre'),
                    email: formData.get('email'),
                    telefono: formData.get('telefono'),
                    detalles: formData.get('detalles'),
                    reply_to: formData.get('email')
                }
            );

            // Mostrar confirmación
            document.getElementById('trackingId').textContent = trackingId;
            confirmation.classList.remove('hidden');
            form.reset();

        } catch (error) {
            alert(`Error al enviar: ${error.message || 'Por favor intente nuevamente'}`);
            console.error('Error:', error);
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Enviar Solicitud';
        }
    });
});

function copyToClipboard() {
    const trackingId = document.getElementById('trackingId').textContent;
    navigator.clipboard.writeText(trackingId);
    alert('ID copiado: ' + trackingId);
}
