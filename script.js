// GESTIÓN DE FLUJO DINÁMICO - EMW 2026
const supabaseUrl = 'https://zvtwlgfzfoouxbhnpwwr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2dHdsZ2Z6Zm9vdXhiaG5wd3dyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUxOTM1MDksImV4cCI6MjA5MDc2OTUwOX0._AbrD6Pv0iR1EfHboRAi1mla-V78lfKyb-knuMYszt8';
const supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);

// 1. CARGAR INSTRUCTORES DINÁMICAMENTE
async function cargarInstructores() {
    const { data: instructores, error } = await supabaseClient
        .from('instructores_emw')
        .select('id_instructor, nombre_oficial, estado')
        .order('nombre_oficial', { ascending: true });

    if (error) {
        console.error("Error cargando instructores:", error);
        return "";
    }

    let opciones = '<option value="">-- Selecciona una opción --</option>';
    instructores.forEach(ins => {
        opciones += `<option value="${ins.id_instructor}" data-estado="${ins.estado}">${ins.nombre_oficial}</option>`;
    });
    return opciones;
}

// 2. GESTIÓN DEL FLUJO DINÁMICO
async function gestionarFlujo() {
    const tipo = document.getElementById('tipo-usuario').value;
    const divIdentidad = document.getElementById('campos-identidad');
    const camposComunes = document.getElementById('campos-comunes');
    const grupoUbicacion = document.getElementById('grupo-ubicacion');
    const contenedorMaestro = document.getElementById('contenedor-maestro');
    
    const inputNombre = document.getElementById('input-dinamico-nombre');
    const inputMaestro = document.getElementById('input-dinamico-maestro');
    const inputUbicacion = document.getElementById('input-dinamico-ubicacion');
    const labelNombre = document.getElementById('label-nombre');

    const listaEstados = `
        <select name="estado_mexico" required>
            <option value="">-- Selecciona tu Estado --</option>
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

    if (tipo === "") {
        divIdentidad.style.display = 'none';
        camposComunes.style.display = 'none';
        return;
    }

    divIdentidad.style.display = 'block';
    camposComunes.style.display = 'block';

    let opcionesDocentes = "";
    if (tipo === 'instructor_escuela' || tipo === 'alumno_escuela') {
        opcionesDocentes = await cargarInstructores();
    }

    if (tipo === 'instructor_escuela') {
        labelNombre.innerText = "Selecciona tu Nombre";
        inputNombre.innerHTML = `<select name="id_instructor_emw" id="nombre_registro" required>${opcionesDocentes}</select>`;
        contenedorMaestro.style.display = 'none';
        grupoUbicacion.style.display = 'none'; 
        inputUbicacion.innerHTML = `<input type="hidden" name="estado_mexico" value="Estado de México">`;

    } else if (tipo === 'alumno_escuela') {
        labelNombre.innerText = "Tu Nombre Completo";
        inputNombre.innerHTML = `<input type="text" name="nombre_completo" id="nombre_registro" placeholder="Nombre completo" required>`;
        contenedorMaestro.style.display = 'block';
        inputMaestro.innerHTML = `<select name="id_instructor_interno" id="maestro_seleccionado" required>${opcionesDocentes}</select>`;
        grupoUbicacion.style.display = 'block'; 
        inputUbicacion.innerHTML = listaEstados;

    } else if (tipo === 'instructor_extranjero') {
        labelNombre.innerText = "Nombre Completo";
        inputNombre.innerHTML = `<input type="text" name="nombre_completo" id="nombre_registro" placeholder="Nombre completo" required>`;
        contenedorMaestro.style.display = 'none'; 
        grupoUbicacion.style.display = 'block';
        inputUbicacion.innerHTML = `<input type="text" name="direccion_extranjero" placeholder="Estado o Ciudad, País" required>`;

    } else {
        labelNombre.innerText = "Nombre Completo";
        inputNombre.innerHTML = `<input type="text" name="nombre_completo" id="nombre_registro" placeholder="Nombre completo" required>`;
        contenedorMaestro.style.display = 'block';
        inputMaestro.innerHTML = `<input type="text" name="nombre_maestro_externo" placeholder="Nombre de tu Instructor" required>`;
        grupoUbicacion.style.display = 'block';
        inputUbicacion.innerHTML = `<input type="text" name="direccion_extranjero" placeholder="Estado o Ciudad, País" required>`;
    }
}

// 3. SISTEMA DE RESUMEN
function mostrarResumen() {
    if (!document.getElementById('acepto-privacidad').checked) {
        alert("Debes aceptar el aviso de privacidad.");
        return;
    }

    const tipo = document.getElementById('tipo-usuario').value;
    const talla = document.querySelector('input[name="talla"]:checked').value;
    const pago = document.getElementsByName('pago')[0].value;

    let nombreMostrado = "";
    let ubicacionFinal = "";
    let instructorTxt = "";

    // Lógica para capturar UBICACIÓN
    ubicacionFinal = document.getElementsByName('estado_mexico')[0]?.value || 
                     document.getElementsByName('direccion_extranjero')[0]?.value || 
                     "No especificada";
    
    if (tipo === 'instructor_escuela') {
        const sel = document.getElementById('nombre_registro');
        nombreMostrado = sel.options[sel.selectedIndex].text;
        instructorTxt = "Registro de Instructor";
        // En instructores locales, si no eligieron estado, usamos el de la DB
        if (!document.getElementsByName('estado_mexico')[0]?.value) {
            ubicacionFinal = sel.options[sel.selectedIndex].getAttribute('data-estado') || "Estado de México";
        }
    } else {
        nombreMostrado = document.getElementById('nombre_registro').value;
        if (tipo === 'alumno_escuela') {
            const selM = document.getElementById('maestro_seleccionado');
            instructorTxt = selM.options[selM.selectedIndex].text;
        } else {
            instructorTxt = document.getElementsByName('nombre_maestro_externo')[0]?.value || "N/A";
        }
    }

    if (!nombreMostrado || nombreMostrado.includes("-- Selecciona")) {
        alert("Por favor, completa tu nombre.");
        return;
    }

    let resumenHTML = `
        <p><strong>Nombre: \n </strong> ${nombreMostrado}</p>
        <p><strong>Instructor: \n </strong> ${instructorTxt}</p>
        <p><strong>Ubicación: \n </strong> ${ubicacionFinal}</p>
        <p><strong>Talla de playera: \n b</strong> ${talla}</p>
        <p><strong>Estatus de pago: \n </strong> ${pago}</p>
        <hr>
        <p style="font-size: 0.9em; color: #666; font-style: italic;">
            "Confirma que tus datos sean correctos para finalizar tu registro."
        </p>
    `;

    document.getElementById('info-content').innerHTML = resumenHTML;
    document.getElementById('paso-datos').style.display = 'none';
    document.getElementById('seccion-resumen').style.display = 'block';
}

function editarDatos() {
    document.getElementById('paso-datos').style.display = 'block';
    document.getElementById('seccion-resumen').style.display = 'none';
}

// 4. ENVÍO FINAL MEJORADO
async function confirmarAsistenciaFinal() {
    const tipoUsuario = document.getElementById('tipo-usuario').value;
    
    // Captura segura de ubicación (Procedencia)
    // Buscamos el valor en cualquiera de los dos posibles inputs
    const inputEdomex = document.getElementsByName('estado_mexico')[0];
    const inputExtranjero = document.getElementsByName('direccion_extranjero')[0];
    
    const procedenciaFinal = (inputEdomex && inputEdomex.value) ? inputEdomex.value : 
                             (inputExtranjero && inputExtranjero.value) ? inputExtranjero.value : 
                             "Estado de México";

    let datosRegistro = {
        id_evento: 1,
        id_talla: obtenerIdTalla(document.querySelector('input[name="talla"]:checked').value),
        estatus_pago: document.getElementsByName('pago')[0].value
    };

    try {
        if (tipoUsuario === 'instructor_escuela') {
            datosRegistro.id_instructor_emw = document.getElementById('nombre_registro').value;
            // Opcional: Podrías actualizar la procedencia del instructor aquí si fuera necesario
            
        } else if (tipoUsuario === 'alumno_escuela') {
            const nombreAlumno = document.getElementById('nombre_registro').value;
            const comboMaestro = document.getElementById('maestro_seleccionado');

            const { data: nuevoAl, error: errAl } = await supabaseClient
                .from('alumnos_emw')
                .insert([{
                    nombre_completo: nombreAlumno,
                    id_instructor_pertenece: parseInt(comboMaestro.value),
                    procedencia: procedenciaFinal // <--- Ahora toma la ubicación real elegida
                }])
                .select();

            if (errAl) throw errAl;
            datosRegistro.id_alumno_emw = nuevoAl[0].id_alumno_emw;

        } else {
            // Caso para Externos e Invitados
            const { data: nuevoExt, error: errExt } = await supabaseClient
                .from('personas_externas')
                .insert([{
                    nombre_completo: document.getElementById('nombre_registro').value,
                    procedencia: procedenciaFinal,
                    rol: tipoUsuario === 'instructor_extranjero' ? 'Maestro Ext' : 
                         tipoUsuario === 'alumno_extranjero' ? 'Alumno Ext' : 'Invitado'
                }])
                .select();
            
            if (errExt) throw errExt;
            datosRegistro.id_externo = nuevoExt[0].id_externo;
        }

        // Registro en la tabla final de inscripciones
        const { data, error } = await supabaseClient.from('inscripciones_final').insert([datosRegistro]).select();
        if (error) throw error;

        sessionStorage.setItem('folio_real', data[0].id_inscripcion);
        window.location.href = "confirmacion.html";
    } catch (err) {
        console.error("Detalle del error:", err);
        alert("Error al registrar: " + (err.message || "Verifica tu conexión"));
    }
}

function obtenerIdTalla(ab) {
    const m = { 'CH': 1, 'M': 2, 'G': 3, 'XG': 4 };
    return m[ab];
}

function togglePrivacy() {
    const modal = document.getElementById('privacyModal');
    modal.style.display = (modal.style.display === 'block') ? 'none' : 'block';
}
