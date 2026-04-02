function gestionarFlujo() {
    // Obtenemos los valores principales seleccionados por el usuario
    const tipo = document.getElementById('tipo-usuario').value;
    const rol = document.getElementById('rol-usuario').value;

    // Referencias a los contenedores del HTML para ocultar/mostrar
    const grupoRol = document.getElementById('grupo-rol');
    const camposIdentidad = document.getElementById('campos-identidad');
    const contenedorMaestro = document.getElementById('contenedor-maestro');
    const grupoUbicacion = document.getElementById('grupo-ubicacion');
    const camposComunes = document.getElementById('campos-comunes');

    // Paso 1: Mostrar el sub-filtro de Rol si no es "Invitado"
    if (tipo === 'interno' || tipo === 'extranjero') {
        grupoRol.style.display = 'block';
    } else if (tipo === 'invitado') {
        grupoRol.style.display = 'none';
        configurarInvitado(); // Función para mostrar campos directos
        return; // Salimos de la función porque invitado no necesita rol
    } else {
        ocultarTodo(); // Si no hay selección, limpiamos la pantalla
        return;
    }

    // Paso 2: Si ya eligió un rol, mostramos los campos específicos
    if (rol !== "") {
        camposIdentidad.style.display = 'block';
        grupoUbicacion.style.display = 'block';
        camposComunes.style.display = 'block';

        // Lógica para el Instructor (Se oculta si el usuario ES instructor)
        contenedorMaestro.style.display = (rol === 'alumno') ? 'block' : 'none';

        // Configuramos los inputs dinámicos (Select para internos, Text para externos)
        actualizarCamposDinamicos(tipo, rol);
    }
}

function actualizarCamposDinamicos(tipo) {
    const divNombre = document.getElementById('input-dinamico-nombre');
    const divUbicacion = document.getElementById('input-dinamico-ubicacion');
    const labelUbicacion = document.getElementById('label-ubicacion');

    // CASO 1: Usuarios de la Escuela en México (Internos)
    if (tipo === 'alumno_escuela' || tipo === 'instructor_escuela') {
        
        // Para el nombre, usamos un SELECT (evita que escriban mal su nombre)
        divNombre.innerHTML = `
            <select name="id_usuario" required>
                <option value="">-- Selecciona tu nombre de la lista --</option>
                <option value="1">Maestro Rodrigo (ID: 001)</option>
                <option value="2">Maestra Elena (ID: 002)</option>
                <option value="temp">Cargando catálogo completo...</option>
            </select>`;

        labelUbicacion.innerText = "Selecciona tu Estado (México)";
        
        // Desplegable con los 32 estados de México
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
    } 
    
    // CASO 2: Extranjeros o Invitados (Datos abiertos)
    else {
        // Para externos usamos INPUT de texto libre
        divNombre.innerHTML = `
            <input type="text" name="nombre_completo" placeholder="Escribe tu nombre completo" required>`;
        
        labelUbicacion.innerText = "Dirección de procedencia (Ciudad, País)";
        
        divUbicacion.innerHTML = `
            <textarea name="direccion_extranjero" rows="2" placeholder="Ej: Bogotá, Colombia" required></textarea>`;
    }
}

function ocultarTodo() {
    // Función auxiliar para resetear el formulario si el usuario cambia de opinión
    document.getElementById('grupo-rol').style.display = 'none';
    document.getElementById('campos-identidad').style.display = 'none';
    document.getElementById('grupo-ubicacion').style.display = 'none';
    document.getElementById('campos-comunes').style.display = 'none';
}
