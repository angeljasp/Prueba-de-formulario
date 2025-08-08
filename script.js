// Script integrado
document.addEventListener('DOMContentLoaded', function() {
    // Configurar año actual en el footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // Mobile Menu
    const menuToggle = document.querySelector('.menu-toggle');
    const navigation = document.querySelector('.navigation');
    
    menuToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        navigation.classList.toggle('active');
        
        if (navigation.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });
    
    // Close menu when clicking on links
    document.querySelectorAll('.navigation a').forEach(link => {
        link.addEventListener('click', function() {
            menuToggle.classList.remove('active');
            navigation.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            if (this.getAttribute('href') === '#') {
                e.preventDefault();
                return;
            }
            
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Header scroll effect
    const header = document.querySelector('.header');
    
    function updateHeader() {
        if (window.scrollY > 100) {
            header.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.boxShadow = 'none';
        }
    }
    
    updateHeader();
    window.addEventListener('scroll', updateHeader);
    
    // Inicializar EmailJS
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
                    callback('us');
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
        
        const nombres = document.getElementById('corporate-names').value.trim();
        const apellidos = document.getElementById('corporate-lastnames').value.trim();
        
        if (nombres.split(' ').length < 2 || apellidos.split(' ').length < 2) {
            alert('Por favor ingrese al menos 2 nombres y 2 apellidos completos');
            return;
        }
        
        submitBtn.classList.add('loading');
        
        const trackingId = generateTrackingId();
        
        try {
            const formData = new FormData(form);
            formData.append('tracking_id', trackingId);
            formData.append('telefono_completo', phoneInput.getNumber());
            
            await fetch('/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(formData),
            });
            
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
                    año_actual: new Date().getFullYear(),
                    fecha_actual: new Date().toLocaleDateString('es-ES', { 
                        day: '2-digit', 
                        month: '2-digit', 
                        year: 'numeric' 
                    })
                }
            );
            
            showConfirmation(trackingId);
            form.reset();
            
        } catch (error) {
            console.error('Error:', error);
            alert('Ocurrió un error al enviar el formulario. Por favor intente nuevamente.');
        } finally {
            submitBtn.classList.remove('loading');
        }
    });
    
    // Configurar botón copiar ID
    document.getElementById('corporateCopyBtn').addEventListener('click', copyTrackingId);
    
    // Animation on scroll
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.card, .company-card');
        const windowHeight = window.innerHeight;
        const triggerOffset = 100;
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            
            if (elementPosition < windowHeight - triggerOffset) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };
    
    // Initialize animation states
    const animatedElements = document.querySelectorAll('.card, .company-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    setTimeout(animateOnScroll, 300);
    window.addEventListener('scroll', animateOnScroll);
    window.addEventListener('load', function() {
        setTimeout(animateOnScroll, 300);
    });
});

// Funciones auxiliares
function generateTrackingId() {
    const datePart = new Date().getTime().toString(36).toUpperCase();
    const randomPart = Math.floor(Math.random() * 900) + 100;
    return `JASPI-${datePart}-${randomPart}`;
}

function showConfirmation(trackingId) {
    const confirmationPanel = document.getElementById('corporateConfirmation');
    const trackingElement = document.getElementById('corporateTrackingId');
    
    trackingElement.textContent = trackingId;
    confirmationPanel.classList.remove('hidden');
    confirmationPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

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
