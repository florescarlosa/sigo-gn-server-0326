
const fs = require('fs');
const path = require('path');

const carpeta = path.join(__dirname, 'data', 'expedientes');

const expedientes = [
    {
        folio: 'EXP-2026600326-001',
        operativo: 'CENTINELA',
        tipoIncidente: 'ROBO',
        zona: 'NORTE',
        fecha: '2026-10-20',
        descripcion: 'ROBO A CASA HABITACIÓN.',
        estatus: 'Abierto',
        prioridad: 'Alta',
        fechaCreacion: '2026-10-20T08:00:00.000Z',
        fechaModificacion: '2026-10-20T08:00:00.000Z'
    },
    {
        folio: 'EXP-2026600326-002',
        operativo: 'AGUILA',
        tipoIncidente: 'ACCIDENTE',
        zona: 'CENTRO',
        fecha: '2026-10-21',
        descripcion: 'ACCIDENTE VEHICULAR.',
        estatus: 'En proceso',
        prioridad: 'Media',
        fechaCreacion: '2026-10-21T09:30:00.000Z',
        fechaModificacion: '2026-10-22T10:00:00.000Z'
    },
    {
        folio: 'EXP-2026600326-003',
        operativo: 'HORIZONTE',
        tipoIncidente: 'INCENDIO',
        zona: 'SUR',
        fecha: '2026-10-22',
        descripcion: 'INCENDIO EN ESTABLECIMIENTO.',
        estatus: 'Cerrado',
        prioridad: 'Alta',
        fechaCreacion: '2026-10-22T11:00:00.000Z',
        fechaModificacion: '2026-10-23T12:00:00.000Z'
    },
    {
        folio: 'EXP-2026600326-004',
        operativo: 'DELTA',
        tipoIncidente: 'ROBO',
        zona: 'NORTE',
        fecha: '2026-11-04',
        descripcion: 'ROBO DE VEHÍCULO.',
        estatus: 'Abierto',
        prioridad: 'Alta',
        fechaCreacion: '2026-11-04T08:00:00.000Z',
        fechaModificacion: '2026-11-04T08:00:00.000Z'
    },
    {
        folio: 'EXP-2026600326-005',
        operativo: 'FRONTERA',
        tipoIncidente: 'ALLANAMIENTO',
        zona: 'PONIENTE',
        fecha: '2026-10-24',
        descripcion: 'ALLANAMIENTO DE DOMICILIO.',
        estatus: 'En proceso',
        prioridad: 'Baja',
        fechaCreacion: '2026-10-24T13:00:00.000Z',
        fechaModificacion: '2026-10-25T14:00:00.000Z'
    },
    {
        folio: 'EXP-2026600326-006',
        operativo: 'ESCUDO',
        tipoIncidente: 'VANDALISMO',
        zona: 'ORIENTE',
        fecha: '2026-10-25',
        descripcion: 'DAÑOS A MOBILIARIO URBANO.',
        estatus: 'Cerrado',
        prioridad: 'Baja',
        fechaCreacion: '2026-10-25T08:00:00.000Z',
        fechaModificacion: '2026-10-26T08:00:00.000Z'
    },
    {
        folio: 'EXP-2026600326-007',
        operativo: 'ALFA',
        tipoIncidente: 'ROBO',
        zona: 'SUR',
        fecha: '2026-10-26',
        descripcion: 'ROBO A COMERCIO.',
        estatus: 'Abierto',
        prioridad: 'Media',
        fechaCreacion: '2026-10-26T09:00:00.000Z',
        fechaModificacion: '2026-10-26T09:00:00.000Z'
    },
    {
        folio: 'EXP-2026600326-008',
        operativo: 'TITAN',
        tipoIncidente: 'ACCIDENTE',
        zona: 'NORTE',
        fecha: '2026-10-27',
        descripcion: 'COLISIÓN ENTRE DOS VEHÍCULOS.',
        estatus: 'En proceso',
        prioridad: 'Alta',
        fechaCreacion: '2026-10-27T10:00:00.000Z',
        fechaModificacion: '2026-10-28T10:00:00.000Z'
    },
    {
        folio: 'EXP-2026600326-009',
        operativo: 'FENIX',
        tipoIncidente: 'INCENDIO',
        zona: 'CENTRO',
        fecha: '2026-10-28',
        descripcion: 'INCENDIO EN LOCAL COMERCIAL.',
        estatus: 'Cerrado',
        prioridad: 'Media',
        fechaCreacion: '2026-10-28T11:00:00.000Z',
        fechaModificacion: '2026-10-29T11:00:00.000Z'
    },
    {
        folio: 'EXP-2026600326-010',
        operativo: 'HALCON',
        tipoIncidente: 'ROBO',
        zona: 'PONIENTE',
        fecha: '2026-10-29',
        descripcion: 'ROBO DE MOTOCICLETA.',
        estatus: 'Abierto',
        prioridad: 'Alta',
        fechaCreacion: '2026-10-29T12:00:00.000Z',
        fechaModificacion: '2026-10-29T12:00:00.000Z'
    },
    {
        folio: 'EXP-2026600326-011',
        operativo: 'CENTAURO',
        tipoIncidente: 'VANDALISMO',
        zona: 'ORIENTE',
        fecha: '2026-10-30',
        descripcion: 'DAÑOS A INSTALACIONES.',
        estatus: 'En proceso',
        prioridad: 'Baja',
        fechaCreacion: '2026-10-30T08:00:00.000Z',
        fechaModificacion: '2026-10-31T08:00:00.000Z'
    },
    {
        folio: 'EXP-2026600326-012',
        operativo: 'ORION',
        tipoIncidente: 'ALLANAMIENTO',
        zona: 'SUR',
        fecha: '2026-10-31',
        descripcion: 'INGRESO NO AUTORIZADO A INMUEBLE.',
        estatus: 'Cerrado',
        prioridad: 'Alta',
        fechaCreacion: '2026-10-31T09:00:00.000Z',
        fechaModificacion: '2026-11-01T09:00:00.000Z'
    },
    {
        folio: 'EXP-2026600326-013',
        operativo: 'PEGASO',
        tipoIncidente: 'ACCIDENTE',
        zona: 'CENTRO',
        fecha: '2026-11-01',
        descripcion: 'ACCIDENTE DE MOTOCICLETA.',
        estatus: 'Abierto',
        prioridad: 'Baja',
        fechaCreacion: '2026-11-01T10:00:00.000Z',
        fechaModificacion: '2026-11-01T10:00:00.000Z'
    },
    {
        folio: 'EXP-2026600326-014',
        operativo: 'ATLAS',
        tipoIncidente: 'ROBO',
        zona: 'NORTE',
        fecha: '2026-11-02',
        descripcion: 'ROBO A TRANSEÚNTE.',
        estatus: 'En proceso',
        prioridad: 'Media',
        fechaCreacion: '2026-11-02T11:00:00.000Z',
        fechaModificacion: '2026-11-03T11:00:00.000Z'
    },
    {
        folio: 'EXP-2026600326-015',
        operativo: 'APOLO',
        tipoIncidente: 'INCENDIO',
        zona: 'PONIENTE',
        fecha: '2026-11-03',
        descripcion: 'CONATO DE INCENDIO EN VIVIENDA.',
        estatus: 'Cerrado',
        prioridad: 'Media',
        fechaCreacion: '2026-11-03T12:00:00.000Z',
        fechaModificacion: '2026-11-04T12:00:00.000Z'
    }
];

if (!fs.existsSync(carpeta)) {
    fs.mkdirSync(carpeta, { recursive: true });
}

expedientes.forEach((expediente) => {
    const archivo = path.join(carpeta, `${expediente.folio}.json`);

    fs.writeFileSync(
        archivo,
        JSON.stringify(expediente, null, 2),
        'utf8'
    );
});

console.log('Se generaron correctamente los 15 expedientes.');
