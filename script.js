/**
 * GESTIÓN DE FLUJO DINÁMICO - EMW 2026
 * Este script controla qué campos ve el usuario según su rol.
 */
// Configuración de conexión con Supabase
const supabaseUrl = 'https://zvtwlgfzfoouxbhnpwwr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2dHdsZ2Z6Zm9vdXhiaG5wd3dyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUxOTM1MDksImV4cCI6MjA5MDc2OTUwOX0._AbrD6Pv0iR1EfHboRAi1mla-V78lfKyb-knuMYszt8';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

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
