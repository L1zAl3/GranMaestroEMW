// GESTIÓN DE FLUJO DINÁMICO - EMW 2026
// Configuración de conexión con Supabase
const supabaseUrl = 'https://zvtwlgfzfoouxbhnpwwr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2dHdsZ2Z6Zm9vdXhiaG5wd3dyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUxOTM1MDksImV4cCI6MjA5MDc2OTUwOX0._AbrD6Pv0iR1EfHboRAi1mla-V78lfKyb-knuMYszt8';
const supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);
/**
 * Este script controla qué campos ve el usuario según su rol.
 */
//1. cargar instructores
async function cargarInstructores() {
    const { data: instructores, error } = await supabaseClient
        .from('instructores_emw')
        .select('id_instructor, nombre_oficial')
        .order('nombre_oficial', { ascending: true });

    if (error) {
        console.error("Error cargando instructores:", error);
        return "";
    }

    // Generamos las opciones dinámicamente
    let opciones = '<option value="">-- Selecciona una opción --</option>';
    instructores.forEach(ins => {
        opciones += `<option value="${ins.id_instructor}">${ins.nombre_oficial}</option>`;
    });
    return opciones;
}
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
    const labelNombre = document.getElementById('label-nombre');

    if (tipo === "") {
        camposIdentidad.style.display = 'none';
        camposComunes.style.display = 'none';
        return;
    }

    camposIdentidad.style.display = 'block';
    camposComunes.style.display = 'block';
    grupoUbicacion.style.display = 'block';

    if (tipo === 'instructor_escuela') {
        labelNombre.innerText = "Selecciona tu Nombre";
        // Llamamos a la base de datos
        const opciones = await cargarInstructores();
        inputNombre.innerHTML = `<select name="id_instructor_emw" id="nombre_registro" required>${opciones}</select>`;
        contenedorMaestro.style.display = 'none';
        
    } else if (tipo === 'alumno_escuela') {
        labelNombre.innerText = "Tu Nombre Completo";
        inputNombre.innerHTML = `<input type="text" name="nombre_completo" id="nombre_registro" required>`;
        contenedorMaestro.style.display = 'block';
        // Llamamos a la base de datos aquí también
        const opciones = await cargarInstructores();
        inputMaestro.innerHTML = `<select name="id_instructor_interno" required>${opciones}</select>`;
    }

    } else if (tipo === 'instructor_extranjero') {
        labelNombre.innerText = "Nombre Completo";
        inputNombre.innerHTML = `<input type="text" name="nombre_completo" id="nombre_registro" placeholder="Nombre completo" required>`;
        
        // CONDICIÓN: Ocultar instructor para Instructores Extranjeros
        contenedorMaestro.style.display = 'none'; 
        inputUbicacion.innerHTML = `<input type="text" name="direccion_extranjero" placeholder="Ciudad, País" required>`;

    } else {
        // Para externos y extranjeros (se mantiene igual)
        labelNombre.innerText = "Nombre Completo";
        inputNombre.innerHTML = `<input type="text" name="nombre_completo" id="nombre_registro" placeholder="Nombre completo" required>`;
        contenedorMaestro.style.display = 'block';
        inputMaestro.innerHTML = `<input type="text" name="nombre_maestro_externo" placeholder="Nombre de tu Instructor" required>`;
        inputUbicacion.innerHTML = `<input type="text" name="direccion_extranjero" placeholder="Ciudad, País" required>`;
    }
}
// 3. SISTEMA DE RESUMEN
function mostrarResumen() {
    // 1. Validaciones iniciales
    if (!document.getElementById('acepto-privacidad').checked) {
        alert("Debes aceptar el aviso de privacidad.");
        return;
    }

    // 2. Captura de datos básicos
    const nombre = document.getElementById('nombre_registro').value;
    const tipo = document.getElementById('tipo-usuario').value;
    const talla = document.querySelector('input[name="talla"]:checked').value;
    const pago = document.getElementsByName('pago')[0].value;

    // 3. Captura de datos dinámicos (Instructor y Ubicación)
    let instructorTxt = "";
    if (tipo === 'alumno_escuela') {
        const sel = document.getElementsByName('id_instructor_interno')[0];
        instructorTxt = sel.options[sel.selectedIndex].text;
    } else if (tipo === 'instructor_escuela') {
        instructorTxt = "Registro de Instructor";
    } else {
        instructorTxt = document.getElementsByName('nombre_maestro_externo')[0]?.value || "N/A";
    }

    const ubicacion = document.getElementsByName('estado_mexico')[0]?.value || 
                      document.getElementsByName('direccion_extranjero')[0]?.value || "No especificada";

    if (!nombre) {
        alert("Por favor, ingresa tu nombre.");
        return;
    }

    // 4. Construcción del HTML en el orden solicitado
    let resumenHTML = `
        <p><strong>Nombre:</strong> ${nombre}</p>
        <p><strong>Instructor:</strong> ${instructorTxt}</p>
        <p><strong>Dirección:</strong> ${ubicacion}</p>
        <p><strong>Talla de playera:</strong> ${talla}</p>
        <p><strong>Estatus de pago:</strong> ${pago}</p>
        <hr>
        <p style="font-size: 0.9em; color: #666; font-style: italic;">
            "Confirma que tus datos sean correctos para finalizar tu registro de guerrero."
        </p>
    `;

    // 5. Mostrar en pantalla
    document.getElementById('info-content').innerHTML = resumenHTML;
    document.getElementById('paso-datos').style.display = 'none';
    document.getElementById('seccion-resumen').style.display = 'block';
}
    //6. Editar datos 
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
    try {
        if (tipoUsuario === 'instructor_escuela') {
            // Caso: Instructor local
            datosRegistro.id_instructor_emw = document.getElementById('nombre_registro').value;

        } else if (tipoUsuario === 'alumno_escuela') {
            // Caso: Alumno local (Se registra en su tabla primero)
            const { data: nuevoAlumno, error: errAlum } = await supabaseClient.from('alumnos_emw')
                .insert([{ 
                    nombre_completo: document.getElementById('nombre_registro').value,
                    id_instructor_pertenece: document.getElementsByName('id_instructor_interno')[0].value
                }]).select();
            
            if (errAlum) throw errAlum;
            datosRegistro.id_alumno_emw = nuevoAlumno[0].id_alumno_emw;

        } else {
            // Caso: Externos (Extranjeros, Invitados, Maestros externos)
            const { data: nuevoExterno, error: errExt } = await supabaseClient.from('personas_externas')
                .insert([{
                    nombre_completo: document.getElementById('nombre_registro').value,
                    procedencia: document.getElementsByName('estado_mexico')[0]?.value || 
                                 document.getElementsByName('direccion_extranjero')[0]?.value,
                    rol: tipoUsuario === 'instructor_extranjero' ? 'Maestro Ext' : 
                         tipoUsuario === 'alumno_extranjero' ? 'Alumno Ext' : 'Invitado'
                }]).select();
            
            if (errExt) throw errExt;
            datosRegistro.id_externo = nuevoExterno[0].id_externo;
        }

        // 4. INSERCIÓN FINAL (Lo que tú tenías, pero ahora con los datos ya repartidos)
        const { data, error } = await supabaseClient
            .from('inscripciones_final')
            .insert([datosRegistro])
            .select();

        if (error) throw error;

        // 5. GENERAR FOLIO Y REDIRIGIR
        const folio = data[0].id_inscripcion;
        sessionStorage.setItem('folio_real', folio);
        window.location.href = "confirmacion.html";

    } catch (err) {
        console.error("Error completo:", err);
        alert("Hubo un problema con el registro: " + err.message);
    }
} // <--- Aquí cierra la función

// Función auxiliar para convertir CH, M, G a IDs (1, 2, 3...)
function obtenerIdTalla(abreviatura) {
    const mapa = { 'CH': 1, 'M': 2, 'G': 3, 'XG': 4 };
    return mapa[abreviatura];
}
function togglePrivacy() {
    const modal = document.getElementById('privacyModal');
    modal.style.display = (modal.style.display === 'block') ? 'none' : 'block';
}
