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

    // Catálogo base
    const catalogoHTML = (nombreInput) => `
        <select name="${nombreInput}" required>
            <option value="">-- Selecciona un nombre --</option>
            <option value="1">Maestro Li</option>
            <option value="2">Maestro Zhang</option>
            <option value="3">Maestro Rodrigo</option>
            <option value="4">Maestra Elena</option>
            <option value="0">Otro / No aparezco</option>
        </select>`;

    if (tipo === 'instructor_escuela') {
        // EXCEPCIÓN: El instructor elige su nombre de la lista
        divNombre.innerHTML = catalogoHTML('id_nombre_instructor'); 
        divMaestro.innerHTML = `<p style="color: #666; font-size: 0.9rem;">Registro como Instructor Titular.</p>`;
        labelUbicacion.innerText = "Estado de procedencia";
        divUbicacion.innerHTML = `<select name="estado_mexico" required>${obtenerListaEstados()}</select>`;

    } else if (tipo === 'alumno_escuela') {
        // Alumno: Nombre manual, Maestro por catálogo
        divNombre.innerHTML = `<input type="text" name="nombre_completo" placeholder="Tu nombre completo" required>`;
        divMaestro.innerHTML = catalogoHTML('id_instructor_interno');
        labelUbicacion.innerText = "Estado de procedencia";
        divUbicacion.innerHTML = `<select name="estado_mexico" required>${obtenerListaEstados()}</select>`;

    } else {
        // Externos e Invitados
        divNombre.innerHTML = `<input type="text" name="nombre_completo" placeholder="Tu nombre completo" required>`;
        divMaestro.innerHTML = `<input type="text" name="nombre_maestro_externo" placeholder="Nombre de tu instructor">`;
        labelUbicacion.innerText = "Dirección (Ciudad, País)";
        divUbicacion.innerHTML = `<textarea name="direccion_extranjero" rows="2" placeholder="Ej: Bogotá, Colombia" required></textarea>`;
    }
}
// Función para no repetir los 32 estados
function obtenerListaEstados() {
    return `
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
        <option value="Estado de México" selected>Estado de México</option>
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
        <option value="Zacatecas">Zacatecas</option>`;
}
/**
 * FUNCIÓN DE RESUMEN
 * Captura los datos dinámicos para que el usuario los revise antes de enviar.
 */

function mostrarResumen() {
    const form = document.getElementById('registroForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const tipoUsuario = document.getElementById('tipo-usuario').value;
    const tipoTexto = document.getElementById('tipo-usuario').options[document.getElementById('tipo-usuario').selectedIndex].text;

    let nombreFinal = "";
    let instructorFinal = "Titular / Instructor";

    // LÓGICA DE CAPTURA SEGÚN TIPO
    if (tipoUsuario === 'instructor_escuela') {
        const selNom = document.querySelector('select[name="id_nombre_instructor"]');
        nombreFinal = selNom ? selNom.options[selNom.selectedIndex].text : "No seleccionado";
    } else {
        const inpNom = document.querySelector('input[name="nombre_completo"]');
        nombreFinal = inpNom ? inpNom.value : "No escrito";
        
        if (tipoUsuario === 'alumno_escuela') {
            const selMaestro = document.querySelector('select[name="id_instructor_interno"]');
            instructorFinal = (selMaestro && selMaestro.selectedIndex > 0) ? selMaestro.options[selMaestro.selectedIndex].text : "No seleccionado";
        } else {
            const inpMaestro = document.querySelector('input[name="nombre_maestro_externo"]');
            instructorFinal = inpMaestro ? inpMaestro.value : "Externo / Invitado";
        }
    }

    const tallaRadio = document.querySelector('input[name="talla"]:checked');
    const talla = tallaRadio ? tallaRadio.value : "M";
    const pago = document.getElementsByName('pago')[0].value;

    document.getElementById('info-content').innerHTML = `
        <div style="text-align: left; line-height: 1.6;">
            <p><strong>Categoría:</strong> ${tipoTexto}</p>
            <p><strong>Nombre:</strong> ${nombreFinal}</p>
            <p><strong>Instructor:</strong> <span style="color: #a31d1d; font-weight: bold;">${instructorFinal}</span></p>
            <p><strong>Talla:</strong> ${talla}</p>
            <p><strong>Pago:</strong> ${pago}</p>
        </div>
    `;

    document.getElementById('paso-datos').style.display = 'none';
    document.getElementById('seccion-resumen').style.display = 'block';
    window.scrollTo(0, 0);
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
