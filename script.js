document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('serviceForm');
    const trackingIDSection = document.getElementById('trackingID');
    const submitBtn = document.getElementById('submitBtn');

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        submitBtn.disabled = true;
        submitBtn.textContent = 'Enviando...';

        // Generar ID único (simulado)
        const randomID = 'SOL-' + Math.random().toString(36).substr(2, 8).toUpperCase();
        document.getElementById('idGenerado').textContent = randomID;

        // Enviar datos a Netlify
        try {
            const formData = new FormData(form);
            await fetch("/", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams(formData).toString(),
            });

            // Mostrar ID y botón de copiar
            trackingIDSection.classList.remove('hidden');

            // Configurar botón de copiar
            document.getElementById('copyButton').addEventListener('click', function() {
                navigator.clipboard.writeText(randomID);
                alert('ID copiado: ' + randomID);
            });

        } catch (error) {
            alert('Error al enviar: ' + error.message);
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Enviar Solicitud';
        }
    });
});
