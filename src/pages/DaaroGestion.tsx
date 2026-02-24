import React, { useState } from 'react';
import {
    Search, FileText, Download, FileSpreadsheet, Filter,
    Calendar, MapPin, User as UserIcon, Printer, Eye, ChevronRight,
    CheckCircle, ShieldCheck, Banknote, Building2, Receipt, AlertCircle, TrendingUp
} from 'lucide-react';
import { createPortal } from 'react-dom';

const DaaroGestion: React.FC = () => {
    const [filters, setFilters] = useState({
        search: '',
        sucursal: 'Todas',
        usuario: 'Todos',
        fechaDesde: '2024-01-01',
        fechaHasta: new Date().toISOString().split('T')[0]
    });

    const [viewingLiquidation, setViewingLiquidation] = useState<any>(null);
    const [showVoucher, setShowVoucher] = useState<any>(null);

    const [reportData, setReportData] = useState([
        {
            id: 'DAA-2024-0041', socio: 'Carlos Rodríguez', date: '20/03/2024', amount: 185420.50, sucursal: 'Agencia Sur', usuario: 'Admin Demo',
            estado: 'Aprobado', approvals: { boss: true, accounting: true, systems: true },
            breakdown: { aportes: 215000, rendimiento: 9675, prestamos: 32450, hoteleria: 4350, otros: 2454.50 },
            disbursed: false
        },
        {
            id: 'DAA-2024-0040', socio: 'Elena Miranda', date: '15/03/2024', amount: 212300.00, sucursal: 'Matriz Principal', usuario: 'Admin Demo',
            estado: 'Pendiente', approvals: { boss: true, accounting: false, systems: false },
            breakdown: { aportes: 240000, rendimiento: 10800, prestamos: 35000, hoteleria: 3500, otros: 0 },
            disbursed: false
        },
        {
            id: 'DAA-2024-0039', socio: 'Roberto Siles', date: '10/03/2024', amount: 154200.00, sucursal: 'Sucursal Norte', usuario: 'Oficial Crédito',
            estado: 'Aprobado', approvals: { boss: true, accounting: true, systems: true },
            breakdown: { aportes: 180000, rendimiento: 8100, prestamos: 30000, hoteleria: 3500, otros: 400 },
            disbursed: false
        },
        {
            id: 'DAA-2024-0038', socio: 'Juan Pérez', date: '05/03/2024', amount: 295000.00, sucursal: 'Matriz Principal', usuario: 'Admin Demo',
            estado: 'En Revisión', approvals: { boss: true, accounting: true, systems: false },
            breakdown: { aportes: 320000, rendimiento: 14400, prestamos: 35000, hoteleria: 4000, otros: 400 },
            disbursed: false
        }
    ]);

    const handleApprove = (id: string, role: string) => {
        setReportData(prevData => prevData.map(item => {
            if (item.id === id) {
                const newApprovals = { ...item.approvals, [role]: true };
                const allApproved = Object.values(newApprovals).every(v => v);
                return {
                    ...item,
                    approvals: newApprovals,
                    estado: allApproved ? 'Aprobado' : 'En Revisión'
                };
            }
            return item;
        }));
    };

    const handleDisburse = (id: string) => {
        setReportData(prevData => prevData.map(item => {
            if (item.id === id) {
                return { ...item, estado: 'Desembolsado', disbursed: true };
            }
            return item;
        }));
        const item = reportData.find(i => i.id === id);
        setShowVoucher(item);
    };

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('es-BO', { style: 'currency', currency: 'BOB' }).format(val).replace('BOB', 'Bs.');
    };

    return (
        <div className="reportes-container fade-in">
            <header className="page-header" style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h1 style={{ fontSize: '2.2rem', fontWeight: 800, margin: 0 }}>Gestión de Liquidaciones</h1>
                    <p style={{ color: 'var(--text-muted)', margin: 0 }}>Flujo de aprobación multirrol y desembolso de aportes.</p>
                </div>
            </header>

            {/* Filters Bar */}
            <div className="card shadow-sm" style={{ padding: '1.5rem', marginBottom: '2.5rem', borderLeft: '6px solid var(--primary)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1.5fr 100px', gap: '1.5rem', alignItems: 'flex-end' }}>
                    <div className="filter-group">
                        <label className="filter-label"><Search size={14} /> Socio</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Nombre o DNI..."
                            value={filters.search}
                            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                        />
                    </div>
                    <div className="filter-group">
                        <label className="filter-label"><MapPin size={14} /> Sucursal</label>
                        <select className="form-control" value={filters.sucursal} onChange={(e) => setFilters({ ...filters, sucursal: e.target.value })}>
                            <option>Todas</option>
                            <option>Matriz Principal</option>
                            <option>Sucursal Norte</option>
                            <option>Agencia Sur</option>
                        </select>
                    </div>
                    <div className="filter-group">
                        <label className="filter-label"><UserIcon size={14} /> Operador</label>
                        <select className="form-control" value={filters.usuario} onChange={(e) => setFilters({ ...filters, usuario: e.target.value })}>
                            <option>Todos</option>
                            <option>Admin Demo</option>
                            <option>Oficial Crédito</option>
                        </select>
                    </div>
                    <div className="filter-group">
                        <label className="filter-label"><Calendar size={14} /> Rango de Fechas</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <input type="date" className="form-control" value={filters.fechaDesde} readOnly />
                            <span>-</span>
                            <input type="date" className="form-control" value={filters.fechaHasta} readOnly />
                        </div>
                    </div>
                    <button className="btn btn-primary" style={{ padding: '0.8rem' }}><Filter size={20} /></button>
                </div>
            </div>

            {/* Results Table */}
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div className="table-responsive">
                    <table className="premium-table">
                        <thead>
                            <tr>
                                <th>Cod. Operación</th>
                                <th>Socio / Titular</th>
                                <th>Fecha</th>
                                <th style={{ textAlign: 'right' }}>Monto Neto</th>
                                <th style={{ textAlign: 'center' }}>Flujo de Aprobación</th>
                                <th style={{ textAlign: 'center' }}>Estado</th>
                                <th style={{ textAlign: 'center' }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reportData.map((item) => (
                                <tr key={item.id}>
                                    <td style={{ fontWeight: 700, color: 'var(--primary-dark)' }}>{item.id}</td>
                                    <td style={{ fontWeight: 700 }}>{item.socio}</td>
                                    <td>{item.date}</td>
                                    <td style={{ textAlign: 'right', fontWeight: 800 }}>{formatCurrency(item.amount)}</td>
                                    <td style={{ textAlign: 'center' }}>
                                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                            <div title="Jefe de Agencia" style={{ color: item.approvals.boss ? '#10b981' : '#cbd5e1', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                                                <ShieldCheck size={18} />
                                                <span style={{ fontSize: '0.6rem', fontWeight: 700 }}>JEFE</span>
                                            </div>
                                            <div title="Contabilidad" style={{ color: item.approvals.accounting ? '#10b981' : '#cbd5e1', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                                                <ShieldCheck size={18} />
                                                <span style={{ fontSize: '0.6rem', fontWeight: 700 }}>CONT</span>
                                            </div>
                                            <div title="Sistemas" style={{ color: item.approvals.systems ? '#10b981' : '#cbd5e1', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                                                <ShieldCheck size={18} />
                                                <span style={{ fontSize: '0.6rem', fontWeight: 700 }}>SIST</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        <span className={`badge ${item.estado === 'Desembolsado' ? 'activo' : item.estado === 'Aprobado' ? 'active' : 'inactive'}`}>
                                            {item.estado}
                                        </span>
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                            <button className="icon-btn hover-teal" onClick={() => setViewingLiquidation(item)} title="Ver Detalle"><Eye size={16} /></button>

                                            {item.estado === 'Aprobado' && !item.disbursed && (
                                                <button
                                                    className="btn btn-primary"
                                                    style={{ padding: '4px 10px', fontSize: '0.7rem' }}
                                                    onClick={() => handleDisburse(item.id)}
                                                >
                                                    DESEMBOLSAR
                                                </button>
                                            )}

                                            {item.disbursed && (
                                                <button
                                                    className="icon-btn hover-teal"
                                                    onClick={() => setShowVoucher(item)}
                                                    title="Imprimir Comprobante"
                                                >
                                                    <Printer size={16} />
                                                </button>
                                            )}

                                            {!item.approvals.systems && item.estado !== 'Desembolsado' && (
                                                <button
                                                    className="btn"
                                                    style={{ padding: '4px 10px', fontSize: '0.7rem', background: '#f1f5f9' }}
                                                    onClick={() => handleApprove(item.id, !item.approvals.accounting ? 'accounting' : 'systems')}
                                                >
                                                    APROBAR
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* DETAIL MODAL */}
            {viewingLiquidation && createPortal(
                <div className="modal-overlay" onClick={() => setViewingLiquidation(null)}>
                    <div className="modal-content" style={{ maxWidth: '750px', borderRadius: '24px' }} onClick={e => e.stopPropagation()}>
                        <header className="modal-header">
                            <div>
                                <h2 style={{ margin: 0 }}>Detalle de Operación</h2>
                                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>Folio: {viewingLiquidation.id}</p>
                            </div>
                            <button className="close-btn" onClick={() => setViewingLiquidation(null)}><XIcon size={20} /></button>
                        </header>
                        <div className="modal-body" style={{ padding: '2rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2.5rem', padding: '1.5rem', background: '#f8fafc', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
                                <div><label className="info-label">Socio</label><strong className="info-value" style={{ fontSize: '1rem' }}>{viewingLiquidation.socio}</strong></div>
                                <div><label className="info-label">Sucursal</label><strong className="info-value" style={{ fontSize: '1rem' }}>{viewingLiquidation.sucursal}</strong></div>
                                <div><label className="info-label">Fecha</label><strong className="info-value" style={{ fontSize: '1rem' }}>{viewingLiquidation.date}</strong></div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2.5rem' }}>
                                <div>
                                    <h4 style={{ fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <TrendingUp size={18} className="text-primary" /> Beneficios
                                    </h4>
                                    <div style={{ background: '#f0fdf4', padding: '1.2rem', borderRadius: '15px', border: '1px solid #dcfce7' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
                                            <span>Cap. Aportes:</span>
                                            <span style={{ fontWeight: 700 }}>{formatCurrency(viewingLiquidation.breakdown.aportes)}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#166534' }}>
                                            <span>Rendimiento:</span>
                                            <span style={{ fontWeight: 700 }}>+ {formatCurrency(viewingLiquidation.breakdown.rendimiento)}</span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h4 style={{ fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <AlertCircle size={18} style={{ color: '#ef4444' }} /> Compensación
                                    </h4>
                                    <div style={{ background: '#fef2f2', padding: '1.2rem', borderRadius: '15px', border: '1px solid #fee2e2' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
                                            <span>Préstamos Vigentes:</span>
                                            <span style={{ color: '#ef4444' }}>- {formatCurrency(viewingLiquidation.breakdown.prestamos)}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
                                            <span>Servicios Hotelería:</span>
                                            <span style={{ color: '#ef4444' }}>- {formatCurrency(viewingLiquidation.breakdown.hoteleria)}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
                                            <span>Otros Descuentos:</span>
                                            <span style={{ color: '#ef4444' }}>- {formatCurrency(viewingLiquidation.breakdown.otros)}</span>
                                        </div>
                                        <div style={{ height: '1px', background: '#fee2e2', margin: '10px 0' }} />
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, color: '#ef4444' }}>
                                            <span>Total Descuentos:</span>
                                            <span>- {formatCurrency(viewingLiquidation.breakdown.prestamos + viewingLiquidation.breakdown.hoteleria + viewingLiquidation.breakdown.otros)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div style={{ background: 'var(--secondary)', color: 'white', padding: '1.5rem 2rem', borderRadius: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '1.2rem', fontWeight: 700 }}>MONTO NETO:</span>
                                <span style={{ fontSize: '2rem', fontWeight: 900 }}>{formatCurrency(viewingLiquidation.amount)}</span>
                            </div>
                        </div>
                        <footer className="modal-footer">
                            <button className="btn" style={{ background: '#f1f5f9' }} onClick={() => setViewingLiquidation(null)}>Cerrar</button>
                        </footer>
                    </div>
                </div>,
                document.body
            )}

            {/* VOUCHER MODAL */}
            {showVoucher && createPortal(
                <div className="modal-overlay" onClick={() => setShowVoucher(null)}>
                    <div className="modal-content" style={{ maxWidth: '750px', padding: 0, borderRadius: '24px', overflow: 'hidden' }} onClick={e => e.stopPropagation()}>
                        <header style={{ background: 'linear-gradient(135deg, var(--secondary) 0%, #1e293b 100%)', padding: '2.5rem', color: 'white', position: 'relative' }}>
                            <div style={{ position: 'absolute', top: '20px', right: '20px', display: 'flex', gap: '10px' }}>
                                <button className="icon-btn" style={{ color: 'white', background: 'rgba(255,255,255,0.1)' }} onClick={() => window.print()}><Printer size={18} /></button>
                                <button className="icon-btn" style={{ color: 'white', background: 'rgba(255,255,255,0.1)' }} onClick={() => setShowVoucher(null)}><XIcon size={20} /></button>
                            </div>
                            <div>
                                <h2 style={{ margin: 0, fontSize: '2.2rem', fontWeight: 800 }}>Voucher de Desembolso</h2>
                                <p style={{ margin: '5px 0 0', opacity: 0.8 }}>Referencia: {showVoucher.id}</p>
                            </div>
                        </header>
                        <div className="modal-body" style={{ padding: '2.5rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem', marginBottom: '2.5rem' }}>
                                <div><label className="info-label">Beneficiario</label><strong className="info-value">{showVoucher.socio}</strong></div>
                                <div style={{ textAlign: 'right' }}><label className="info-label">Importe</label><strong className="info-value" style={{ fontSize: '1.8rem', color: 'var(--primary)' }}>{formatCurrency(showVoucher.amount)}</strong></div>
                            </div>
                            <div style={{ overflow: 'hidden', borderRadius: '15px', border: '1px solid #e2e8f0' }}>
                                <table className="premium-table" style={{ margin: 0 }}>
                                    <thead style={{ background: '#f1f5f9' }}>
                                        <tr><th>Cuenta Contable</th><th style={{ textAlign: 'right' }}>Debe</th><th style={{ textAlign: 'right' }}>Haber</th></tr>
                                    </thead>
                                    <tbody>
                                        <tr><td>Obligaciones Socios</td><td style={{ textAlign: 'right', fontWeight: 700 }}>{formatCurrency(showVoucher.amount)}</td><td></td></tr>
                                        <tr><td>Caja Moneda Nacional</td><td></td><td style={{ textAlign: 'right', fontWeight: 700 }}>{formatCurrency(showVoucher.amount)}</td></tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            <style>{`
                .filter-label { display: flex; align-items: center; gap: 6px; font-size: 0.75rem; text-transform: uppercase; color: #64748b; font-weight: 700; margin-bottom: 8px; }
                .info-label { font-size: 0.7rem; text-transform: uppercase; color: #94a3b8; fontWeight: 700; margin-bottom: 4px; display: block; }
                .info-value { font-size: 1.1rem; font-weight: 800; color: var(--secondary); margin: 0; }
                .close-btn { background: none; border: none; cursor: pointer; color: #64748b; }
                .text-primary { color: var(--primary); }
            `}</style>
        </div>
    );
};

const XIcon = ({ size }: { size: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);

export default DaaroGestion;
