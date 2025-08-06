document.getElementById('serviceForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Simular generación de ID (en producción, esto lo manejaría Netlify o tu backend)
    const randomID = 'ID-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    document.getElementById('idGenerado').textContent = randomID;
    document.getElementById('trackingID').classList.remove('hidden');

    // Copiar al portapapeles
    document.getElementById('copyButton').addEventListener('click', function() {
        navigator.clipboard.writeText(randomID);
        alert('ID copiado: ' + randomID);
    });
});
