function gestionarUbicacion(tipo) {
    const divMexico = document.getElementById('seccion-mexico');
    const divExtranjero = document.getElementById('seccion-extranjero');

    if (tipo === 'mexico') {
        divMexico.style.display = 'block';
        divExtranjero.style.display = 'none';
        // Limpiamos el campo de extranjero por si habían escrito algo
        document.getElementsByName('direccion_extranjero')[0].value = '';
    } else {
        divMexico.style.display = 'none';
        divExtranjero.style.display = 'block';
        // Reiniciamos el select de México
        document.getElementsByName('estado_mexico')[0].value = '';
    }
}

function mostrarResumen() {
    const form = document.getElementById('registroForm');
    const formData = new FormData(form);
    
    // 1. Verificar Nombre e Instructor
    if (!formData.get('nombre').trim() || !formData.get('instructor').trim()) {
        alert("Por favor, ingresa tu nombre completo y el de tu instructor.");
        return;
    }

    // 2. Verificar Ubicación (Lógica Condicional)
    const esExtranjero = formData.get('extranjero');
    
    if (esExtranjero === 'no') {
        // Si es mexicano, verificamos que haya seleccionado un estado
        if (!formData.get('estado_mexico')) {
            alert("Por favor, selecciona tu Estado de la República.");
            return;
        }
    } else {
        // Si es extranjero, verificamos que haya escrito su dirección
        if (!formData.get('direccion_extranjero').trim()) {
            alert("Como extranjero, por favor ingresa tu dirección (País y Ciudad).");
            return;
        }
    }

    // 3. Verificar Talla de Playera (Asegurarnos que hay una seleccionada)
    if (!formData.get('talla')) {
        alert("Por favor, selecciona tu talla de playera.");
        return;
    }

    // 4. Verificar que se haya seleccionado un Estatus de Pago
if (!formData.get('pago')) {
    alert("Por favor, selecciona el estatus actual de tu pago.");
    return; // Detiene el proceso si no hay selección
}

    // 5. Verificar el Aviso de Privacidad
    const checkboxPrivacidad = document.getElementById('acepto-privacidad');
    if (!checkboxPrivacidad.checked) {
        alert("Es obligatorio aceptar el Aviso de Privacidad para continuar.");
        return;
    }

    // --- SI PASA TODAS LAS PRUEBAS, GENERAMOS EL RESUMEN ---
    
    // Determinamos qué ubicación mostrar en el resumen
    let ubicacionFinal = (esExtranjero === 'si') 
        ? formData.get('direccion_extranjero') 
        : formData.get('estado_mexico');

    let html = `
        <p><b>Nombre:</b> ${formData.get('nombre')}</p>
        <p><b>Instructor:</b> ${formData.get('instructor')}</p>
        <p><b>Ubicación:</b> ${ubicacionFinal}</p>
        <p><b>Talla:</b> ${formData.get('talla')}</p>
        <p><b>Estatus Pago:</b> ${formData.get('pago')}</p>
    `;

    document.getElementById('info-content').innerHTML = html;
    document.getElementById('paso-datos').style.display = 'none';
    document.getElementById('seccion-resumen').style.display = 'block';
    window.scrollTo(0, 0);
}

function editarDatos() {
    document.getElementById('paso-datos').style.display = 'block';
    document.getElementById('seccion-resumen').style.display = 'none';
}

function togglePrivacy() {
    const modal = document.getElementById('privacyModal');
    modal.style.display = (modal.style.display === 'flex') ? 'none' : 'flex';
}

// --- SI PASA TODAS LAS VALIDACIONES, MOSTRAR LA PÁGINA DE ÉXITO ---

function confirmarAsistenciaFinal() {
    // En lugar de ocultar divs, redireccionamos
    window.location.href = "confirmacion.html";
}