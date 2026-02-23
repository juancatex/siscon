import React, { useState, useMemo } from 'react';
import {
    FileText, Download, PieChart as ChartIcon, Plus, Save,
    Settings, List, ArrowLeftRight, FileCode, CheckCircle,
    Calendar, User, DollarSign, Search, Eye, Filter, X, Printer, ShieldCheck
} from 'lucide-react';
import { createPortal } from 'react-dom';

const Contabilidad: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'estados' | 'asientos' | 'plan' | 'automaticos'>('estados');
    const [isAsientoModalOpen, setIsAsientoModalOpen] = useState(false);
    const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
    const [viewAsientoDetail, setViewAsientoDetail] = useState<any>(null);
    const [newAccCode, setNewAccCode] = useState('');
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    // Estado para Asiento Libre Dinámico
    const [asientoRows, setAsientoRows] = useState([
        { cuenta: '', debe: 0, haber: 0 },
        { cuenta: '', debe: 0, haber: 0 }
    ]);

    // Mock para Asientos de Préstamos (Generados automáticamente desde el módulo de préstamos)
    const asientosPrestamos = [
        { id: 'AS-001', fecha: '23/02/2026', glosa: 'Desembolso Préstamo #PR-100 - Juan Pérez', monto: 'Bs. 25.000,00', tipo: 'Automatico', modulo: 'Préstamos' },
        { id: 'AS-002', fecha: '22/02/2026', glosa: 'Cobro de Cuota #1 - Préstamo #PR-085', monto: 'Bs. 1.450,00', tipo: 'Automatico', modulo: 'Recaudaciones' },
        { id: 'AS-003', fecha: '20/02/2026', glosa: 'Provisión Mensual de Intereses - Cartera Vigente', monto: 'Bs. 12.400,00', tipo: 'Automatico', modulo: 'Cartera' },
    ];

    const planCuentas = [
        { cod: '100.00', nombre: 'ACTIVO', tipo: 'Grupo' },
        { cod: '110.00', nombre: 'DISPONIBILIDADES', tipo: 'Subgrupo' },
        { cod: '111.01', nombre: 'Caja Moneda Nacional', tipo: 'Cuenta' },
        { cod: '120.00', nombre: 'CARTERA DE CRÉDITOS', tipo: 'Subgrupo' },
        { cod: '121.01', nombre: 'Cartera Vigente - Consumo', tipo: 'Cuenta' },
        { cod: '121.02', nombre: 'Cartera Vigente - Microcrédito', tipo: 'Cuenta' },
        { cod: '131.01', nombre: 'Cuentas por Cobrar Socios', tipo: 'Cuenta' },
    ];

    // Solo las que permiten movimientos (tipo 'Cuenta')
    const cuentasOperativas = useMemo(() => planCuentas.filter(c => c.tipo === 'Cuenta'), [planCuentas]);

    const totals = useMemo(() => {
        return asientoRows.reduce((acc, row) => ({
            debe: acc.debe + (Number(row.debe) || 0),
            haber: acc.haber + (Number(row.haber) || 0)
        }), { debe: 0, haber: 0 });
    }, [asientoRows]);

    const isBalanced = totals.debe === totals.haber && totals.debe > 0;

    return (
        <div className="contabilidad-container fade-in">
            <header className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <div>
                    <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Módulo Contable SISCON</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Gestión financiera, asientos automáticos y plan de cuentas sectorial</p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button className="btn btn-primary" onClick={() => setIsAsientoModalOpen(true)}>
                        <Plus size={20} /> Nuevo Asiento Libre
                    </button>
                    <button className="btn" style={{ background: '#f1f5f9' }}>
                        <Download size={20} /> Reportes Fiscales
                    </button>
                </div>
            </header>

            {/* BARRA DE NAVEGACIÓN INTERNA */}
            <div className="tab-buttons" style={{ display: 'flex', background: '#f8fafc', padding: '8px', borderRadius: '15px', gap: '8px', marginBottom: '2.5rem', border: '1px solid var(--border)' }}>
                <button
                    className={`btn ${activeTab === 'estados' ? 'btn-primary' : ''}`}
                    style={{ background: activeTab === 'estados' ? '' : 'transparent', color: activeTab === 'estados' ? '' : '#64748b', boxShadow: 'none' }}
                    onClick={() => setActiveTab('estados')}
                >
                    <ChartIcon size={18} /> Estados Financieros
                </button>
                <button
                    className={`btn ${activeTab === 'asientos' ? 'btn-primary' : ''}`}
                    style={{ background: activeTab === 'asientos' ? '' : 'transparent', color: activeTab === 'asientos' ? '' : '#64748b', boxShadow: 'none' }}
                    onClick={() => setActiveTab('asientos')}
                >
                    <ArrowLeftRight size={18} /> Libro Diario / Préstamos
                </button>
                <button
                    className={`btn ${activeTab === 'automaticos' ? 'btn-primary' : ''}`}
                    style={{ background: activeTab === 'automaticos' ? '' : 'transparent', color: activeTab === 'automaticos' ? '' : '#64748b', boxShadow: 'none' }}
                    onClick={() => setActiveTab('automaticos')}
                >
                    <FileCode size={18} /> Asientos Automáticos
                </button>
                <button
                    className={`btn ${activeTab === 'plan' ? 'btn-primary' : ''}`}
                    style={{ background: activeTab === 'plan' ? '' : 'transparent', color: activeTab === 'plan' ? '' : '#64748b', boxShadow: 'none' }}
                    onClick={() => setActiveTab('plan')}
                >
                    <Settings size={18} /> Plan de Cuentas
                </button>
            </div>

            {/* CONTENIDO SEGÚN PESTAÑA */}
            {activeTab === 'estados' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }} className="fade-in">
                    <div className="card">
                        <h3 style={{ marginBottom: '1.5rem', fontWeight: 800 }}>Balance General</h3>
                        <table className="premium-table">
                            <thead>
                                <tr><th>Cuenta Contable</th><th style={{ textAlign: 'right' }}>Saldo (Bs.)</th></tr>
                            </thead>
                            <tbody>
                                <tr><td><strong>110.00 DISPONIBILIDADES</strong></td><td style={{ textAlign: 'right', fontWeight: 700 }}>450.200,00</td></tr>
                                <tr><td><strong>120.00 CARTERA DE CRÉDITOS</strong></td><td style={{ textAlign: 'right', fontWeight: 700 }}>3.420.000,00</td></tr>
                                <tr><td><strong>210.00 OBLIGACIONES SOCIOS</strong></td><td style={{ textAlign: 'right', fontWeight: 700 }}>2.150.000,00</td></tr>
                                <tr><td><strong>310.00 CAPITAL SOCIAL</strong></td><td style={{ textAlign: 'right', fontWeight: 700 }}>1.250.000,00</td></tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="card">
                        <h3 style={{ marginBottom: '1.5rem', fontWeight: 800 }}>Estado de Resultados</h3>
                        <table className="premium-table">
                            <tbody>
                                <tr><td>(+) Ingresos por Intereses</td><td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--primary-dark)' }}>125.400,00</td></tr>
                                <tr><td>(+) Comisiones y Otros</td><td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--primary-dark)' }}>12.200,00</td></tr>
                                <tr><td>(-) Gastos Administrativos</td><td style={{ textAlign: 'right', color: '#ef4444' }}>-45.000,00</td></tr>
                                <tr style={{ borderTop: '2px solid' }}><td style={{ fontWeight: 800 }}>Utilidad del Periodo</td><td style={{ textAlign: 'right', fontWeight: 800, color: 'var(--primary-dark)' }}>92.600,00</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'asientos' && (
                <div className="card fade-in">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                        <h3 style={{ margin: 0, fontWeight: 800 }}>Libro Diario Consolidado</h3>
                        <div className="search-bar" style={{ width: '300px' }}>
                            <Search size={18} className="search-icon" />
                            <input type="text" placeholder="Filtrar por glosa o ID..." />
                        </div>
                    </div>
                    <table className="premium-table">
                        <thead>
                            <tr>
                                <th>ID Asiento</th>
                                <th>Fecha</th>
                                <th>Glosa / Descripción de la Operación</th>
                                <th>Monto Total</th>
                                <th>Módulo</th>
                                <th style={{ textAlign: 'center' }}>Detalle</th>
                            </tr>
                        </thead>
                        <tbody>
                            {asientosPrestamos.map(a => (
                                <tr key={a.id}>
                                    <td style={{ fontWeight: 700 }}>{a.id}</td>
                                    <td>{a.fecha}</td>
                                    <td style={{ fontSize: '0.9rem' }}>{a.glosa}</td>
                                    <td style={{ fontWeight: 800, color: 'var(--primary-dark)' }}>{a.monto}</td>
                                    <td><span className="badge active" style={{ fontSize: '0.7rem' }}>{a.modulo}</span></td>
                                    <td style={{ textAlign: 'center' }}>
                                        <button className="icon-btn hover-teal" onClick={() => setViewAsientoDetail(a)}><Eye size={18} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {activeTab === 'plan' && (
                <div className="card fade-in">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                        <h3 style={{ margin: 0, fontWeight: 800 }}>Plan de Cuentas Institucional</h3>
                        <button className="btn btn-primary" onClick={() => setIsPlanModalOpen(true)}><Plus size={18} /> Añadir Cuenta</button>
                    </div>
                    <table className="premium-table">
                        <thead>
                            <tr><th>Código</th><th>Descripción de la Cuenta</th><th>Tipo</th><th style={{ textAlign: 'center' }}>Estado</th></tr>
                        </thead>
                        <tbody>
                            {planCuentas.map(p => (
                                <tr key={p.cod}>
                                    <td style={{ fontWeight: p.tipo !== 'Cuenta' ? 800 : 400 }}>{p.cod}</td>
                                    <td style={{ paddingLeft: p.tipo === 'Cuenta' ? '2.5rem' : p.tipo === 'Subgrupo' ? '1.5rem' : '1rem' }}>{p.nombre}</td>
                                    <td><span style={{ fontSize: '0.8rem', color: '#64748b' }}>{p.tipo}</span></td>
                                    <td style={{ textAlign: 'center' }}><CheckCircle size={16} color="#4ade80" /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {activeTab === 'automaticos' && (
                <div className="fade-in">
                    <div className="card" style={{ marginBottom: '2rem' }}>
                        <h3 style={{ marginBottom: '1.5rem', fontWeight: 800 }}>Configuración de Reglas Automáticas</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                            <div style={{ padding: '1.5rem', background: '#f8fafc', borderRadius: '15px', border: '1px solid var(--border)', position: 'relative' }}>
                                <div style={{ position: 'absolute', top: '15px', right: '15px' }}>
                                    <span className="badge active" style={{ fontSize: '0.7rem' }}>ACTIVO</span>
                                </div>
                                <h4 style={{ color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 10px' }}>
                                    <ShieldCheck size={18} /> Desembolso de Crédito
                                </h4>
                                <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1rem' }}>
                                    Integración con Cartera: Genera asientos en tiempo real al aprobar desembolsos.
                                </p>
                                <div style={{ background: 'white', padding: '10px', borderRadius: '10px', fontSize: '0.8rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}><span>121.01 Cartera</span><strong style={{ color: '#10b981' }}>DEBE</strong></div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>111.01 Caja M/N</span><strong style={{ color: '#ef4444' }}>HABER</strong></div>
                                </div>
                            </div>

                            <div style={{ padding: '1.5rem', background: '#f8fafc', borderRadius: '15px', border: '1px solid var(--border)', position: 'relative' }}>
                                <div style={{ position: 'absolute', top: '15px', right: '15px' }}>
                                    <span className="badge active" style={{ fontSize: '0.7rem' }}>ACTIVO</span>
                                </div>
                                <h4 style={{ color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 10px' }}>
                                    <ShieldCheck size={18} /> Recaudación de Cuotas
                                </h4>
                                <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1rem' }}>
                                    Integración con Caja: Procesa capital e intereses de forma automática.
                                </p>
                                <div style={{ background: 'white', padding: '10px', borderRadius: '10px', fontSize: '0.8rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}><span>111.01 Caja M/N</span><strong style={{ color: '#10b981' }}>DEBE</strong></div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>121.01 / 511.01</span><strong style={{ color: '#ef4444' }}>HABER</strong></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ margin: 0, fontWeight: 800 }}>Historial de Asientos Generados por Módulo</h3>
                            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Últimas 24 horas</span>
                        </div>
                        <table className="premium-table">
                            <thead style={{ background: '#f8fafc' }}>
                                <tr>
                                    <th>Ref. Operativa</th>
                                    <th>Módulo</th>
                                    <th>Glosa Automática</th>
                                    <th style={{ textAlign: 'right' }}>Monto Bs.</th>
                                    <th style={{ textAlign: 'center' }}>Voucher</th>
                                </tr>
                            </thead>
                            <tbody>
                                {asientosPrestamos.map(a => (
                                    <tr key={`auto-${a.id}`}>
                                        <td><code style={{ background: '#e0f2fe', padding: '2px 6px', borderRadius: '4px', color: '#0369a1' }}>#{a.id}</code></td>
                                        <td><span style={{ fontWeight: 600 }}>{a.modulo}</span></td>
                                        <td style={{ fontSize: '0.85rem' }}>{a.glosa}</td>
                                        <td style={{ textAlign: 'right', fontWeight: 700 }}>{a.monto}</td>
                                        <td style={{ textAlign: 'center' }}>
                                            <button
                                                className="btn btn-primary"
                                                style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                                                onClick={() => setViewAsientoDetail(a)}
                                            >
                                                <Eye size={14} /> Ver Asiento
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* MODAL NUEVO ASIENTO LIBRE DINÁMICO */}
            {isAsientoModalOpen && createPortal(
                <div className="modal-overlay" onClick={() => setIsAsientoModalOpen(false)}>
                    <div className="modal-content" style={{ width: '95%', maxWidth: '1000px', maxHeight: '95vh', display: 'flex', flexDirection: 'column' }} onClick={e => e.stopPropagation()}>
                        <header className="modal-header">
                            <div>
                                <h2 style={{ margin: 0 }}>Nuevo Asiento Contable Manual</h2>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Registre movimientos manuales con validación de partida doble.</p>
                            </div>
                            <button className="close-btn" onClick={() => setIsAsientoModalOpen(false)}><X size={20} /></button>
                        </header>
                        <div className="modal-body" style={{ flex: 1, overflowY: 'auto', padding: '1.5rem 2rem' }}>
                            <div className="info-grid" style={{ marginBottom: '2rem' }}>
                                <div className="form-group"><label>Fecha Valor</label><input type="date" className="form-control" defaultValue="2026-02-23" /></div>
                                <div className="form-group">
                                    <label>Tipo de Diario</label>
                                    <select className="form-control">
                                        <option>Diario General (AS)</option>
                                        <option>Ingreso de Caja (CI)</option>
                                        <option>Egreso de Caja (CE)</option>
                                    </select>
                                </div>
                                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                    <label>Glosa o Descripción del Asiento</label>
                                    <input type="text" className="form-control" placeholder="Ej: Registro de aportes extraordinarios - Socio #45" />
                                </div>
                            </div>

                            <div style={{
                                background: '#f8fafc',
                                padding: '1rem',
                                borderRadius: '20px',
                                border: '1px solid #e2e8f0',
                                overflowX: 'auto' // Permite scroll horizontal solo si la pantalla es muy pequeña
                            }}>
                                <table className="premium-table" style={{ margin: 0, minWidth: '700px' }}>
                                    <thead>
                                        <tr>
                                            <th style={{ width: '40%' }}>Selección de Cuenta Contable</th>
                                            <th style={{ textAlign: 'right', width: '20%' }}>Debe (Bs.)</th>
                                            <th style={{ textAlign: 'right', width: '20%' }}>Haber (Bs.)</th>
                                            <th style={{ textAlign: 'center', width: '10%' }}>Acción</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {asientoRows.map((row, idx) => (
                                            <tr key={idx}>
                                                <td style={{ position: 'relative' }}>
                                                    <div className="search-bar" style={{ width: '100%', background: 'white' }}>
                                                        <Search size={14} className="search-icon" />
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            placeholder="Buscar código o nombre..."
                                                            value={row.cuenta}
                                                            onChange={(e) => {
                                                                const newRows = [...asientoRows];
                                                                newRows[idx].cuenta = e.target.value;
                                                                setAsientoRows(newRows);
                                                            }}
                                                            style={{ paddingLeft: '35px' }}
                                                        />
                                                    </div>
                                                    {row.cuenta && !cuentasOperativas.find(c => c.cod === row.cuenta) && (
                                                        <div style={{
                                                            position: 'absolute',
                                                            top: '100%',
                                                            left: 0,
                                                            right: 0,
                                                            background: 'white',
                                                            zIndex: 100,
                                                            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                                                            borderRadius: '0 0 10px 10px',
                                                            maxHeight: '200px',
                                                            overflowY: 'auto',
                                                            border: '1px solid #e2e8f0'
                                                        }}>
                                                            {cuentasOperativas
                                                                .filter(c => c.cod.includes(row.cuenta) || c.nombre.toLowerCase().includes(row.cuenta.toLowerCase()))
                                                                .map(c => (
                                                                    <div
                                                                        key={c.cod}
                                                                        style={{ padding: '10px 15px', cursor: 'pointer', borderBottom: '1px solid #f1f5f9' }}
                                                                        onMouseDown={() => {
                                                                            const newRows = [...asientoRows];
                                                                            newRows[idx].cuenta = c.cod;
                                                                            setAsientoRows(newRows);
                                                                        }}
                                                                        onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                                                                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                                                    >
                                                                        <strong>{c.cod}</strong> - {c.nombre}
                                                                    </div>
                                                                ))
                                                            }
                                                        </div>
                                                    )}
                                                </td>
                                                <td>
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        value={row.debe || ''}
                                                        onChange={(e) => {
                                                            const val = parseFloat(e.target.value) || 0;
                                                            const newRows = [...asientoRows];
                                                            newRows[idx].debe = val;
                                                            if (val > 0) newRows[idx].haber = 0;
                                                            setAsientoRows(newRows);
                                                        }}
                                                        disabled={row.haber > 0}
                                                        style={{ textAlign: 'right', background: row.haber > 0 ? '#f1f5f9' : 'white' }}
                                                        placeholder="0.00"
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        value={row.haber || ''}
                                                        onChange={(e) => {
                                                            const val = parseFloat(e.target.value) || 0;
                                                            const newRows = [...asientoRows];
                                                            newRows[idx].haber = val;
                                                            if (val > 0) newRows[idx].debe = 0;
                                                            setAsientoRows(newRows);
                                                        }}
                                                        disabled={row.debe > 0}
                                                        style={{ textAlign: 'right', background: row.debe > 0 ? '#f1f5f9' : 'white' }}
                                                        placeholder="0.00"
                                                    />
                                                </td>
                                                <td style={{ textAlign: 'center' }}>
                                                    <button
                                                        className="icon-btn hover-teal"
                                                        style={{ color: '#ef4444' }}
                                                        onClick={() => {
                                                            if (asientoRows.length > 2) {
                                                                setAsientoRows(asientoRows.filter((_, i) => i !== idx));
                                                            }
                                                        }}
                                                    >
                                                        <X size={18} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot>
                                        <tr style={{ background: '#f1f5f9' }}>
                                            <td style={{ fontWeight: 800, padding: '15px' }}>
                                                <button
                                                    className="btn"
                                                    style={{ background: 'white', padding: '6px 12px', fontSize: '0.8rem' }}
                                                    onClick={() => setAsientoRows([...asientoRows, { cuenta: '', debe: 0, haber: 0 }])}
                                                >
                                                    <Plus size={14} /> Añadir Línea
                                                </button>
                                            </td>
                                            <td style={{ textAlign: 'right', fontWeight: 900, color: 'var(--primary)', fontSize: '1.1rem' }}>
                                                {totals.debe.toLocaleString('es-BO', { minimumFractionDigits: 2 })}
                                            </td>
                                            <td style={{ textAlign: 'right', fontWeight: 900, color: 'var(--primary)', fontSize: '1.1rem' }}>
                                                {totals.haber.toLocaleString('es-BO', { minimumFractionDigits: 2 })}
                                            </td>
                                            <td></td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>

                            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                                {!isBalanced && totals.debe > 0 && (
                                    <div style={{ color: '#ef4444', fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '5px' }}>
                                        <X size={16} /> El asiento no está cuadrado. Diferencia: Bs. {Math.abs(totals.debe - totals.haber).toFixed(2)}
                                    </div>
                                )}
                                {isBalanced && (
                                    <div style={{ color: '#10b981', fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '5px' }}>
                                        <CheckCircle size={16} /> Partida Doble Verificada.
                                    </div>
                                )}
                            </div>
                        </div>
                        <footer className="modal-footer">
                            <button className="btn" onClick={() => setIsAsientoModalOpen(false)}>Cancelar</button>
                            <button
                                className="btn btn-primary"
                                disabled={!isBalanced}
                                onClick={() => {
                                    setIsAsientoModalOpen(false);
                                    setAsientoRows([{ cuenta: '', debe: 0, haber: 0 }, { cuenta: '', debe: 0, haber: 0 }]);
                                    setShowSuccessModal(true);
                                }}
                            >
                                <Save size={18} /> Registrar y Validar Asiento
                            </button>
                        </footer>
                    </div>
                </div>,
                document.body
            )}

            {/* MODAL NUEVA CUENTA (PLAN DE CUENTAS) */}
            {isPlanModalOpen && createPortal(
                <div className="modal-overlay" onClick={() => setIsPlanModalOpen(false)}>
                    <div className="modal-content" style={{ maxWidth: '600px' }} onClick={e => e.stopPropagation()}>
                        <header className="modal-header">
                            <div>
                                <h2 style={{ margin: 0 }}>Añadir Nueva Cuenta Contable</h2>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '5px 0 0' }}>Siga el estándar sectorial para entidades financieras.</p>
                            </div>
                            <button className="close-btn" onClick={() => setIsPlanModalOpen(false)}><X size={20} /></button>
                        </header>
                        <div className="modal-body">
                            <div className="info-grid">
                                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                    <label>Código Contable</label>
                                    <div style={{ position: 'relative' }}>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Ej: 111.01.02"
                                            value={newAccCode}
                                            onChange={(e) => setNewAccCode(e.target.value)}
                                        />
                                        {newAccCode && (
                                            <div style={{
                                                position: 'absolute',
                                                right: '15px',
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                fontSize: '0.75rem',
                                                fontWeight: 800,
                                                color: 'var(--primary)',
                                                background: '#e0f2fe',
                                                padding: '2px 8px',
                                                borderRadius: '10px'
                                            }}>
                                                Nivel {newAccCode.split('.').length} Detected
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                    <label>Nombre de la Cuenta / Descripción</label>
                                    <input type="text" className="form-control" placeholder="Ej: Banco Central de Bolivia M/N" />
                                </div>
                                <div className="form-group">
                                    <label>Tipo de Cuenta</label>
                                    <select className="form-control" value={newAccCode.startsWith('1') ? 'ACTIVO' : newAccCode.startsWith('2') ? 'PASIVO' : ''}>
                                        <option value="">Seleccione...</option>
                                        <option value="ACTIVO">ACTIVO (1)</option>
                                        <option value="PASIVO">PASIVO (2)</option>
                                        <option value="PATRIMONIO">PATRIMONIO (3)</option>
                                        <option value="INGRESOS">INGRESOS (5)</option>
                                        <option value="GASTOS">GASTOS (4)</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Atributo / Jerarquía</label>
                                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                        <span className={`badge ${newAccCode.includes('.') && newAccCode.split('.').length > 2 ? 'active' : ''}`} style={{ opacity: newAccCode.split('.').length > 2 ? 1 : 0.3 }}>CUENTA</span>
                                        <span className={`badge ${!newAccCode.includes('.') || newAccCode.split('.').length <= 2 ? 'active' : ''}`} style={{ opacity: newAccCode.split('.').length <= 2 ? 1 : 0.3 }}>GRUPO</span>
                                    </div>
                                </div>
                            </div>

                            <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#f8fafc', borderRadius: '15px', border: '1px solid #e2e8f0' }}>
                                <h4 style={{ margin: '0 0 10px', fontSize: '0.9rem', color: 'var(--secondary)' }}>Inteligencia de Nivelación Contable:</h4>
                                <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.85rem', color: '#64748b' }}>
                                    {newAccCode.split('.').length === 1 && <li>La cuenta se creará como un <strong>Rubro Principal</strong>.</li>}
                                    {newAccCode.split('.').length === 2 && <li>Se detectó como <strong>Grupo / Subgrupo</strong> del nivel superior.</li>}
                                    {newAccCode.split('.').length >= 3 && <li>Se registrará como <strong>Cuenta de Detalles</strong> (Permite asientos).</li>}
                                    <li>Dependencia automática: <strong>{newAccCode.substring(0, newAccCode.lastIndexOf('.')) || 'Raíz (Nivel 0)'}</strong></li>
                                </ul>
                            </div>
                        </div>
                        <footer className="modal-footer">
                            <button className="btn" onClick={() => setIsPlanModalOpen(false)}>Descartar</button>
                            <button className="btn btn-primary" onClick={() => {
                                // Aquí iría la lógica de guardado
                                setIsPlanModalOpen(false);
                                setNewAccCode('');
                            }}>
                                <Save size={18} /> Confirmar y Crear en Plan
                            </button>
                        </footer>
                    </div>
                </div>,
                document.body
            )}

            {/* MODAL DETALLE DE ASIENTO MODERNO (VOUCHER INSTITUCIONAL) */}
            {viewAsientoDetail && createPortal(
                <div className="modal-overlay" onClick={() => setViewAsientoDetail(null)}>
                    <div className="modal-content" style={{ maxWidth: '750px', padding: 0, borderRadius: '24px', overflow: 'hidden' }} onClick={e => e.stopPropagation()}>
                        <header style={{
                            background: 'linear-gradient(135deg, var(--secondary) 0%, #1e293b 100%)',
                            padding: '2.5rem',
                            color: 'white',
                            position: 'relative'
                        }}>
                            <div style={{ position: 'absolute', top: '20px', right: '20px', display: 'flex', gap: '10px' }}>
                                <button className="icon-btn" style={{ color: 'white', background: 'rgba(255,255,255,0.1)' }} onClick={() => window.print()}><Printer size={18} /></button>
                                <button className="icon-btn" style={{ color: 'white', background: 'rgba(255,255,255,0.1)' }} onClick={() => setViewAsientoDetail(null)}><X size={20} /></button>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                <div>
                                    <span style={{
                                        background: 'rgba(57, 108, 240, 0.2)',
                                        color: '#60a5fa',
                                        padding: '4px 12px',
                                        borderRadius: '20px',
                                        fontSize: '0.75rem',
                                        fontWeight: 700,
                                        letterSpacing: '1px',
                                        textTransform: 'uppercase',
                                        marginBottom: '10px',
                                        display: 'inline-block',
                                        border: '1px solid rgba(96, 165, 250, 0.3)'
                                    }}>
                                        {viewAsientoDetail.tipo === 'Automatico' ? 'Generado por Sistema' : 'Asiento Manual'}
                                    </span>
                                    <h2 style={{ margin: 0, fontSize: '2rem', fontWeight: 800 }}>Comprobante de Diario</h2>
                                    <p style={{ margin: '5px 0 0', opacity: 0.7, fontSize: '1rem' }}>ID Operación: <span style={{ color: 'white', fontWeight: 700 }}>{viewAsientoDetail.id}</span></p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#4ade80', fontWeight: 700, marginBottom: '5px' }}>
                                        <CheckCircle size={18} /> CONTABILIZADO
                                    </div>
                                    <p style={{ margin: 0, opacity: 0.6, fontSize: '0.85rem' }}>SISCON Financiero v3.0</p>
                                </div>
                            </div>
                        </header>

                        <div className="modal-body" style={{ padding: '2.5rem' }}>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(3, 1fr)',
                                gap: '2rem',
                                marginBottom: '2.5rem',
                                padding: '1.5rem',
                                background: '#f8fafc',
                                borderRadius: '20px',
                                border: '1px solid #e2e8f0'
                            }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Fecha Valor</label>
                                    <strong style={{ fontSize: '1.1rem', color: 'var(--secondary)' }}>{viewAsientoDetail.fecha}</strong>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Monto Total</label>
                                    <strong style={{ fontSize: '1.1rem', color: 'var(--primary)' }}>{viewAsientoDetail.monto}</strong>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Módulo Origen</label>
                                    <strong style={{ fontSize: '1.1rem', color: 'var(--secondary)' }}>{viewAsientoDetail.modulo}</strong>
                                </div>
                            </div>

                            <div style={{ marginBottom: '2.5rem' }}>
                                <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>Concepto del Asiento (Glosa)</label>
                                <div style={{
                                    padding: '1.2rem',
                                    background: 'white',
                                    borderRadius: '12px',
                                    borderLeft: '4px solid var(--primary)',
                                    fontSize: '1rem',
                                    lineHeight: '1.5',
                                    color: '#475569',
                                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
                                }}>
                                    {viewAsientoDetail.glosa}
                                </div>
                            </div>

                            <div style={{ overflow: 'hidden', borderRadius: '15px', border: '1px solid #e2e8f0' }}>
                                <table className="premium-table" style={{ margin: 0 }}>
                                    <thead style={{ background: '#f1f5f9' }}>
                                        <tr>
                                            <th style={{ padding: '15px' }}>Código y Descripción de Cuenta</th>
                                            <th style={{ textAlign: 'right', padding: '15px' }}>Debe (Bs.)</th>
                                            <th style={{ textAlign: 'right', padding: '15px' }}>Haber (Bs.)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td style={{ padding: '18px 15px' }}>
                                                <div style={{ fontWeight: 700, color: 'var(--secondary)' }}>121.01</div>
                                                <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Cartera de Consumo Vigente</div>
                                            </td>
                                            <td style={{ textAlign: 'right', fontWeight: 700, fontSize: '1rem' }}>25.000,00</td>
                                            <td style={{ textAlign: 'right', color: '#cbd5e1' }}>0,00</td>
                                        </tr>
                                        <tr>
                                            <td style={{ padding: '18px 15px' }}>
                                                <div style={{ fontWeight: 700, color: 'var(--secondary)' }}>111.01</div>
                                                <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Caja Moneda Nacional</div>
                                            </td>
                                            <td style={{ textAlign: 'right', color: '#cbd5e1' }}>0,00</td>
                                            <td style={{ textAlign: 'right', fontWeight: 700, fontSize: '1rem' }}>25.000,00</td>
                                        </tr>
                                    </tbody>
                                    <tfoot style={{ background: '#f8fafc', borderTop: '2px solid #e2e8f0' }}>
                                        <tr>
                                            <td style={{ padding: '15px', fontWeight: 800, color: 'var(--secondary)', textTransform: 'uppercase', fontSize: '0.85rem' }}>Totales Comprobante</td>
                                            <td style={{ textAlign: 'right', fontWeight: 900, color: 'var(--primary)', fontSize: '1.1rem', padding: '15px' }}>25.000,00</td>
                                            <td style={{ textAlign: 'right', fontWeight: 900, color: 'var(--primary)', fontSize: '1.1rem', padding: '15px' }}>25.000,00</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>

                            <div style={{
                                marginTop: '2.5rem',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '1rem 0',
                                borderTop: '1px dashed #e2e8f0'
                            }}>
                                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                                    <p style={{ margin: 0 }}>Generado por: <strong>SISTEMA-AUTOMATIC</strong></p>
                                    <p style={{ margin: 0 }}>Fecha Registro: 23/02/2026 15:45</p>
                                </div>
                                <div style={{ opacity: 0.3, fontWeight: 900, fontSize: '1.5rem', letterSpacing: '5px' }}>
                                    SISCON
                                </div>
                            </div>
                        </div>
                        <footer className="modal-footer" style={{ borderTop: 'none', padding: '0 2.5rem 2.5rem' }}>
                            <button className="btn btn-primary" style={{ width: '100%', height: '50px', fontSize: '1rem' }} onClick={() => setViewAsientoDetail(null)}>
                                Confirmar y Cerrar Vista
                            </button>
                        </footer>
                    </div>
                </div>,
                document.body
            )}

            {/* SUCCESS FEEDBACK MODAL (AS IN LOANS MODULE) */}
            {showSuccessModal && createPortal(
                <div className="modal-overlay" onClick={() => setShowSuccessModal(false)}>
                    <div className="modal-content" style={{ maxWidth: '400px', textAlign: 'center', padding: '3rem 2rem' }} onClick={e => e.stopPropagation()}>
                        <div style={{ color: 'var(--primary)', marginBottom: '1.5rem' }}>
                            <CheckCircle size={80} style={{ margin: '0 auto' }} />
                        </div>
                        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--secondary)', marginBottom: '0.5rem' }}>Registro Exitoso</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '2rem' }}>
                            El asiento contable ha sido validado y guardado exitosamente en el Libro Diario.
                        </p>
                        <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => setShowSuccessModal(false)}>
                            Entendido
                        </button>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default Contabilidad;
