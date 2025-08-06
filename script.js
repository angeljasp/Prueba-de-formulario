// Inicialización de EmailJS
emailjs.init('2II2_vIhRBz00PePy');

// Función para validar campos
function validateField(field, errorId) {
    const value = field.value.trim();
    const errorElement = document.getElementById(errorId);
    
    if (!value) {
        field.style.borderColor = 'var(--error)';
        errorElement.style.display = 'block';
        return false;
    }
    
    if (field.type === 'email' && !/^\S+@\S+\.\S+$/.test(value)) {
        field.style.borderColor = 'var(--error)';
        errorElement.style.display = 'block';
        return false;
    }
    
    field.style.borderColor = 'var(--border)';
    errorElement.style.display = 'none';
    return true;
}

// Función para generar ID único
function generarID() {
    const letras = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    const numeros = '23456789';
    const fecha = new Date();
    
    return 'JASP-' + 
           numeros.charAt(fecha.getDate() % numeros.length) +
           numeros.charAt((fecha.getMonth() + 1) % numeros.length) + '-' +
           letras.charAt(Math.floor(Math.random() * letras.length)) +
           numeros.charAt(Math.floor(Math.random() * numeros.length)) +
           letras.charAt(Math.floor(Math.random() * letras.length));
}

// Evento para generar ID
document.getElementById('generate-id').addEventListener('click', function() {
    const id = generarID();
    document.getElementById('id-display').textContent = id;
    document.getElementById('solicitud-id').value = id;
    document.getElementById('id-container').style.display = 'block';
    document.getElementById('submit-btn').disabled = false;
});

// Validación en tiempo real
document.querySelectorAll('input, textarea').forEach(field => {
    field.addEventListener('input', function() {
        const errorId = this.id + '-error';
        validateField(this, errorId);
    });
});

// Evento para enviar formulario
document.getElementById('date-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Validar todos los campos
    const isValidName = validateField(document.getElementById('client-name'), 'name-error');
    const isValidEmail = validateField(document.getElementById('client-email'), 'email-error');
    const isValidDate = validateField(document.getElementById('service-date'), 'date-error');
    const isValidMessage = validateField(document.getElementById('client-message'), 'message-error');
    
    if (!isValidName || !isValidEmail || !isValidDate || !isValidMessage) {
        return;
    }
    
    if (!document.getElementById('solicitud-id').value) {
        alert('Por favor genera un ID primero');
        return;
    }
    
    const formData = {
        name: document.getElementById('client-name').value,
        email: document.getElementById('client-email').value,
        date: document.getElementById('service-date').value,
        message: document.getElementById('client-message').value,
        solicitud_id: document.getElementById('solicitud-id').value,
        timestamp: new Date().toLocaleString('es-ES')
    };
    
    // Enviar usando EmailJS
    emailjs.send('service_puvhyly', 'template_hskgq77', formData)
        .then(function() {
            alert(`✅ Solicitud enviada\nID: ${formData.solicitud_id}`);
            document.getElementById('date-form').reset();
            document.getElementById('id-container').style.display = 'none';
            document.getElementById('submit-btn').disabled = true;
        }, function(error) {
            console.error('Error:', error);
            alert('❌ Error al enviar. Por favor inténtalo de nuevo.');
        });
});