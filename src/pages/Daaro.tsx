import React, { useState } from 'react';
import {
    Search, Calculator, CreditCard, Hotel, MoreHorizontal,
    ArrowRight, CheckCircle2, AlertCircle, TrendingUp, History,
    Wallet, Banknote, Building2, Receipt, FileText, Eye, Printer,
    Download, FileSpreadsheet, Filter, Calendar, MapPin, User as UserIcon
} from 'lucide-react';
import { MOCK_DATA } from '../data/mockData';
import { createPortal } from 'react-dom';

const Daaro: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSocio, setSelectedSocio] = useState<any>(null);
    const [isCalculated, setIsCalculated] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<'cheque' | 'deposito'>('deposito');
    const [bankAccount, setBankAccount] = useState('');
    const [viewingLiquidation, setViewingLiquidation] = useState<any>(null);

    // DAARO Calculation Data
    const [daaroData, setDaaroData] = useState({
        totalAportes: 0,
        rendimiento: 0,
        subtotalAportes: 0,
        deudas: {
            prestamos: 0,
            hoteleria: 0,
            otros: 0
        },
        totalDeudas: 0,
        saldoFinal: 0
    });

    const handleSearch = () => {
        const socio = MOCK_DATA.socios.find(s =>
            s.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.dni.includes(searchTerm)
        );

        if (socio) {
            setSelectedSocio(socio);
            setIsCalculated(false);
            setShowSuccess(false);

            // Find their loans
            const prestamo = MOCK_DATA.prestamos.find(p => p.socio === socio.nombre);
            const saldoPrestamo = prestamo ? parseFloat(prestamo.saldo.replace('Bs. ', '').replace('.', '').replace(',', '.')) : 0;

            // ADJUSTMENT: Use amounts between 150k and 300k for test cases
            // We'll generate a random amount in that range if the mock data is lower
            const baseAhorro = parseFloat(socio.ahorro.replace('Bs. ', '').replace('.', '').replace(',', '.'));
            const ahorro = baseAhorro < 150000 ? Math.floor(Math.random() * (300000 - 150000 + 1)) + 150000 : baseAhorro;

            const rendimiento = ahorro * 0.045; // 4.5% interest
            const subtotal = ahorro + rendimiento;
            const deudasHoteleria = Math.random() > 0.5 ? 2450 : 0;
            const deudasOtros = Math.random() > 0.7 ? 820 : 0;
            const totalDeudas = saldoPrestamo + deudasHoteleria + deudasOtros;

            setDaaroData({
                totalAportes: ahorro,
                rendimiento: rendimiento,
                subtotalAportes: subtotal,
                deudas: {
                    prestamos: saldoPrestamo,
                    hoteleria: deudasHoteleria,
                    otros: deudasOtros
                },
                totalDeudas: totalDeudas,
                saldoFinal: subtotal - totalDeudas
            });
        }
    };

    const handleProcess = () => {
        setIsCalculated(true);
    };

    const handleFinalize = () => {
        setShowSuccessModal(true);
    };

    const confirmSuccess = () => {
        setShowSuccessModal(false);
        setShowSuccess(true);
    };

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('es-BO', { style: 'currency', currency: 'BOB' }).format(val).replace('BOB', 'Bs.');
    };

    const historialData = [
        { id: 'DAA-2024-0041', socio: 'Carlos Rodríguez', date: '20/03/2024', amount: 185420.50, sucursal: 'Agencia Sur', usuario: 'Admin Demo' },
        { id: 'DAA-2024-0040', socio: 'Elena Miranda', date: '15/03/2024', amount: 212300.00, sucursal: 'Matriz Principal', usuario: 'Admin Demo' },
        { id: 'DAA-2024-0039', socio: 'Roberto Siles', date: '10/03/2024', amount: 154200.00, sucursal: 'Sucursal Norte', usuario: 'Oficial Crédito' }
    ];

    return (
        <div className="daaro-container fade-in">
            <header className="page-header" style={{ marginBottom: '2.5rem' }}>
                <h1 style={{ fontSize: '2.2rem', fontWeight: 800, margin: 0 }}>DAARO</h1>
                <p style={{ color: 'var(--text-muted)', margin: 0 }}>Gestión de Devolución de Aportes y Liquidaciones</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: '2.5rem' }}>
                {/* Search Sidebar */}
                <div className="sidebar-section">
                    <div className="card" style={{ marginBottom: '1.5rem', padding: '1.8rem' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Search size={18} className="text-primary" /> Nuevo DAARO
                        </h3>
                        <div className="search-bar" style={{ marginBottom: '1.2rem', width: '100%' }}>
                            <Search className="search-icon" size={18} />
                            <input
                                type="text"
                                placeholder="Nombre o C.I. del Socio"
                                style={{ width: '100%' }}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            />
                        </div>
                        <button className="btn btn-primary" style={{ width: '100%', marginBottom: '1rem' }} onClick={handleSearch}>
                            Buscar Socio en Base
                        </button>

                        {selectedSocio && (
                            <div className="socio-preview fade-in" style={{ padding: '1.5rem', background: '#f8fafc', borderRadius: '18px', border: '1px solid var(--border)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '1.2rem' }}>
                                    <div style={{ width: '48px', height: '48px', background: 'var(--primary)', color: 'white', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.2rem' }}>
                                        {selectedSocio.img}
                                    </div>
                                    <div>
                                        <p style={{ fontWeight: 800, margin: 0, fontSize: '1rem', color: 'var(--secondary)' }}>{selectedSocio.nombre}</p>
                                        <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>DNI: {selectedSocio.dni}</p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ color: '#64748b' }}>Estado Socio:</span>
                                        <span className="badge activo">{selectedSocio.estado}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ color: '#64748b' }}>Saldo en Aportes:</span>
                                        <span style={{ fontWeight: 800, color: 'var(--primary-dark)' }}>{selectedSocio.ahorro}</span>
                                    </div>
                                    <div style={{ height: '1px', background: '#e2e8f0', margin: '8px 0' }} />
                                    <div style={{ background: '#ecfdf5', padding: '10px', borderRadius: '10px' }}>
                                        <p style={{ margin: 0, fontSize: '0.75rem', color: '#047857', fontWeight: 700 }}>Proyección para test:</p>
                                        <p style={{ margin: 0, fontWeight: 800 }}>{formatCurrency(daaroData.totalAportes)}</p>
                                    </div>
                                </div>
                                {!isCalculated && (
                                    <button
                                        className="btn btn-primary"
                                        style={{ width: '100%', marginTop: '1.5rem', background: 'var(--secondary)', color: 'white' }}
                                        onClick={handleProcess}
                                    >
                                        <Calculator size={16} /> Iniciar Liquidación
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="card" style={{ padding: '1.8rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Historial Reciente</h3>
                            <History size={18} style={{ color: '#94a3b8' }} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {historialData.map((item) => (
                                <div key={item.id} style={{ padding: '12px', borderRadius: '12px', border: '1px solid #f1f5f9', background: '#fafafa' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                        <p style={{ fontSize: '0.85rem', fontWeight: 700, margin: 0 }}>{item.socio}</p>
                                        <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{item.date}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--primary-dark)' }}>{formatCurrency(item.amount)}</span>
                                        <button
                                            className="icon-btn"
                                            style={{ width: '32px', height: '32px' }}
                                            onClick={() => setViewingLiquidation(item)}
                                            title="Ver detalle"
                                        >
                                            <Eye size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="content-section">
                    {!isCalculated ? (
                        <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem', textAlign: 'center' }}>
                            <div style={{ width: '120px', height: '120px', background: 'var(--primary)', color: 'white', borderRadius: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2.5rem', transform: 'rotate(-10deg)', boxShadow: '0 20px 40px rgba(47, 222, 145, 0.3)' }}>
                                <Wallet size={56} />
                            </div>
                            <h2 style={{ fontWeight: 800, color: 'var(--secondary)', fontSize: '2rem', marginBottom: '1rem' }}>Módulo de Liquidación DAARO</h2>
                            <p style={{ color: '#64748b', maxWidth: '450px', fontSize: '1.1rem' }}>
                                El proceso de DAARO permite liquidar los aportes de un socio, compensando deudas vigentes y devolviendo el saldo excedente.
                            </p>
                        </div>
                    ) : showSuccess ? (
                        <div className="card fade-in" style={{ padding: 0, overflow: 'hidden', height: '100%' }}>
                            <div style={{ background: 'var(--primary)', padding: '4.5rem 2rem', textAlign: 'center', color: 'white' }}>
                                <div style={{ width: '90px', height: '90px', background: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
                                    <CheckCircle2 size={56} />
                                </div>
                                <h2 style={{ fontWeight: 900, fontSize: '2.5rem', marginBottom: '0.5rem' }}>Liquidación Exitosa</h2>
                                <p style={{ opacity: 0.9, fontSize: '1.2rem', fontWeight: 500 }}>Comprobante Generado: DAA-2024-0042</p>
                            </div>
                            <div style={{ padding: '3rem' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', marginBottom: '3rem' }}>
                                    <div style={{ padding: '1.8rem', border: '1px solid var(--border)', borderRadius: '20px', background: '#f8fafc' }}>
                                        <p style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 800, marginBottom: '12px' }}>Total Aportes</p>
                                        <p style={{ fontSize: '1.6rem', fontWeight: 900, margin: 0 }}>{formatCurrency(daaroData.totalAportes)}</p>
                                    </div>
                                    <div style={{ padding: '1.8rem', border: '1px solid var(--border)', borderRadius: '20px', background: '#fef2f2' }}>
                                        <p style={{ fontSize: '0.8rem', color: '#ef4444', textTransform: 'uppercase', fontWeight: 800, marginBottom: '12px' }}>Deudas Pagadas</p>
                                        <p style={{ fontSize: '1.6rem', fontWeight: 900, margin: 0, color: '#ef4444' }}>{formatCurrency(daaroData.totalDeudas)}</p>
                                    </div>
                                    <div style={{ padding: '1.8rem', border: '1px solid var(--primary)', borderRadius: '20px', background: '#f0fdf4' }}>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--primary-dark)', textTransform: 'uppercase', fontWeight: 800, marginBottom: '12px' }}>Neto Devuelto</p>
                                        <p style={{ fontSize: '1.6rem', fontWeight: 900, margin: 0, color: 'var(--primary-dark)' }}>{formatCurrency(daaroData.saldoFinal)}</p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
                                    <button className="btn btn-primary" style={{ padding: '1.2rem 3rem', fontSize: '1.1rem' }}>
                                        <Printer size={20} /> Imprimir Comprobante Oficial
                                    </button>
                                    <button className="btn" style={{ padding: '1.2rem 2.5rem', background: '#f8fafc', border: '1px solid #e2e8f0', fontWeight: 700 }} onClick={() => { setSelectedSocio(null); setIsCalculated(false); setShowSuccess(false); }}>
                                        Nueva Operación
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                {/* Contributions Card */}
                                <div className="card" style={{ borderTop: '6px solid var(--primary)', padding: '2rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>Beneficios Acumulados</h3>
                                        <TrendingUp style={{ color: 'var(--primary)' }} size={24} />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span style={{ color: '#64748b', fontWeight: 500 }}>Aportes de Capital Social:</span>
                                            <span style={{ fontWeight: 700 }}>{formatCurrency(daaroData.totalAportes)}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--primary-dark)' }}>
                                            <span style={{ fontWeight: 600 }}>Rendimiento Financiero (4.5%):</span>
                                            <span style={{ fontWeight: 800 }}>+ {formatCurrency(daaroData.rendimiento)}</span>
                                        </div>
                                        <div style={{ height: '1px', background: '#f1f5f9', margin: '10px 0' }} />
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.4rem', fontWeight: 900 }}>
                                            <span>Subtotal Beneficio:</span>
                                            <span style={{ color: 'var(--primary)' }}>{formatCurrency(daaroData.subtotalAportes)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Debts Card */}
                                <div className="card" style={{ borderTop: '6px solid #ef4444', padding: '2rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>Compensación Obligatoria</h3>
                                        <AlertCircle style={{ color: '#ef4444' }} size={24} />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span style={{ color: '#64748b', fontWeight: 500 }}>Saldo Préstamos (Capital+Interés):</span>
                                            <span style={{ fontWeight: 700, color: '#ef4444' }}>- {formatCurrency(daaroData.deudas.prestamos)}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span style={{ color: '#64748b', fontWeight: 500 }}>Reservas Hotelería / Sedes:</span>
                                            <span style={{ fontWeight: 700, color: '#ef4444' }}>- {formatCurrency(daaroData.deudas.hoteleria)}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span style={{ color: '#64748b', fontWeight: 500 }}>Otros Cargos Pendientes:</span>
                                            <span style={{ fontWeight: 700, color: '#ef4444' }}>- {formatCurrency(daaroData.deudas.otros)}</span>
                                        </div>
                                        <div style={{ height: '1px', background: '#f1f5f9', margin: '10px 0' }} />
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.4rem', fontWeight: 900 }}>
                                            <span>Total a Descontar:</span>
                                            <span style={{ color: '#ef4444' }}>{formatCurrency(daaroData.totalDeudas)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Final Liquidation Summary */}
                            <div className="card" style={{ padding: '2.5rem', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '4rem' }}>
                                    <div>
                                        <h3 style={{ fontWeight: 800, marginBottom: '2rem', fontSize: '1.4rem' }}>Finalización de Liquidación</h3>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', padding: '1.5rem', background: 'white', borderRadius: '15px', border: '1px solid var(--primary)' }}>
                                            <span style={{ color: '#64748b', fontSize: '1.2rem', fontWeight: 600 }}>Saldo Líquido a Devolver:</span>
                                            <span style={{ fontSize: '2.8rem', fontWeight: 900, color: 'var(--primary-dark)', lineHeight: 1 }}>{formatCurrency(daaroData.saldoFinal)}</span>
                                        </div>

                                        <div style={{ marginBottom: '1.5rem' }}>
                                            <p style={{ fontWeight: 800, fontSize: '0.9rem', marginBottom: '15px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Forma de Pago:</p>
                                            <div style={{ display: 'flex', gap: '15px' }}>
                                                <div
                                                    className={`p-3 rounded-4 border-2 d-flex align-items-center gap-3 flex-fill transition-all ${paymentMethod === 'deposito' ? 'border-primary bg-white text-primary shadow-sm' : 'bg-light border-transparent'}`}
                                                    style={{ cursor: 'pointer', border: '2px solid' }}
                                                    onClick={() => setPaymentMethod('deposito')}
                                                >
                                                    <Building2 size={24} />
                                                    <span style={{ fontWeight: 700 }}>Transferencia Bancaria</span>
                                                </div>
                                                <div
                                                    className={`p-3 rounded-4 border-2 d-flex align-items-center gap-3 flex-fill transition-all ${paymentMethod === 'cheque' ? 'border-primary bg-white text-primary shadow-sm' : 'bg-light border-transparent'}`}
                                                    style={{ cursor: 'pointer', border: '2px solid' }}
                                                    onClick={() => setPaymentMethod('cheque')}
                                                >
                                                    <Banknote size={24} />
                                                    <span style={{ fontWeight: 700 }}>Cheque de Gerencia</span>
                                                </div>
                                            </div>
                                        </div>

                                        {paymentMethod === 'deposito' && (
                                            <div className="fade-in">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Número de Cuenta (Banco Unión / BNB / Otros)"
                                                    style={{ padding: '1rem', borderRadius: '12px', fontSize: '1rem' }}
                                                    value={bankAccount}
                                                    onChange={(e) => setBankAccount(e.target.value)}
                                                />
                                            </div>
                                        )}
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                        <div style={{ background: '#fff9db', padding: '1.5rem', borderRadius: '15px', border: '1px solid #f08c00', marginBottom: '2rem' }}>
                                            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                                                <AlertCircle style={{ color: '#f08c00', flexShrink: 0 }} size={20} />
                                                <div>
                                                    <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#856404', margin: '0 0 5px' }}>Descargo Legal DAARO:</p>
                                                    <p style={{ fontSize: '0.8rem', color: '#856404', margin: 0, lineHeight: 1.4 }}>
                                                        Esta operación cancela automáticamente todos los préstamos vigentes y obligaciones pendientes. El socio acepta la liquidación final de sus aportes ordinarios.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            className="btn btn-primary"
                                            style={{ width: '100%', padding: '1.5rem', fontSize: '1.2rem', borderRadius: '18px' }}
                                            onClick={handleFinalize}
                                            disabled={paymentMethod === 'deposito' && !bankAccount}
                                        >
                                            Procesar y Emitir Documento
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* DETAIL MODAL */}
            {viewingLiquidation && createPortal(
                <div className="modal-overlay" onClick={() => setViewingLiquidation(null)}>
                    <div className="modal-content" style={{ maxWidth: '650px' }} onClick={e => e.stopPropagation()}>
                        <header className="modal-header">
                            <div>
                                <h2 style={{ margin: 0 }}>Detalle de Liquidación</h2>
                                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>{viewingLiquidation.id}</p>
                            </div>
                            <button className="close-btn" onClick={() => setViewingLiquidation(null)}><X size={20} style={{ position: 'static' }} /></button>
                        </header>
                        <div className="modal-body">
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem', padding: '1.5rem', background: '#f8fafc', borderRadius: '18px' }}>
                                <div>
                                    <p className="info-label">Socio Beneficiario</p>
                                    <p className="info-value">{viewingLiquidation.socio}</p>
                                </div>
                                <div>
                                    <p className="info-label">Fecha de Operación</p>
                                    <p className="info-value">{viewingLiquidation.date}</p>
                                </div>
                                <div>
                                    <p className="info-label">Sucursal</p>
                                    <p className="info-value">{viewingLiquidation.sucursal}</p>
                                </div>
                                <div>
                                    <p className="info-label">Operador</p>
                                    <p className="info-value">{viewingLiquidation.usuario}</p>
                                </div>
                            </div>

                            <h4 style={{ fontWeight: 800, marginBottom: '1rem' }}>Desglose Financiero</h4>
                            <div className="table-responsive">
                                <table className="premium-table" style={{ border: '1px solid var(--border)', borderRadius: '12px' }}>
                                    <tbody>
                                        <tr>
                                            <td style={{ fontWeight: 600 }}>Total Aportes Consolidados</td>
                                            <td style={{ textAlign: 'right', fontWeight: 700 }}>{formatCurrency(viewingLiquidation.amount * 1.2)}</td>
                                        </tr>
                                        <tr>
                                            <td style={{ fontWeight: 600 }}>Rendimiento Aplicado</td>
                                            <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--primary-dark)' }}>+ {formatCurrency(viewingLiquidation.amount * 0.05)}</td>
                                        </tr>
                                        <tr>
                                            <td style={{ fontWeight: 600 }}>Compensación de Préstamos</td>
                                            <td style={{ textAlign: 'right', fontWeight: 700, color: '#ef4444' }}>- {formatCurrency(viewingLiquidation.amount * 0.25)}</td>
                                        </tr>
                                        <tr style={{ background: '#f8fafc' }}>
                                            <td style={{ fontWeight: 900 }}>MONTO NETO LIQUIDADO</td>
                                            <td style={{ textAlign: 'right', fontWeight: 900, color: 'var(--primary-dark)', fontSize: '1.2rem' }}>{formatCurrency(viewingLiquidation.amount)}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <footer className="modal-footer">
                            <button className="btn" style={{ background: '#f1f5f9' }} onClick={() => setViewingLiquidation(null)}>Cerrar</button>
                            <button className="btn btn-primary"><Printer size={18} /> Imprimir Duplicado</button>
                        </footer>
                    </div>
                </div>,
                document.body
            )}

            {showSuccessModal && createPortal(
                <div className="modal-overlay" onClick={() => setShowSuccessModal(false)} style={{
                    zIndex: 9999,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px'
                }}>
                    <div className="modal-content daaro-modal-success" style={{
                        maxWidth: '800px',
                        width: '100%',
                        maxHeight: '90vh',
                        borderRadius: '24px',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        background: 'white',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                    }} onClick={e => e.stopPropagation()}>

                        {/* HEADER - FIXED */}
                        <div style={{ background: '#f0fdf4', padding: '1.5rem 2rem', textAlign: 'center', borderBottom: '1px solid #dcfce7', flexShrink: 0 }}>
                            <div style={{ color: '#16a34a', marginBottom: '0.5rem' }}>
                                <CheckCircle2 size={48} style={{ margin: '0 auto' }} />
                            </div>
                            <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#166534', margin: 0 }}>¡Registro Exitoso!</h2>
                            <p style={{ color: '#15803d', fontSize: '1rem', margin: '5px 0 0' }}>La liquidación DAARO ha sido procesada correctamente.</p>
                        </div>

                        {/* BODY - SCROLLABLE */}
                        <div className="modal-body responsive-modal-body" style={{ padding: '2rem', overflowY: 'auto', flex: 1 }}>
                            <div className="info-grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem', padding: '1.2rem', background: '#f8fafc', borderRadius: '15px', border: '1px solid #e2e8f0' }}>
                                <div><label className="info-label">Socio</label><strong className="info-value" style={{ fontSize: '0.95rem' }}>{selectedSocio?.nombre}</strong></div>
                                <div><label className="info-label">ID Socio</label><strong className="info-value" style={{ fontSize: '0.95rem' }}>{selectedSocio?.id}</strong></div>
                                <div><label className="info-label">Operación</label><strong className="info-value" style={{ fontSize: '0.95rem' }}>DAARO</strong></div>
                            </div>

                            <div className="financial-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                                <div>
                                    <h4 style={{ fontWeight: 800, marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem' }}>
                                        <TrendingUp size={16} className="text-primary" /> Beneficios
                                    </h4>
                                    <div style={{ background: '#f0fdf4', padding: '1.2rem', borderRadius: '12px', border: '1px solid #dcfce7' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
                                            <span>Cap. de Aportes:</span>
                                            <span style={{ fontWeight: 700 }}>{formatCurrency(daaroData?.totalAportes || 0)}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#166534', fontWeight: 700, fontSize: '0.9rem' }}>
                                            <span>Rendimiento:</span>
                                            <span>+ {formatCurrency(daaroData?.rendimiento || 0)}</span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h4 style={{ fontWeight: 800, marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem' }}>
                                        <AlertCircle size={16} style={{ color: '#ef4444' }} /> Compensación
                                    </h4>
                                    <div style={{ background: '#fef2f2', padding: '1.2rem', borderRadius: '12px', border: '1px solid #fee2e2' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.85rem' }}>
                                            <span>Préstamos:</span>
                                            <span style={{ color: '#ef4444' }}>- {formatCurrency(daaroData?.deudas?.prestamos || 0)}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.85rem' }}>
                                            <span>Hotel:</span>
                                            <span style={{ color: '#ef4444' }}>- {formatCurrency(daaroData?.deudas?.hoteleria || 0)}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                                            <span>Otros:</span>
                                            <span style={{ color: '#ef4444' }}>- {formatCurrency(daaroData?.deudas?.otros || 0)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="total-highlight" style={{ background: 'var(--secondary)', color: 'white', padding: '1.5rem', borderRadius: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                                <div>
                                    <span style={{ fontSize: '0.85rem', opacity: 0.8, display: 'block' }}>NETO A LIQUIDAR</span>
                                    <span style={{ fontSize: '0.75rem', opacity: 0.6, fontWeight: 700 }}>Modo: {paymentMethod === 'deposito' ? 'Transferencia' : 'Cheque'}</span>
                                </div>
                                <span style={{ fontSize: '2rem', fontWeight: 900 }}>{formatCurrency(daaroData?.saldoFinal || 0)}</span>
                            </div>
                        </div>

                        {/* FOOTER - FIXED */}
                        <footer className="modal-footer" style={{ padding: '1.5rem 2rem', background: '#f8fafc', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexShrink: 0 }}>
                            <button className="btn" style={{ background: 'white', border: '1px solid #e2e8f0', padding: '0.6rem 1.2rem' }} onClick={() => setShowSuccessModal(false)}>Cerrar</button>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button className="btn btn-primary" style={{ background: '#16a34a', padding: '0.6rem 1.2rem' }} onClick={() => window.print()}><Printer size={18} /> Imprimir</button>
                                <button className="btn btn-primary" style={{ padding: '0.6rem 1.2rem' }} onClick={confirmSuccess}>Confirmar</button>
                            </div>
                        </footer>
                    </div>
                </div>,
                document.body
            )}

            <style>{`
                .transition-all { transition: all 0.3s ease; }
                .d-flex { display: flex; }
                .align-items-center { align-items: center; }
                .gap-3 { gap: 1rem; }
                .flex-fill { flex: 1 1 auto; }
                .p-3 { padding: 1rem; }
                .rounded-4 { border-radius: 1rem; }
                .border-2 { border-width: 2px !important; }
                .shadow-sm { box-shadow: 0 .125rem .25rem rgba(0,0,0,.075)!important; }
                .bg-light { background-color: #f8f9fa!important; }
                .border-transparent { border-color: transparent!important; }
                .info-label { font-size: 0.75rem; text-transform: uppercase; color: #64748b; font-weight: 700; margin-bottom: 4px; }
                .info-value { font-size: 1.1rem; font-weight: 700; color: var(--secondary); margin: 0; }
                .close-btn { position: relative !important; top: 0 !important; right: 0 !important; }
                .modal-header { padding: 2rem !important; }
            `}</style>
        </div>
    );
};

const X = ({ size, style }: { size: number, style?: any }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);

export default Daaro;
