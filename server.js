const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();

// Ruta de la carpeta donde se guardarán los expedientes
const carpetaExpedientes = path.join(__dirname, 'data', 'expedientes');

app.use(cors());
app.use(express.json());

// Puerto del servidor
const PORT = 4000;

// Obtener la lista de expedientes desde los archivos JSON
function obtenerExpedientes() {
    const archivos = fs.readdirSync(carpetaExpedientes);

    return archivos
        .filter(archivo => archivo.endsWith('.json'))
        .map(archivo => {
            const contenido = fs.readFileSync(
                path.join(carpetaExpedientes, archivo),
                'utf8'
            );

            return JSON.parse(contenido);
        });
}

// Ruta principal
app.get('/', (req, res) => {
    res.send('Servidor SIGO-GN funcionando correctamente');
});

// Buscar expedientes por folio, operativo o descripción
// IMPORTANTE: Esta ruta debe ir antes de /expedientes/:folio
app.get('/expedientes/buscar', (req, res) => {
    try {
        const texto = (req.query.texto || '').toLowerCase();

        const expedientes = obtenerExpedientes();

        const resultados = expedientes.filter(expediente =>
            expediente.folio.toLowerCase().includes(texto) ||
            expediente.operativo.toLowerCase().includes(texto) ||
            expediente.descripcion.toLowerCase().includes(texto)
        );

        res.json(resultados);

    } catch (error) {
        console.error('Error al buscar expedientes:', error);
        res.status(500).json({
            mensaje: 'Error al buscar expedientes'
        });
    }
});

// Obtener todos los expedientes
app.get('/expedientes', (req, res) => {
    try {
        const expedientes = obtenerExpedientes();
        res.json(expedientes);

    } catch (error) {
        console.error('Error al obtener expedientes:', error);
        res.status(500).json({
            mensaje: 'Error al consultar los expedientes'
        });
    }
});

// Crear un expediente nuevo
app.post('/expedientes', (req, res) => {
    try {
        const {
            folio,
            operativo,
            tipoIncidente,
            zona,
            fecha,
            descripcion,
            estatus,
            prioridad
        } = req.body;

        // Validar que todos los campos estén completos
        if (
            !folio ||
            !operativo ||
            !tipoIncidente ||
            !zona ||
            !fecha ||
            !descripcion ||
            !estatus ||
            !prioridad
        ) {
            return res.status(400).json({
                mensaje: 'Todos los campos son obligatorios'
            });
        }

        // Validar el formato del folio
        const formatoFolio = /^EXP-\d{10}-\d{3}$/;

        if (!formatoFolio.test(folio)) {
            return res.status(400).json({
                mensaje: 'El folio debe tener el formato EXP-boleta-###'
            });
        }

        // Validar estatus
        const estatusPermitidos = ['Abierto', 'En proceso', 'Cerrado'];

        if (!estatusPermitidos.includes(estatus)) {
            return res.status(400).json({
                mensaje: 'Estatus no válido'
            });
        }

        // Validar prioridad
        const prioridadesPermitidas = ['Alta', 'Media', 'Baja'];

        if (!prioridadesPermitidas.includes(prioridad)) {
            return res.status(400).json({
                mensaje: 'Prioridad no válida'
            });
        }

        // Crear el nombre y la ruta del archivo
        const nombreArchivo = `${folio}.json`;
        const rutaArchivo = path.join(carpetaExpedientes, nombreArchivo);

        // Evitar folios duplicados
        if (fs.existsSync(rutaArchivo)) {
            return res.status(409).json({
                mensaje: 'El folio ya existe'
            });
        }

        // Obtener fecha y hora actual
        const fechaActual = new Date().toISOString();

        // Crear expediente
        const nuevoExpediente = {
            folio,
            operativo,
            tipoIncidente,
            zona,
            fecha,
            descripcion,
            estatus,
            prioridad,
            fechaCreacion: fechaActual,
            fechaModificacion: fechaActual
        };

        // Guardar expediente en archivo JSON
        fs.writeFileSync(
            rutaArchivo,
            JSON.stringify(nuevoExpediente, null, 2),
            'utf8'
        );

        res.status(201).json({
            mensaje: 'Expediente creado correctamente',
            expediente: nuevoExpediente
        });

    } catch (error) {
        console.error('Error al crear expediente:', error);
        res.status(500).json({
            mensaje: 'Error al guardar el expediente'
        });
    }
});

// Obtener un expediente por su folio
app.get('/expedientes/:folio', (req, res) => {
    try {
        const folio = req.params.folio;
        const rutaArchivo = path.join(carpetaExpedientes, `${folio}.json`);

        if (!fs.existsSync(rutaArchivo)) {
            return res.status(404).json({
                mensaje: 'Expediente no encontrado'
            });
        }

        const contenido = fs.readFileSync(rutaArchivo, 'utf8');
        const expediente = JSON.parse(contenido);

        res.json(expediente);

    } catch (error) {
        console.error('Error al consultar expediente:', error);
        res.status(500).json({
            mensaje: 'Error al consultar el expediente'
        });
    }
});

// Actualizar un expediente
app.put('/expedientes/:folio', (req, res) => {
    try {
        const folio = req.params.folio;
        const rutaArchivo = path.join(carpetaExpedientes, `${folio}.json`);

        if (!fs.existsSync(rutaArchivo)) {
            return res.status(404).json({
                mensaje: 'Expediente no encontrado'
            });
        }

        const {
            operativo,
            tipoIncidente,
            zona,
            fecha,
            descripcion,
            estatus,
            prioridad
        } = req.body;

        // Validar campos obligatorios
        if (
            !operativo ||
            !tipoIncidente ||
            !zona ||
            !fecha ||
            !descripcion ||
            !estatus ||
            !prioridad
        ) {
            return res.status(400).json({
                mensaje: 'Todos los campos son obligatorios'
            });
        }

        // Validar estatus
        const estatusPermitidos = ['Abierto', 'En proceso', 'Cerrado'];

        if (!estatusPermitidos.includes(estatus)) {
            return res.status(400).json({
                mensaje: 'Estatus no válido'
            });
        }

        // Validar prioridad
        const prioridadesPermitidas = ['Alta', 'Media', 'Baja'];

        if (!prioridadesPermitidas.includes(prioridad)) {
            return res.status(400).json({
                mensaje: 'Prioridad no válida'
            });
        }

        // Leer expediente actual para conservar su fecha de creación
        const contenidoActual = fs.readFileSync(rutaArchivo, 'utf8');
        const expedienteAnterior = JSON.parse(contenidoActual);

        // Crear expediente actualizado
        const expedienteActualizado = {
            folio,
            operativo,
            tipoIncidente,
            zona,
            fecha,
            descripcion,
            estatus,
            prioridad,
            fechaCreacion: expedienteAnterior.fechaCreacion || new Date().toISOString(),
            fechaModificacion: new Date().toISOString()
        };

        // Guardar cambios en el archivo JSON
        fs.writeFileSync(
            rutaArchivo,
            JSON.stringify(expedienteActualizado, null, 2),
            'utf8'
        );

        res.json({
            mensaje: 'Expediente actualizado correctamente',
            expediente: expedienteActualizado
        });

    } catch (error) {
        console.error('Error al actualizar expediente:', error);
        res.status(500).json({
            mensaje: 'Error al actualizar el expediente'
        });
    }
});

// Eliminar un expediente
app.delete('/expedientes/:folio', (req, res) => {
    try {
        const folio = req.params.folio;
        const rutaArchivo = path.join(carpetaExpedientes, `${folio}.json`);

        if (!fs.existsSync(rutaArchivo)) {
            return res.status(404).json({
                mensaje: 'Expediente no encontrado'
            });
        }

        // Eliminar físicamente el archivo JSON
        fs.unlinkSync(rutaArchivo);

        res.json({
            mensaje: 'Expediente eliminado correctamente'
        });

    } catch (error) {
        console.error('Error al eliminar expediente:', error);
        res.status(500).json({
            mensaje: 'Error al eliminar el expediente'
        });
    }
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
