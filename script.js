document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('serviceForm');
    const submitBtn = document.getElementById('submitBtn');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        submitBtn.disabled = true;
        submitBtn.textContent = 'Enviando...';

        // Generar ID único (ej: "JASPI-1A2B3C")
        const trackingId = `JASPI-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

        try {
            // 1. Enviar a Netlify Forms
            const formData = new FormData(form);
            formData.append('tracking_id', trackingId);
            
            await fetch('/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(formData),
            });

            // 2. Enviar correo con EmailJS (usando tus datos)
            await emailjs.send(
                'service_wy6vkhd', // Service ID
                'template_wmugv6o', // Template ID
                {
                    tracking_id: trackingId,
                    nombre: formData.get('nombre'),
                    email: formData.get('email'),
                    telefono: formData.get('telefono'),
                    detalles: formData.get('detalles'),
                    reply_to: formData.get('email') // Para respuestas
                }
            );

            // Mostrar confirmación
            document.getElementById('trackingId').textContent = trackingId;
            document.getElementById('confirmation').classList.remove('hidden');
            form.reset();

        } catch (error) {
            alert(`❌ Error: ${error.message || 'Por favor inténtalo de nuevo'}`);
            console.error("Error detallado:", error);
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Enviar Solicitud';
        }
    });
});

function copyToClipboard() {
    const id = document.getElementById('trackingId').textContent;
    navigator.clipboard.writeText(id);
    alert(`✔️ Copiado: ${id}`);
}
