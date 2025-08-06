document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('serviceForm');
    const trackingID = document.getElementById('trackingID');
    const idGenerado = document.getElementById('idGenerado');
    const submitBtn = document.getElementById('submitBtn');
    const copyBtn = document.getElementById('copyButton');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Deshabilitar botón durante el envío
        submitBtn.disabled = true;
        submitBtn.textContent = 'Enviando...';
        
        // Generar ID único
        const newId = `SOL-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
        
        try {
            // Enviar a Netlify
            const formData = new FormData(form);
            formData.append('tracking_id', newId);
            
            await fetch('/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(formData),
            });
            
            // Mostrar ID
            idGenerado.textContent = newId;
            trackingID.classList.remove('hidden');
            
            // Copiar al portapapeles
            copyBtn.addEventListener('click', () => {
                navigator.clipboard.writeText(newId);
                copyBtn.textContent = '¡Copiado!';
                setTimeout(() => copyBtn.textContent = 'Copiar ID', 2000);
            });
            
        } catch (error) {
            alert('Error al enviar: ' + error.message);
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Enviar Solicitud';
        }
    });
});
