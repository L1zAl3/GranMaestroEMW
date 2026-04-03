/**
 * GESTIÓN DE FLUJO DINÁMICO - EMW 2026
 * Este script controla qué campos ve el usuario según su rol.
 */

function gestionarFlujo() {
    const tipo = document.getElementById('tipo-usuario').value;
    
    // Referencias a contenedores
    const camposIdentidad = document.getElementById('campos-identidad');
    const contenedorMaestro = document.getElementById('contenedor-maestro');
    const grupoUbicacion = document.getElementById('grupo-ubicacion');
    const camposComunes = document.getElementById('campos-comunes');

    // Si no hay selección, ocultamos todo y salimos
    if (!tipo) {
        ocultarSecciones([camposIdentidad, grupoUbicacion, camposComunes]);
        return;
    }

    // 1. Mostramos las secciones base
    camposIdentidad.style.display = 'block';
    grupoUbicacion.style.display = 'block';
    camposComunes.style.display = 'block';

    // 2. Lógica del Instructor: Solo se pide si el usuario es ALUMNO (interno o externo)
    if (tipo === 'alumno_escuela' || tipo === 'alumno_extranjero') {
        contenedorMaestro.style.display = 'block';
    } else {
        contenedorMaestro.style.display = 'none';
    }

    // 3. Inyectar los inputs correctos (Select para internos, Input para externos)
    actualizarCamposDinamicos(tipo);
}

function actualizarCamposDinamicos(tipo) {
    const divNombre = document.getElementById('input-dinamico-nombre');
    const divMaestro = document.getElementById('input-dinamico-maestro');
    const divUbicacion = document.getElementById('input-dinamico-ubicacion');
    const labelUbicacion = document.getElementById('label-ubicacion');

    // 1. EL NOMBRE SIEMPRE ES MANUAL (Para todos)
    divNombre.innerHTML = `<input type="text" name="nombre_completo" placeholder="Escribe tu nombre completo" required>`;

    // 2. EL INSTRUCTOR SIEMPRE ES SELECT (Para evitar duplicidad)
    // Definimos el HTML del selector una sola vez para no repetir código
    const selectorMaestroHTML = `
        <select name="id_instructor_interno" required>
            <option value="">-- Selecciona a tu maestro o referente --</option>
            <option value="1">Maestro Li</option>
            <option value="2">Maestro Zhang</option>
            <option value="3">Maestro Rodrigo</option>
            <option value="4">Maestra Elena</option>
            <option value="0">Otro / Instructor Externo</option>
        </select>`;

    // 3. APLICAMOS LÓGICA DE UBICACIÓN SEGÚN EL TIPO
    if (tipo === 'alumno_escuela' || tipo === 'instructor_escuela') {
        // Caso Internos: Usamos el selector de maestros y estados de México
        divMaestro.innerHTML = selectorMaestroHTML;
        
        labelUbicacion.innerText = "Estado de procedencia";
        divUbicacion.innerHTML = `
            <select name="estado_mexico" required>
                <option value="">-- Selecciona un estado --</option>
                <option value="Aguascalientes">Aguascalientes</option>
                <option value="Baja California">Baja California</option>
                <option value="Baja California Sur">Baja California Sur</option>
                <option value="Campeche">Campeche</option>
                <option value="Chiapas">Chiapas</option>
                <option value="Chihuahua">Chihuahua</option>
                <option value="Ciudad de México">Ciudad de México</option>
                <option value="Coahuila">Coahuila</option>
                <option value="Colima">Colima</option>
                <option value="Durango">Durango</option>
                <option value="Estado de México">Estado de México</option>
                <option value="Guanajuato">Guanajuato</option>
                <option value="Guerrero">Guerrero</option>
                <option value="Hidalgo">Hidalgo</option>
                <option value="Jalisco">Jalisco</option>
                <option value="Michoacán">Michoacán</option>
                <option value="Morelos">Morelos</option>
                <option value="Nayarit">Nayarit</option>
                <option value="Nuevo León">Nuevo León</option>
                <option value="Oaxaca">Oaxaca</option>
                <option value="Puebla">Puebla</option>
                <option value="Querétaro">Querétaro</option>
                <option value="Quintana Roo">Quintana Roo</option>
                <option value="San Luis Potosí">San Luis Potosí</option>
                <option value="Sinaloa">Sinaloa</option>
                <option value="Sonora">Sonora</option>
                <option value="Tabasco">Tabasco</option>
                <option value="Tamaulipas">Tamaulipas</option>
                <option value="Tlaxcala">Tlaxcala</option>
                <option value="Veracruz">Veracruz</option>
                <option value="Yucatán">Yucatán</option>
                <option value="Zacatecas">Zacatecas</option>
            </select>`;

    } else {
        // Para Extranjeros o Invitados, el maestro también se escribe manual
        divMaestro.innerHTML = `
            <input type="text" name="nombre_maestro_externo" placeholder="Nombre de tu instructor o institución">`;
        
        labelUbicacion.innerText = "Dirección (Ciudad, País)";
        divUbicacion.innerHTML = `
            <textarea name="direccion_extranjero" rows="2" placeholder="Ej: Bogotá, Colombia" required></textarea>`;
    }
}
/**
 * FUNCIÓN DE RESUMEN
 * Captura los datos dinámicos para que el usuario los revise antes de enviar.
 */

function mostrarResumen() {
    const form = document.getElementById('registroForm');
    
    // Validación básica de HTML5
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const tipo = document.getElementById('tipo-usuario').options[document.getElementById('tipo-usuario').selectedIndex].text;
    const infoContent = document.getElementById('info-content');
    
    // Recolectamos datos de los inputs (sin importar si son Select o Input)
    const nombre = document.getElementsByName('nombre_completo')[0].value;
    
    //Captura del Instructor
    let instructorFinal = "No especificado";
    
    // Buscamos AMBOS campos posibles en todo el formulario
    const selInterno = document.querySelector('select[name="id_instructor_interno"]');
    const inpExterno = document.querySelector('input[name="nombre_maestro_externo"]');

    // Si el SELECT existe y tiene una opción elegida, la tomamos
    if (selInterno && selInterno.selectedIndex > 0) {
        instructorFinal = selInterno.options[selInterno.selectedIndex].text;
    } 
    // Si no, si el INPUT de texto tiene algo escrito, lo tomamos
    else if (inpExterno && inpExterno.value.trim() !== "") {
        instructorFinal = inpExterno.value;
    }

    // 3. Capturar Talla y Pago
    const talla = document.querySelector('input[name="talla"]:checked').value;
    const pago = document.getElementsByName('pago')[0].value;

    infoContent.innerHTML = `
        <p><strong>Categoría:</strong> ${tipo}</p>
        <p><strong>Nombre:</strong> ${nombre}</p>
        <p><strong>Instructor:</strong> <span style="color: #a31d1d; font-weight: bold;">${instructorFinal}</span></p>
        <p><strong>Talla:</strong> ${talla}</p>
        <p><strong>Estatus de Pago:</strong> ${pago}</p>
        <hr>
        <p style="font-size: 0.8rem; color: #888;">Verifica que tus datos sean correctos antes de confirmar.</p>
    `;

    document.getElementById('paso-datos').style.display = 'none';
    document.getElementById('seccion-resumen').style.display = 'block';
}

// Funciones Auxiliares
function ocultarSecciones(arr) { arr.forEach(s => s.style.display = 'none'); }
function editarDatos() {
    document.getElementById('paso-datos').style.display = 'block';
    document.getElementById('seccion-resumen').style.display = 'none';
}
function togglePrivacy() {
    const modal = document.getElementById('privacyModal');
    modal.style.display = (modal.style.display === 'flex') ? 'none' : 'flex';
}
function confirmarAsistenciaFinal() {
    document.getElementById('registroForm').submit();
}
