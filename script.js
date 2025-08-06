document.getElementById('serviceForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const submitBtn = e.target.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Enviando...';

  try {
    // 1. Enviar a Netlify
    const formData = new FormData(e.target);
    await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(formData),
    });

    // 2. Enviar correo via EmailJS (solo si está configurado)
    if (typeof emailjs !== 'undefined') {
      await emailjs.send(
        'service_puvhyly', 
        'template_hskgq77', 
        {
          nombre: formData.get('nombre'),
          email: formData.get('email'),
          telefono: formData.get('telefono'),
          detalles: formData.get('detalles'),
        }
      );
    }

    // Redirigir a página de éxito o mostrar mensaje
    alert('¡Formulario enviado con éxito!');
    window.location.href = "/gracias.html"; // Opcional

  } catch (error) {
    console.error('Error:', error);
    alert(`Error al enviar: ${error.message || 'Por favor intenta nuevamente'}`);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Enviar Solicitud';
  }
});
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
