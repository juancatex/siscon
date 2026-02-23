import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import {
    Plus, Search, Filter, PlayCircle, Calculator, FileText, ChevronRight, X, Save, User as UserIcon, Landmark, CheckCircle, Printer, Download, FileSpreadsheet
} from 'lucide-react';
import { MOCK_DATA } from '../data/mockData';

const TIPO_PRESTAMO_RATES: Record<string, number> = {
    'Consumo Ordinario': 9.5,
    'Microcrédito Productivo': 8.0,
    'Hipotecario Vivienda': 6.5,
    'Emergencia / Salud': 5.0
};

const MOCK_SOLICITUDES_PENDIENTES = [
    { id: 'SOL-001', socio: 'Carlos Mendez Oroza', monto: 'Bs. 25.000,00', tipo: 'Consumo Ordinario', fecha: '2026-02-20', sucursal: 'Casa Matriz', plazo: '24 meses', registradoPor: 'Admin Demo' },
    { id: 'SOL-002', socio: 'Ana Maria Villegas', monto: 'Bs. 150.000,00', tipo: 'Hipotecario Vivienda', fecha: '2026-02-21', sucursal: 'Agencia Sur', plazo: '120 meses', registradoPor: 'S. Architect' },
    { id: 'SOL-003', socio: 'Roberto Carlos Poma', monto: 'Bs. 12.500,00', tipo: 'Microcrédito Productivo', fecha: '2026-02-22', sucursal: 'Agencia El Alto', plazo: '12 meses', registradoPor: 'Oficial Cred. 01' },
    { id: 'SOL-004', socio: 'Lucia Fernandez', monto: 'Bs. 5.000,00', tipo: 'Emergencia / Salud', fecha: '2026-02-23', sucursal: 'Casa Matriz', plazo: '6 meses', registradoPor: 'Admin Demo' },
];

const Prestamos: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'lista' | 'desembolsos' | 'simulador'>('lista');
    const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
    const [isDesembolsoModalOpen, setIsDesembolsoModalOpen] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    // Action Modals State
    const [selectedLoan, setSelectedLoan] = useState<any>(null);
    const [selectedRequest, setSelectedRequest] = useState<any>(null);
    const [actionModal, setActionModal] = useState<'detail' | 'plan' | null>(null);

    // Modal Form States (New Request)
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSocio, setSelectedSocio] = useState<any>(null);
    const [tipoPrestamo, setTipoPrestamo] = useState('Consumo Ordinario');
    const [montoSolicitado, setMontoSolicitado] = useState<number>(0);
    const [plazoMeses, setPlazoMeses] = useState<number>(12);

    const filteredSocios = useMemo(() => {
        if (!searchTerm) return [];
        return MOCK_DATA.socios.filter(s =>
            s.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.dni.includes(searchTerm)
        ).slice(0, 5);
    }, [searchTerm]);

    const tasaInteres = useMemo(() => TIPO_PRESTAMO_RATES[tipoPrestamo] || 10, [tipoPrestamo]);

    const cuotaEstimadaValue = useMemo(() => {
        if (montoSolicitado <= 0 || plazoMeses <= 0) return 0;
        const interesMensual = (tasaInteres / 12) / 100;
        const capitalSugerido = montoSolicitado / plazoMeses;
        const interesSugerido = montoSolicitado * interesMensual;
        return capitalSugerido + interesSugerido;
    }, [montoSolicitado, plazoMeses, tasaInteres]);

    const handleRegister = () => {
        setIsRequestModalOpen(false);
        setSearchTerm('');
        setSelectedSocio(null);
        setMontoSolicitado(0);
        setTipoPrestamo('Consumo Ordinario');
        setSuccessMessage('Solicitud de préstamo generado registro exitoso.');
        setShowSuccessModal(true);
    };

    const handleDesembolsar = () => {
        setIsDesembolsoModalOpen(false);
        setSelectedRequest(null);
        setSuccessMessage('El desembolso ha sido procesado exitosamente. Los fondos han sido transferidos a la cuenta del socio.');
        setShowSuccessModal(true);
    };

    const openActionModal = (loan: any, type: 'detail' | 'plan') => {
        setSelectedLoan(loan);
        setActionModal(type);
    };

    const closeActionModal = () => {
        setSelectedLoan(null);
        setActionModal(null);
    };

    return (
        <div className="prestamos-container fade-in">
            <header className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <div>
                    <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Cartera de Préstamos</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Control de colocaciones, seguimiento de mora y simulaciones SISCON</p>
                </div>
                <div className="tab-buttons" style={{ display: 'flex', background: '#f1f5f9', padding: '6px', borderRadius: '15px', gap: '5px' }}>
                    <button
                        className={`btn ${activeTab === 'lista' ? 'btn-primary' : ''}`}
                        style={{ padding: '0.6rem 1.2rem', background: activeTab === 'lista' ? '' : 'transparent', color: activeTab === 'lista' ? '' : '#64748b', boxShadow: activeTab === 'lista' ? '' : 'none' }}
                        onClick={() => setActiveTab('lista')}
                    >
                        Cartera
                    </button>
                    <button
                        className={`btn ${activeTab === 'desembolsos' ? 'btn-primary' : ''}`}
                        style={{ padding: '0.6rem 1.2rem', background: activeTab === 'desembolsos' ? '' : 'transparent', color: activeTab === 'desembolsos' ? '' : '#64748b', boxShadow: activeTab === 'desembolsos' ? '' : 'none' }}
                        onClick={() => setActiveTab('desembolsos')}
                    >
                        Desembolsos
                    </button>
                    <button
                        className={`btn ${activeTab === 'simulador' ? 'btn-primary' : ''}`}
                        style={{ padding: '0.6rem 1.2rem', background: activeTab === 'simulador' ? '' : 'transparent', color: activeTab === 'simulador' ? '' : '#64748b', boxShadow: activeTab === 'simulador' ? '' : 'none' }}
                        onClick={() => setActiveTab('simulador')}
                    >
                        Simulador
                    </button>
                </div>
            </header>

            {activeTab === 'lista' && (
                <PrestamosList
                    onOpenRequest={() => setIsRequestModalOpen(true)}
                    onOpenDetail={(loan) => openActionModal(loan, 'detail')}
                    onOpenPlan={(loan) => openActionModal(loan, 'plan')}
                />
            )}

            {activeTab === 'desembolsos' && (
                <DesembolsosList
                    onOpenDesembolso={(req) => {
                        setSelectedRequest(req);
                        setIsDesembolsoModalOpen(true);
                    }}
                />
            )}

            {activeTab === 'simulador' && <SimuladorCredito />}

            {/* NEW LOAN REQUEST MODAL */}
            {isRequestModalOpen && createPortal(
                <div className="modal-overlay" onClick={() => setIsRequestModalOpen(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <header className="modal-header">
                            <h2>Nueva Solicitud de Préstamo</h2>
                            <button className="close-btn" onClick={() => setIsRequestModalOpen(false)}><X size={20} /></button>
                        </header>

                        <div className="modal-body">
                            <form onSubmit={e => e.preventDefault()}>
                                <div className="form-group" style={{ position: 'relative' }}>
                                    <label>Buscar Socio Solicitante</label>
                                    <div style={{ position: 'relative' }}>
                                        <Search size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                        <input
                                            type="text"
                                            className="form-control"
                                            style={{ paddingLeft: '3rem' }}
                                            placeholder="Nombre o DNI del socio..."
                                            value={searchTerm}
                                            onChange={(e) => {
                                                setSearchTerm(e.target.value);
                                                if (selectedSocio) setSelectedSocio(null);
                                            }}
                                        />
                                    </div>

                                    {searchTerm && !selectedSocio && filteredSocios.length > 0 && (
                                        <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'white', border: '1px solid var(--border)', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', zIndex: 10, marginTop: '5px', overflow: 'hidden' }}>
                                            {filteredSocios.map(socio => (
                                                <div
                                                    key={socio.id}
                                                    onClick={() => {
                                                        setSelectedSocio(socio);
                                                        setSearchTerm(socio.nombre);
                                                    }}
                                                    style={{ padding: '12px 15px', cursor: 'pointer', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '10px' }}
                                                    className="search-item-hover"
                                                >
                                                    <div className="avatar" style={{ width: '32px', height: '32px', fontSize: '0.8rem' }}>{socio.img}</div>
                                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                        <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{socio.nombre}</span>
                                                        <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>DNI: {socio.dni}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {selectedSocio && (
                                    <div style={{ background: 'rgba(47, 222, 145, 0.05)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(47, 222, 145, 0.2)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div className="avatar">{selectedSocio.img}</div>
                                        <div>
                                            <span style={{ display: 'block', fontWeight: 700, fontSize: '0.9rem' }}>{selectedSocio.nombre}</span>
                                            <span style={{ fontSize: '0.8rem', color: 'var(--primary-dark)' }}>Socio Seleccionado - Calificación A+</span>
                                        </div>
                                    </div>
                                )}

                                <div className="info-grid">
                                    <div className="form-group">
                                        <label>Tipo de Préstamo</label>
                                        <select
                                            className="form-control"
                                            value={tipoPrestamo}
                                            onChange={(e) => setTipoPrestamo(e.target.value)}
                                        >
                                            {Object.keys(TIPO_PRESTAMO_RATES).map(tipo => (
                                                <option key={tipo} value={tipo}>{tipo}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Sucursal de Desembolso</label>
                                        <select className="form-control">
                                            {MOCK_DATA.sucursales.map(suc => (
                                                <option key={suc.id}>{suc.nombre}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="info-grid">
                                    <div className="form-group">
                                        <label>Monto Solicitado (Bs.)</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            placeholder="Ej: 15000"
                                            value={montoSolicitado || ''}
                                            onChange={(e) => setMontoSolicitado(Number(e.target.value))}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Plazo de Devolución</label>
                                        <select
                                            className="form-control"
                                            value={plazoMeses}
                                            onChange={(e) => setPlazoMeses(Number(e.target.value))}
                                        >
                                            <option value="6">6 meses</option>
                                            <option value="12">12 meses</option>
                                            <option value="18">18 meses</option>
                                            <option value="24">24 meses</option>
                                            <option value="36">36 meses</option>
                                            <option value="48">48 meses</option>
                                        </select>
                                    </div>
                                </div>

                                <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '15px', border: '1px solid var(--border)', marginTop: '1rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                        <span style={{ color: '#64748b', fontSize: '0.9rem' }}>Tasa Aplicada (TEA):</span>
                                        <span style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1.1rem' }}>{tasaInteres.toFixed(1)}%</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', borderBottom: '1px dashed #cbd5e1', paddingBottom: '0.5rem' }}>
                                        <span style={{ color: '#64748b', fontSize: '0.9rem' }}>Cuota Mensual Proyectada:</span>
                                        <span style={{ fontWeight: 800, color: 'var(--primary-dark)', fontSize: '1.4rem' }}>
                                            Bs. {cuotaEstimadaValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </span>
                                    </div>
                                    <p style={{ margin: '0.8rem 0 0', fontSize: '0.75rem', color: '#94a3b8', fontStyle: 'italic' }}>
                                        * Estimación basada en amortización SISCON institucional. No supera el 10% anual.
                                    </p>
                                </div>
                            </form>
                        </div>

                        <footer className="modal-footer">
                            <button className="btn" style={{ background: '#f1f5f9' }} onClick={() => setIsRequestModalOpen(false)}>Cancelar</button>
                            <button
                                className="btn btn-primary"
                                onClick={handleRegister}
                                disabled={!selectedSocio || montoSolicitado <= 0}
                            >
                                <Save size={18} /> Registrar Solicitud
                            </button>
                        </footer>
                    </div>
                </div>,
                document.body
            )}

            {/* ACTION MODAL: DETAIL OR PLAN */}
            {actionModal && selectedLoan && createPortal(
                <div className="modal-overlay" onClick={closeActionModal}>
                    <div className="modal-content" style={{ maxWidth: actionModal === 'plan' ? '800px' : '650px' }} onClick={e => e.stopPropagation()}>
                        <header className="modal-header">
                            <h2>{actionModal === 'detail' ? 'Detalle de Operación Crediticia' : 'Cronograma de Pagos Consolidado'}</h2>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                {actionModal === 'plan' && (
                                    <>
                                        <button className="icon-btn no-print" title="Imprimir" onClick={() => window.print()}><Printer size={18} /></button>
                                        <button className="icon-btn no-print" title="Excel"><FileSpreadsheet size={18} /></button>
                                        <button className="icon-btn no-print" title="PDF"><Download size={18} /></button>
                                    </>
                                )}
                                <button className="close-btn no-print" onClick={closeActionModal}><X size={20} /></button>
                            </div>
                        </header>

                        <div className="modal-body">
                            {actionModal === 'detail' ? (
                                <div className="fade-in">
                                    <div style={{ background: 'var(--secondary)', color: 'white', padding: '1.5rem', borderRadius: '20px', marginBottom: '2rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <div>
                                                <span style={{ fontSize: '0.8rem', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '1px' }}>Titular Autorizado</span>
                                                <h3 style={{ margin: '4px 0 0', fontSize: '1.4rem' }}>{selectedLoan.socio}</h3>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>Cód. Operación</span>
                                                <div style={{ fontWeight: 800 }}>#SIS-{selectedLoan.id}00-BT</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="info-grid">
                                        <div className="info-item">
                                            <span className="info-label">Tipo de Préstamo</span>
                                            <span className="info-value">{selectedLoan.tipo}</span>
                                        </div>
                                        <div className="info-item">
                                            <span className="info-label">Fecha de Inicio</span>
                                            <span className="info-value">{selectedLoan.fecha}</span>
                                        </div>
                                        <div className="info-item">
                                            <span className="info-label">Monto Desembolsado</span>
                                            <span className="info-value">{selectedLoan.monto}</span>
                                        </div>
                                        <div className="info-item">
                                            <span className="info-label">Tasa TEA SISCON</span>
                                            <span className="info-value">{selectedLoan.tasa}</span>
                                        </div>
                                        <div className="info-item">
                                            <span className="info-label">Plazo Total</span>
                                            <span className="info-value">{selectedLoan.plazo}</span>
                                        </div>
                                        <div className="info-item">
                                            <span className="info-label">Saldo de Capital</span>
                                            <span className="info-value" style={{ color: 'var(--primary-dark)' }}>{selectedLoan.saldo}</span>
                                        </div>
                                    </div>

                                    <div style={{ marginTop: '2.5rem', padding: '1.5rem', background: '#f8fafc', borderRadius: '20px', border: '1px solid var(--border)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                            <span style={{ fontWeight: 700, color: 'var(--secondary)' }}>Avance de la Operación</span>
                                            <span style={{ fontWeight: 800, color: 'var(--primary-dark)' }}>{selectedLoan.progreso}%</span>
                                        </div>
                                        <div className="progress-container">
                                            <div className="progress-bar" style={{ width: `${selectedLoan.progreso}%` }}></div>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '8px' }}>
                                            <span>{selectedLoan.cuotasPagadas} cuotas canceladas</span>
                                            <span>Restan {selectedLoan.cuotasTotales - selectedLoan.cuotasPagadas} periodos</span>
                                        </div>
                                    </div>

                                    <div style={{ marginTop: '1.5rem', display: 'flex', gap: '10px' }}>
                                        <span className={`badge ${selectedLoan.estado}`} style={{ fontSize: '0.7rem' }}>ESTADO: {selectedLoan.estado.toUpperCase()}</span>
                                        <span className="badge active" style={{ fontSize: '0.7rem', background: '#e0f2fe', color: '#0369a1' }}>POLIZA DE SEGURO VIGENTE</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="fade-in">
                                    <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '15px', marginBottom: '2rem', borderLeft: '5px solid var(--primary)' }}>
                                        <h4 style={{ margin: '0 0 5px', color: 'var(--secondary)' }}>{selectedLoan.socio}</h4>
                                        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                            Plan de pagos generado para <strong>{selectedLoan.tipo}</strong> por un monto de <strong>{selectedLoan.monto}</strong> a una tasa de <strong>{selectedLoan.tasa}</strong>.
                                        </p>
                                    </div>

                                    <div style={{ height: '400px', overflowY: 'auto', border: '1px solid var(--border)', borderRadius: '12px' }}>
                                        <table className="premium-table">
                                            <thead style={{ position: 'sticky', top: 0, zIndex: 1, background: '#fafafa' }}>
                                                <tr>
                                                    <th>N°</th>
                                                    <th>Vencimiento</th>
                                                    <th style={{ textAlign: 'right' }}>Capital</th>
                                                    <th style={{ textAlign: 'right' }}>Interés</th>
                                                    <th style={{ textAlign: 'right' }}>Total (Bs.)</th>
                                                    <th style={{ textAlign: 'center' }}>Estado</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {Array.from({ length: selectedLoan.cuotasTotales }).map((_, i) => {
                                                    const cuotaNum = i + 1;
                                                    const isPaid = cuotaNum <= selectedLoan.cuotasPagadas;
                                                    return (
                                                        <tr key={i} style={{ opacity: isPaid ? 0.6 : 1, background: isPaid ? '#f8fafc' : 'white' }}>
                                                            <td style={{ fontWeight: 700 }}>#{cuotaNum.toString().padStart(3, '0')}</td>
                                                            <td style={{ fontSize: '0.85rem' }}>{`${15}/${((i % 12) + 1).toString().padStart(2, '0')}/${2024 + Math.floor(i / 12)}`}</td>
                                                            <td style={{ textAlign: 'right' }}>Bs. {(parseFloat(selectedLoan.monto.replace(/[^\d.]/g, '')) / selectedLoan.cuotasTotales).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                                            <td style={{ textAlign: 'right' }}>Bs. 120,00</td>
                                                            <td style={{ textAlign: 'right', fontWeight: 800 }}>Bs. 1.450,00</td>
                                                            <td style={{ textAlign: 'center' }}>
                                                                <span className={`badge ${isPaid ? 'activo' : 'inactive'}`} style={{ fontSize: '0.65rem', padding: '4px 8px' }}>
                                                                    {isPaid ? 'CANCELADO' : 'PENDIENTE'}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>

                        <footer className="modal-footer no-print">
                            <button className="btn" style={{ background: '#f1f5f9', border: '1px solid #e2e8f0' }} onClick={closeActionModal}>Cerrar Detalle</button>
                            {actionModal === 'detail' && (
                                <button className="btn btn-primary" onClick={() => setActionModal('plan')}>
                                    Ver Plan Completo <ChevronRight size={18} />
                                </button>
                            )}
                        </footer>
                    </div>
                </div>,
                document.body
            )}

            {/* DESEMBOLSO PROCESSING MODAL */}
            {isDesembolsoModalOpen && selectedRequest && createPortal(
                <div className="modal-overlay" onClick={() => setIsDesembolsoModalOpen(false)}>
                    <div className="modal-content" style={{ maxWidth: '600px' }} onClick={e => e.stopPropagation()}>
                        <header className="modal-header">
                            <h2>Procesar Desembolso de Crédito</h2>
                            <button className="close-btn" onClick={() => setIsDesembolsoModalOpen(false)}><X size={20} /></button>
                        </header>
                        <div className="modal-body">
                            <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '15px', border: '1px solid #e2e8f0', marginBottom: '2rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                    <span style={{ color: '#64748b' }}>Solicitud ID:</span>
                                    <strong style={{ color: 'var(--secondary)' }}>{selectedRequest.id}</strong>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                    <span style={{ color: '#64748b' }}>Socio Beneficiario:</span>
                                    <strong style={{ color: 'var(--secondary)' }}>{selectedRequest.socio}</strong>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                    <span style={{ color: '#64748b' }}>Monto a Desembolsar:</span>
                                    <strong style={{ color: 'var(--primary)', fontSize: '1.4rem' }}>{selectedRequest.monto}</strong>
                                </div>
                                <hr style={{ border: 'none', borderTop: '1px dashed #cbd5e1', margin: '1rem 0' }} />
                                <div className="info-grid">
                                    <div>
                                        <span style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>Producto</span>
                                        <strong>{selectedRequest.tipo}</strong>
                                    </div>
                                    <div>
                                        <span style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>Plazo</span>
                                        <strong>{selectedRequest.plazo}</strong>
                                    </div>
                                    <div>
                                        <span style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>Sucursal Origen</span>
                                        <strong>{selectedRequest.sucursal}</strong>
                                    </div>
                                    <div>
                                        <span style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>Check de Auditoría</span>
                                        <span className="badge active">APROBADO</span>
                                    </div>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Método de Desembolso</label>
                                <select className="form-control">
                                    <option>Abono en Cuenta de Ahorros SISCON</option>
                                    <option>Pago por Ventanilla (Efectivo)</option>
                                    <option>Transferencia Electrónica Interbancaria (ACH)</option>
                                </select>
                            </div>
                            <p style={{ fontSize: '0.85rem', color: '#64748b', fontStyle: 'italic', marginTop: '1rem' }}>
                                Al procesar, el sistema generará automáticamente el comprobante contable de egreso y actualizará la cartera del socio.
                            </p>
                        </div>
                        <footer className="modal-footer">
                            <button className="btn" onClick={() => setIsDesembolsoModalOpen(false)}>Cancelar</button>
                            <button className="btn btn-primary" onClick={handleDesembolsar} style={{ minWidth: '200px' }}>
                                <CheckCircle size={18} /> Confirmar y Procesar
                            </button>
                        </footer>
                    </div>
                </div>,
                document.body
            )}

            {/* SUCCESS FEEDBACK MODAL */}
            {showSuccessModal && createPortal(
                <div className="modal-overlay" onClick={() => setShowSuccessModal(false)}>
                    <div className="modal-content" style={{ maxWidth: '400px', textAlign: 'center', padding: '3rem 2rem' }} onClick={e => e.stopPropagation()}>
                        <div style={{ color: 'var(--primary)', marginBottom: '1.5rem' }}>
                            <CheckCircle size={80} style={{ margin: '0 auto' }} />
                        </div>
                        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--secondary)', marginBottom: '0.5rem' }}>Registro Exitoso</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '2rem' }}>
                            {successMessage}
                        </p>
                        <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => setShowSuccessModal(false)}>
                            Entendido
                        </button>
                    </div>
                </div>,
                document.body
            )}

            <style>{`
                .search-item-hover:hover { background: #f8fafc !important; }
            `}</style>
        </div>
    );
};

const PrestamosList = ({ onOpenRequest, onOpenDetail, onOpenPlan }: { onOpenRequest: () => void, onOpenDetail: (loan: any) => void, onOpenPlan: (loan: any) => void }) => (
    <div className="card">
        <div className="table-actions" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', gap: '1rem' }}>
            <div className="search-bar" style={{ flex: 1 }}>
                <Search className="search-icon" size={20} />
                <input
                    type="text"
                    placeholder="Buscar por socio o # de préstamo..."
                />
            </div>
            <button className="btn btn-primary" style={{ minWidth: '180px' }} onClick={onOpenRequest}>
                <Plus size={20} /> Nueva Solicitud
            </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
            <table className="premium-table">
                <thead>
                    <tr>
                        <th>Titular / Socio</th>
                        <th>Monto Original</th>
                        <th>Plazo</th>
                        <th>Tipo Préstamo</th>
                        <th>Estado</th>
                        <th style={{ textAlign: 'right' }}>Saldo SISCON</th>
                        <th style={{ textAlign: 'center' }}>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {MOCK_DATA.prestamos.map(p => (
                        <tr key={p.id}>
                            <td>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span style={{ fontWeight: 700, color: 'var(--secondary)' }}>{p.socio}</span>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Cód: #SIS-{p.id}00-BT</span>
                                </div>
                            </td>
                            <td style={{ color: 'var(--dompet-blue)', fontWeight: 800 }}>{p.monto}</td>
                            <td><span style={{ fontWeight: 600 }}>{p.plazo}</span></td>
                            <td><span style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 500 }}>{p.tipo}</span></td>
                            <td>
                                <span className={`badge ${p.estado.toLowerCase()}`}>{p.estado}</span>
                            </td>
                            <td style={{ fontWeight: 800, textAlign: 'right', color: 'var(--primary-dark)' }}>{p.saldo}</td>
                            <td>
                                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                                    <button className="icon-btn hover-teal" title="Ver detalle" onClick={() => onOpenDetail(p)}><FileText size={18} /></button>
                                    <button className="icon-btn hover-blue" title="Plan de pagos" onClick={() => onOpenPlan(p)}><Calculator size={18} /></button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

const DesembolsosList = ({ onOpenDesembolso }: { onOpenDesembolso: (req: any) => void }) => (
    <div className="card">
        <div className="table-actions" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', gap: '1rem' }}>
            <div className="search-bar" style={{ flex: 1 }}>
                <Search className="search-icon" size={20} />
                <input
                    type="text"
                    placeholder="Filtrar solicitudes por nombre de socio..."
                />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#64748b', fontSize: '0.9rem' }}>
                <Filter size={18} /> <strong>4 Solicitudes Vigentes</strong> para Desembolso
            </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
            <table className="premium-table">
                <thead>
                    <tr>
                        <th>ID Solicitud</th>
                        <th>Socio / Beneficiario</th>
                        <th>Monto Aprobado</th>
                        <th>Tipo Crédito</th>
                        <th>Plazo</th>
                        <th>Sucursal</th>
                        <th>Usuario Registro</th>
                        <th style={{ textAlign: 'center' }}>Acción</th>
                    </tr>
                </thead>
                <tbody>
                    {MOCK_SOLICITUDES_PENDIENTES.map(req => (
                        <tr key={req.id}>
                            <td><code style={{ background: '#f1f5f9', padding: '4px 8px', borderRadius: '6px', color: 'var(--secondary)', fontWeight: 700 }}>{req.id}</code></td>
                            <td>
                                <div style={{ fontWeight: 700, color: 'var(--secondary)' }}>{req.socio}</div>
                                <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Solicitado el: {req.fecha}</div>
                            </td>
                            <td style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '1rem' }}>{req.monto}</td>
                            <td><span style={{ color: '#64748b', fontSize: '0.85rem' }}>{req.tipo}</span></td>
                            <td><span style={{ fontWeight: 600 }}>{req.plazo}</span></td>
                            <td><span style={{ fontSize: '0.85rem' }}>{req.sucursal}</span></td>
                            <td>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <div className="avatar" style={{ width: '24px', height: '24px', fontSize: '0.65rem' }}>{req.registradoPor.split(' ').map((n: string) => n[0]).join('')}</div>
                                    <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{req.registradoPor}</span>
                                </div>
                            </td>
                            <td style={{ textAlign: 'center' }}>
                                <button className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.8rem' }} onClick={() => onOpenDesembolso(req)}>
                                    <Landmark size={14} /> Desembolsar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

const SimuladorCredito = () => {
    const [monto, setMonto] = useState(15000);
    const [plazo, setPlazo] = useState(24);
    const [showResult, setShowResult] = useState(false);

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            <div className="card">
                <h3 style={{ marginBottom: '1.5rem', fontSize: '1.3rem', fontWeight: 800 }}>Parámetros de Crédito</h3>
                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.9rem' }}>Monto Solicitado (Bs.)</label>
                    <input
                        type="number"
                        value={monto}
                        onChange={(e) => setMonto(Number(e.target.value))}
                        style={{ width: '100%', padding: '0.9rem', borderRadius: '12px', border: '1px solid var(--border)', background: '#f8fafc', fontWeight: 700, fontSize: '1.1rem' }}
                    />
                </div>
                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.9rem' }}>Plazo de Amortización (Meses)</label>
                    <input
                        type="number"
                        value={plazo}
                        onChange={(e) => setPlazo(Number(e.target.value))}
                        style={{ width: '100%', padding: '0.9rem', borderRadius: '12px', border: '1px solid var(--border)', background: '#f8fafc', fontWeight: 700 }}
                    />
                </div>
                <div style={{ marginBottom: '2rem' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.9rem' }}>Producto Financiero</label>
                    <select style={{ width: '100%', padding: '0.9rem', borderRadius: '12px', border: '1px solid var(--border)', background: '#f8fafc', fontWeight: 600 }}>
                        <option>Crédito de Consumo (9.5% TEA)</option>
                        <option>Microcrédito Productivo (8.0% TEA)</option>
                        <option>Crédito Hipotecario (6.5% TEA)</option>
                        <option>Crédito Estudiantil (5.0% TEA)</option>
                    </select>
                </div>
                <button className="btn btn-primary" style={{ width: '100%', padding: '1.2rem' }} onClick={() => setShowResult(true)}>
                    <Calculator size={22} /> Generar Cronograma Proyectado
                </button>
            </div>

            <div className="card">
                <h3 style={{ marginBottom: '1.5rem', fontSize: '1.3rem', fontWeight: 800 }}>Proyección de Cuotas</h3>
                {!showResult ? (
                    <div style={{ textAlign: 'center', padding: '5rem 2rem', color: '#94a3b8' }}>
                        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                            <Calculator size={40} style={{ opacity: 0.3 }} />
                        </div>
                        <p style={{ fontWeight: 500 }}>Configure los parámetros y genere el cálculo para visualizar el cronograma detallado.</p>
                    </div>
                ) : (
                    <div className="fade-in">
                        <div style={{ background: 'var(--primary)', color: 'white', padding: '1.5rem', borderRadius: '15px', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <span style={{ display: 'block', fontSize: '0.8rem', opacity: 0.8 }}>Cuota Mensual Estimada</span>
                                <h2 style={{ margin: 0 }}>Bs. {((monto / plazo) + (monto * 0.01)).toLocaleString()}</h2>
                            </div>
                            <PlayCircle size={40} />
                        </div>
                        <div style={{ overflowX: 'auto' }}>
                            <table className="premium-table">
                                <thead>
                                    <tr>
                                        <th>N°</th>
                                        <th>Capital</th>
                                        <th>Interés</th>
                                        <th>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[1, 2, 3, 4, 5, 6].map(i => (
                                        <tr key={i}>
                                            <td style={{ fontWeight: 700 }}>#00{i}</td>
                                            <td>Bs. {(monto / plazo).toLocaleString()}</td>
                                            <td>Bs. {(monto * 0.01).toLocaleString()}</td>
                                            <td style={{ fontWeight: 800, color: 'var(--secondary)' }}>Bs. {((monto / plazo) + (monto * 0.01)).toLocaleString()}</td>
                                        </tr>
                                    ))}
                                    <tr>
                                        <td colSpan={4} style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.8rem', padding: '1rem' }}>... proyectando {plazo} periodos ...</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Prestamos;
