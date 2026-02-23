export const MOCK_DATA = {
    sucursales: [
        { id: 1, nombre: 'Matriz Principal - Central', codigo: 'MAT01' },
        { id: 2, nombre: 'Sucursal Norte - El Alto', codigo: 'NOR02' },
        { id: 3, nombre: 'Agencia Sur - Calacoto', codigo: 'SUR03' },
    ],
    dashboard: {
        MAT01: {
            kpis: [
                { title: 'Capital Social', value: 'Bs. 1.250.000', change: '+12%', color: 'blue' },
                { title: 'Socios Activos', value: '1.450', change: '+5%', color: 'teal' },
                { title: 'Cartera Colocada', value: 'Bs. 3.420.000', change: '+8%', color: 'purple' },
                { title: 'Mora Institucional', value: '2.4%', change: '-0.5%', color: 'orange' },
            ],
            colocaciones: [
                { name: 'Lun', Admin: 15000, Oficial1: 20000, Oficial2: 10000 },
                { name: 'Mar', Admin: 12000, Oficial1: 25000, Oficial2: 15000 },
                { name: 'Mie', Admin: 18000, Oficial1: 15000, Oficial2: 15000 },
                { name: 'Jue', Admin: 21000, Oficial1: 30000, Oficial2: 10000 },
                { name: 'Vie', Admin: 15000, Oficial1: 25000, Oficial2: 15000 },
                { name: 'Sab', Admin: 27000, Oficial1: 20000, Oficial2: 20000 },
                { name: 'Dom', Admin: 19000, Oficial1: 25000, Oficial2: 15000 },
            ],
            cartera: [
                { name: 'Consumo Ordinario', value: 40, color: '#2FDE91' },
                { name: 'Microcrédito Productivo', value: 25, color: '#FFA500' },
                { name: 'Hipotecario Vivienda', value: 25, color: '#5C869D' },
                { name: 'Emergencia / Salud', value: 10, color: '#FF4D4D' },
            ]
        },
        NOR02: {
            kpis: [
                { title: 'Capital Social', value: 'Bs. 850.000', change: '+8%', color: 'blue' },
                { title: 'Socios Activos', value: '980', change: '+3%', color: 'teal' },
                { title: 'Cartera Colocada', value: 'Bs. 2.150.200', change: '+10%', color: 'purple' },
                { title: 'Mora Institucional', value: '3.1%', change: '+0.2%', color: 'orange' },
            ],
            colocaciones: [
                { name: 'Lun', Admin: 10000, Oficial1: 15000 },
                { name: 'Mar', Admin: 12000, Oficial1: 20000 },
            ],
            cartera: [
                { name: 'Consumo Ordinario', value: 50, color: '#2FDE91' },
                { name: 'Microcrédito Productivo', value: 30, color: '#FFA500' },
                { name: 'Hipotecario Vivienda', value: 20, color: '#5C869D' },
            ]
        },
        SUR03: {
            kpis: [
                { title: 'Capital Social', value: 'Bs. 450.000', change: '+15%', color: 'blue' },
                { title: 'Socios Activos', value: '520', change: '+7%', color: 'teal' },
                { title: 'Cartera Colocada', value: 'Bs. 1.250.000', change: '+12%', color: 'purple' },
                { title: 'Mora Institucional', value: '1.8%', change: '-0.3%', color: 'orange' },
            ],
            colocaciones: [
                { name: 'Lun', Admin: 5000, Oficial1: 10000 },
            ],
            cartera: [
                { name: 'Hipotecario Vivienda', value: 60, color: '#5C869D' },
                { name: 'Consumo Ordinario', value: 30, color: '#2FDE91' },
                { name: 'Emergencia / Salud', value: 10, color: '#FF4D4D' },
            ]
        }
    },
    socios: [
        { id: 1, nombre: 'Juan Pérez', dni: '1234567 LP', email: 'juan.perez@email.com', sucursal: 'Matriz Principal', estado: 'Activo', ahorro: 'Bs. 5.420,00', img: 'JP' },
        { id: 2, nombre: 'María García', dni: '8765432 SC', email: 'm.garcia@email.com', sucursal: 'Sucursal Norte', estado: 'Activo', ahorro: 'Bs. 12.150,50', img: 'MG' },
        { id: 3, nombre: 'Carlos Rodríguez', dni: '4567890 CB', email: 'carlos.r@email.com', sucursal: 'Agencia Sur', estado: 'Inactivo', ahorro: 'Bs. 0,00', img: 'CR' },
        { id: 4, nombre: 'Ana Martínez', dni: '2345678 LP', email: 'ana.mtz@email.com', sucursal: 'Matriz Principal', estado: 'Activo', ahorro: 'Bs. 8.900,00', img: 'AM' },
        { id: 5, nombre: 'Roberto Siles', dni: '5678123 SC', email: 'r.siles@email.com', sucursal: 'Sucursal Norte', estado: 'Activo', ahorro: 'Bs. 2.150,00', img: 'RS' },
        { id: 6, nombre: 'Elena Miranda', dni: '9988771 OR', email: 'e.miranda@email.com', sucursal: 'Agencia Sur', estado: 'Activo', ahorro: 'Bs. 15.400,00', img: 'EM' },
    ],
    prestamos: [
        { id: 1, socio: 'Juan Pérez', monto: 'Bs. 25.000,00', plazo: '24 meses', tasa: '9.5%', estado: 'vigente', saldo: 'Bs. 15.200,00', tipo: 'Consumo Ordinario', fecha: '15/01/2024', cuotasPagadas: 8, cuotasTotales: 24, progreso: 33 },
        { id: 2, socio: 'Ana Martínez', monto: 'Bs. 10.000,00', plazo: '12 meses', tasa: '9.5%', estado: 'mora', saldo: 'Bs. 8.450,00', tipo: 'Consumo Ordinario', fecha: '10/11/2023', cuotasPagadas: 3, cuotasTotales: 12, progreso: 25 },
        { id: 3, socio: 'María García', monto: 'Bs. 80.000,00', plazo: '48 meses', tasa: '6.5%', estado: 'vigente', saldo: 'Bs. 72.000,00', tipo: 'Hipotecario Vivienda', fecha: '05/02/2024', cuotasPagadas: 4, cuotasTotales: 48, progreso: 8.3 },
        { id: 4, socio: 'Roberto Siles', monto: 'Bs. 15.000,00', plazo: '18 meses', tasa: '8.0%', estado: 'vigente', saldo: 'Bs. 12.500,00', tipo: 'Microcrédito Productivo', fecha: '20/12/2023', cuotasPagadas: 5, cuotasTotales: 18, progreso: 27 },
        { id: 5, socio: 'Elena Miranda', monto: 'Bs. 5.000,00', plazo: '6 meses', tasa: '5.0%', estado: 'vigente', saldo: 'Bs. 1.200,00', tipo: 'Emergencia / Salud', fecha: '10/01/2024', cuotasPagadas: 5, cuotasTotales: 6, progreso: 83 },
        { id: 6, socio: 'Carlos Rodríguez', monto: 'Bs. 35.000,00', plazo: '36 meses', tasa: '8.0%', estado: 'vigente', saldo: 'Bs. 35.000,00', tipo: 'Microcrédito Productivo', fecha: '20/03/2024', cuotasPagadas: 0, cuotasTotales: 36, progreso: 0 },
    ],
    aportes: [
        { id: 1, socio: 'Juan Pérez', dni: '1234567 LP', mes: 'Enero 2024', monto: 'Bs. 200,00', fecha: '10/01/2024', sucursal: 'Matriz Principal' },
        { id: 2, socio: 'María García', dni: '8765432 SC', mes: 'Enero 2024', monto: 'Bs. 200,00', fecha: '12/01/2024', sucursal: 'Sucursal Norte' },
        { id: 3, socio: 'Ana Martínez', dni: '2345678 LP', mes: 'Enero 2024', monto: 'Bs. 200,00', fecha: '11/01/2024', sucursal: 'Matriz Principal' },
        { id: 4, socio: 'Juan Pérez', dni: '1234567 LP', mes: 'Febrero 2024', monto: 'Bs. 200,00', fecha: '05/02/2024', sucursal: 'Matriz Principal' },
        { id: 5, socio: 'Roberto Siles', dni: '5678123 SC', mes: 'Enero 2024', monto: 'Bs. 150,00', fecha: '20/01/2024', sucursal: 'Sucursal Norte' },
    ]
};
