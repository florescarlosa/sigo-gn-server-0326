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

app.get('/', (req, res) => {
    res.send('Servidor SIGO-GN funcionando correctamente');
});

// Obtener todos los expedientes
app.get('/expedientes', (req, res) => {
    try {
        const archivos = fs.readdirSync(carpetaExpedientes);

        const expedientes = archivos
            .filter(archivo => archivo.endsWith('.json'))
            .map(archivo => {
                const contenido = fs.readFileSync(
                    path.join(carpetaExpedientes, archivo),
                    'utf8'
                );

                return JSON.parse(contenido);
            });

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
        const { folio, operativo, tipoIncidente, zona, fecha, descripcion } = req.body;

        // Validar que todos los campos estén completos
        if (!folio || !operativo || !tipoIncidente || !zona || !fecha || !descripcion) {
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

        // Crear el nombre y la ruta del archivo
        const nombreArchivo = `${folio}.json`;
        const rutaArchivo = path.join(carpetaExpedientes, nombreArchivo);

        // Evitar folios duplicados
        if (fs.existsSync(rutaArchivo)) {
            return res.status(409).json({
                mensaje: 'El folio ya existe'
            });
        }

        // Guardar el expediente en formato JSON
        const nuevoExpediente = {
            folio,
            operativo,
            tipoIncidente,
            zona,
            fecha,
            descripcion
        };

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

        const { operativo, tipoIncidente, zona, fecha, descripcion } = req.body;

        if (!operativo || !tipoIncidente || !zona || !fecha || !descripcion) {
            return res.status(400).json({
                mensaje: 'Todos los campos son obligatorios'
            });
        }

        const expedienteActualizado = {
            folio,
            operativo,
            tipoIncidente,
            zona,
            fecha,
            descripcion
        };

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


app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
