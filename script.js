// GESTIÓN DE FLUJO DINÁMICO - EMW 2026
// Configuración de conexión con Supabase
const supabaseUrl = 'https://zvtwlgfzfoouxbhnpwwr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2dHdsZ2Z6Zm9vdXhiaG5wd3dyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUxOTM1MDksImV4cCI6MjA5MDc2OTUwOX0._AbrD6Pv0iR1EfHboRAi1mla-V78lfKyb-knuMYszt8';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);
/**
 * Este script controla qué campos ve el usuario según su rol.
 */
// 2. GESTIÓN DEL FLUJO (Hace que aparezcan las preguntas)
function gestionarFlujo() {
    const tipo = document.getElementById('tipo-usuario').value;
    const camposIdentidad = document.getElementById('campos-identidad');
    const camposComunes = document.getElementById('campos-comunes');
    const grupoUbicacion = document.getElementById('grupo-ubicacion');
    const contenedorMaestro = document.getElementById('contenedor-maestro');
    
    const inputNombre = document.getElementById('input-dinamico-nombre');
    const inputMaestro = document.getElementById('input-dinamico-maestro');
    const inputUbicacion = document.getElementById('input-dinamico-ubicacion');

    if (tipo === "") {
        camposIdentidad.style.display = 'none';
        camposComunes.style.display = 'none';
        return;
    }

    camposIdentidad.style.display = 'block';
    camposComunes.style.display = 'block';
    grupoUbicacion.style.display = 'block';

    if (tipo === 'alumno_escuela' || tipo === 'instructor_escuela') {
        inputNombre.innerHTML = `<input type="text" name="nombre_completo" placeholder="Tu nombre oficial" required>`;
        if (tipo === 'alumno_escuela') {
            contenedorMaestro.style.display = 'block';
            inputMaestro.innerHTML = `
                <select name="id_instructor_interno" required>
                    <option value="1">Jesus</option>
                    <option value="2">Marlene</option>
                    <option value="3">Rodrigo</option>
                    <option value="4">Elena</option>
                </select>`;
        } else {
            contenedorMaestro.style.display = 'none';
        }
        inputUbicacion.innerHTML = `<input type="text" name="estado_mexico" value="Estado de México" readonly>`;
    } else {
        inputNombre.innerHTML = `<input type="text" name="nombre_completo" placeholder="Nombre completo" required>`;
        contenedorMaestro.style.display = 'block';
        inputMaestro.innerHTML = `<input type="text" name="nombre_maestro_externo" placeholder="Nombre de tu Maestro/Escuela" required>`;
        inputUbicacion.innerHTML = `<input type="text" name="direccion_extranjero" placeholder="Ciudad / País" required>`;
    }
}

// 3. SISTEMA DE RESUMEN
function mostrarResumen() {
    // Validar que el checkbox de privacidad esté marcado
    if (!document.getElementById('acepto-privacidad').checked) {
        alert("Debes aceptar el aviso de privacidad.");
        return;
    }

    const nombre = document.getElementsByName('nombre_completo')[0].value;
    const talla = document.querySelector('input[name="talla"]:checked').value;
    const pago = document.getElementsByName('pago')[0].value;

    if (!nombre) {
        alert("Por favor, ingresa tu nombre.");
        return;
    }

    let resumenHTML = `
        <p><strong>Participante:</strong> ${nombre}</p>
        <p><strong>Talla de playera:</strong> ${talla}</p>
        <p><strong>Estatus de pago:</strong> ${pago}</p>
        <hr>
        <p style="font-size: 0.9em; color: #666;">Al confirmar, tus datos se enviarán a la base de datos oficial de EMW.</p>
    `;

    document.getElementById('info-content').innerHTML = resumenHTML;
    document.getElementById('paso-datos').style.display = 'none';
    document.getElementById('seccion-resumen').style.display = 'block';
}

function editarDatos() {
    document.getElementById('paso-datos').style.display = 'block';
    document.getElementById('seccion-resumen').style.display = 'none';
}

// 4. ENVÍO FINAL A SUPABASE
async function confirmarAsistenciaFinal() {
    const form = document.getElementById('registroForm');
    
    // 1. Identificar el tipo de usuario para saber a qué columna enviarlo
    const tipoUsuario = document.getElementById('tipo-usuario').value;
    
    // 2. Preparar el objeto de datos siguiendo tu nueva estructura de 6 tablas
    let datosRegistro = {
        id_evento: 1, // Corresponde al evento 'Encuentro Gran Maestro 2026'
        id_talla: obtenerIdTalla(document.querySelector('input[name="talla"]:checked').value),
        estatus_pago: document.getElementsByName('pago')[0].value
    };

    // 3. Lógica para asignar IDs según el rol
    if (tipoUsuario === 'alumno_escuela') {
        // Aquí deberías tener un sistema para identificar el ID del alumno
        // Por ahora, si es nuevo, podrías manejar una lógica de inserción previa o simplificada
        datosRegistro.id_alumno_emw = null; // Ajustar según tu lógica de selección de alumnos
    } else if (tipoUsuario === 'instructor_escuela') {
        datosRegistro.id_instructor_emw = document.getElementsByName('id_instructor_interno')[0].value;
    } else {
        // Si es externo, primero debemos registrarlo en la tabla personas_externas
        const { data: nuevoExterno } = await supabase
            .from('personas_externas')
            .insert([{
                nombre_completo: document.getElementsByName('nombre_completo')[0].value,
                procedencia: document.getElementsByName('estado_mexico')[0]?.value || document.getElementsByName('direccion_extranjero')[0]?.value,
                rol: tipoUsuario === 'externo_maestro' ? 'Maestro Ext' : 'Alumno Ext'
            }]).select();
        
        datosRegistro.id_externo = nuevoExterno[0].id_externo;
    }

    // 4. Inserción final en inscripciones_final
    const { data, error } = await supabase
        .from('inscripciones_final')
        .insert([datosRegistro])
        .select();

    if (error) {
        alert("Error al registrar: " + error.message);
    } else {
        // GUARDAR EL ID PARA EL TICKET
        const folio = data[0].id_inscripcion;
        sessionStorage.setItem('folio_real', folio);
        
        // Redirigir a tu página con marca personal
        window.location.href = "confirmacion.html";
    }
}

// Función auxiliar para convertir CH, M, G a IDs (1, 2, 3...)
function obtenerIdTalla(abreviatura) {
    const mapa = { 'CH': 1, 'M': 2, 'G': 3, 'XG': 4 };
    return mapa[abreviatura];
}
function togglePrivacy() {
    const modal = document.getElementById('privacyModal');
    modal.style.display = (modal.style.display === 'block') ? 'none' : 'block';
}
