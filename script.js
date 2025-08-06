// Inicialización de EmailJS
emailjs.init('2II2_vIhRBz00PePy');

// Función para generar ID profesional
function generarID() {
    const letras = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    const numeros = '23456789';
    const fecha = new Date();
    
    return 'SOL-' + 
           numeros.charAt(fecha.getDate() % numeros.length) +
           numeros.charAt((fecha.getMonth() + 1) % numeros.length) + '-' +
           letras.charAt(Math.floor(Math.random() * letras.length)) +
           numeros.charAt(Math.floor(Math.random() * letras.length)) +
           letras.charAt(Math.floor(Math.random() * letras.length));
}

// Generar ID al hacer clic en el botón
document.getElementById('generate-id').addEventListener('click', function() {
    const id = generarID();
    document.getElementById('id-display').textContent = id;
    document.getElementById('solicitud-id').value = id;
    document.getElementById('id-container').style.display = 'block';
    document.getElementById('submit-btn').disabled = false;
    
    // Efecto visual
    this.innerHTML = '<i class="fas fa-check"></i> ID Generado';
    this.style.backgroundColor = '#4cc9f0';
    setTimeout(() => {
        this.innerHTML = '<i class="fas fa-id-card"></i> Generar ID de Solicitud';
        this.style.backgroundColor = '';
    }, 2000);
});

// Copiar ID al portapapeles
document.getElementById('copy-id').addEventListener('click', function() {
    const id = document.getElementById('id-display').textContent;
    navigator.clipboard.writeText(id).then(() => {
        this.innerHTML = '<i class="fas fa-check"></i> Copiado';
        setTimeout(() => {
            this.innerHTML = '<i class="far fa-copy"></i> Copiar';
        }, 2000);
    });
});

// Validación de campos
function validateField(field, errorId) {
    const value = field.value.trim();
    const errorElement = document.getElementById(errorId);
    
    if (!value) {
        field.style.borderColor = 'var(--error)';
        errorElement.style.display = 'flex';
        return false;
    }
    
    if (field.type === 'email' && !/^\S+@\S+\.\S+$/.test(value)) {
        field.style.borderColor = 'var(--error)';
        errorElement.style.display = 'flex';
        return false;
    }
    
    field.style.borderColor = '';
    errorElement.style.display = 'none';
    return true;
}

// Validación especial para teléfono
function validatePhone() {
    const phone = document.getElementById('phone-number').value;
    const errorElement = document.getElementById('phone-error');
    const phoneRegex = /^[\d\s\-()]{7,20}$/;
    
    if (!phoneRegex.test(phone)) {
        document.getElementById('phone-number').style.borderColor = 'var(--error)';
        errorElement.style.display = 'flex';
        return false;
    }
    
    document.getElementById('phone-number').style.borderColor = '';
    errorElement.style.display = 'none';
    return true;
}

// Validación en tiempo real
document.querySelectorAll('input, textarea').forEach(field => {
    field.addEventListener('input', function() {
        const errorId = this.id + '-error';
        if (this.id === 'phone-number') {
            validatePhone();
        } else {
            validateField(this, errorId);
        }
    });
});

// Envío del formulario
document.getElementById('service-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Validar todos los campos
    const isValidName = validateField(document.getElementById('client-name'), 'name-error');
    const isValidEmail = validateField(document.getElementById('client-email'), 'email-error');
    const isValidPhone = validatePhone();
    const isValidDate = validateField(document.getElementById('service-date'), 'date-error');
    const isValidMessage = validateField(document.getElementById('client-message'), 'message-error');
    
    if (!isValidName || !isValidEmail || !isValidPhone || !isValidDate || !isValidMessage) {
        return;
    }
    
    if (!document.getElementById('solicitud-id').value) {
        alert('Por favor genera un ID primero');
        return;
    }
    
    // Obtener código de país y armar número completo
    const countryCode = document.getElementById('country-code').value;
    const phoneNumber = document.getElementById('phone-number').value;
    const fullPhone = countryCode === 'other' ? phoneNumber : `${countryCode} ${phoneNumber}`;
    
    // Preparar datos para enviar
    const formData = {
        name: document.getElementById('client-name').value,
        email: document.getElementById('client-email').value,
        phone: fullPhone,
        date: document.getElementById('service-date').value,
        message: document.getElementById('client-message').value,
        solicitud_id: document.getElementById('solicitud-id').value,
        timestamp: new Date().toLocaleString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    };
    
    // Efecto de carga
    const submitBtn = document.getElementById('submit-btn');
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    submitBtn.disabled = true;
    
    // Enviar mediante EmailJS
    emailjs.send('service_puvhyly', 'template_hskgq77', formData)
        .then(() => {
            // Efecto de éxito
            submitBtn.innerHTML = '<i class="fas fa-check"></i> ¡Enviado!';
            submitBtn.style.backgroundColor = '#4cc9f0';
            
            // Mostrar confirmación
            const id = formData.solicitud_id;
            alert(`✅ Solicitud enviada con éxito\n\nTu ID de seguimiento:\n${id}`);
            
            // Resetear formulario después de 2 segundos
            setTimeout(() => {
                document.getElementById('service-form').reset();
                document.getElementById('id-container').style.display = 'none';
                submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar Solicitud';
                submitBtn.style.backgroundColor = '';
                submitBtn.disabled = true;
            }, 2000);
        }, (error) => {
            console.error('Error:', error);
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar Solicitud';
            submitBtn.disabled = false;
            alert('❌ Error al enviar. Por favor inténtalo de nuevo.');
        });
});
