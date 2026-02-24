import React, { useState } from 'react';
import {
    Search, FileText, Download, FileSpreadsheet, Filter,
    Calendar, MapPin, User as UserIcon, Printer, Eye, ChevronRight,
    TrendingUp, AlertCircle
} from 'lucide-react';
import { createPortal } from 'react-dom';

const DaaroReportes: React.FC = () => {
    const [filters, setFilters] = useState({
        search: '',
        sucursal: 'Todas',
        usuario: 'Todos',
        fechaDesde: '2024-01-01',
        fechaHasta: new Date().toISOString().split('T')[0]
    });

    const [viewingLiquidation, setViewingLiquidation] = useState<any>(null);

    const reportData = [
        {
            id: 'DAA-2024-0041', socio: 'Carlos Rodríguez', date: '20/03/2024', amount: 185420.50, sucursal: 'Agencia Sur', usuario: 'Admin Demo',
            estado: 'Desembolsado',
            breakdown: { aportes: 215000, rendimiento: 9675, prestamos: 32450, hoteleria: 4350, otros: 2454.50 }
        },
        {
            id: 'DAA-2024-0040', socio: 'Elena Miranda', date: '15/03/2024', amount: 212300.00, sucursal: 'Matriz Principal', usuario: 'Admin Demo',
            estado: 'Pendiente',
            breakdown: { aportes: 240000, rendimiento: 10800, prestamos: 35000, hoteleria: 3500, otros: 0 }
        },
        {
            id: 'DAA-2024-0039', socio: 'Roberto Siles', date: '10/03/2024', amount: 154200.00, sucursal: 'Sucursal Norte', usuario: 'Oficial Crédito',
            estado: 'Aprobado',
            breakdown: { aportes: 180000, rendimiento: 8100, prestamos: 30000, hoteleria: 3500, otros: 400 }
        },
        {
            id: 'DAA-2024-0038', socio: 'Juan Pérez', date: '05/03/2024', amount: 295000.00, sucursal: 'Matriz Principal', usuario: 'Admin Demo',
            estado: 'En Revisión',
            breakdown: { aportes: 320000, rendimiento: 14400, prestamos: 35000, hoteleria: 4000, otros: 400 }
        }
    ];

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('es-BO', { style: 'currency', currency: 'BOB' }).format(val).replace('BOB', 'Bs.');
    };

    return (
        <div className="reportes-container fade-in">
            <header className="page-header" style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h1 style={{ fontSize: '2.2rem', fontWeight: 800, margin: 0 }}>Reportes de Liquidación</h1>
                    <p style={{ color: 'var(--text-muted)', margin: 0 }}>Listado consolidado de operaciones DAARO.</p>
                </div>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <button className="btn" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                        <FileSpreadsheet size={20} color="#16a34a" /> Exportar Excel
                    </button>
                    <button className="btn btn-primary">
                        <Download size={20} /> Generar PDF
                    </button>
                </div>
            </header>

            {/* Filters Bar */}
            <div className="card shadow-sm" style={{ padding: '1.5rem', marginBottom: '2.5rem', borderLeft: '6px solid var(--primary)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1.5rem', alignItems: 'flex-end' }}>
                    <div className="filter-group">
                        <label className="filter-label"><Search size={14} /> Buscar Socio</label>
                        <input type="text" className="form-control" placeholder="Nombre o DNI..." />
                    </div>
                    <div className="filter-group">
                        <label className="filter-label"><MapPin size={14} /> Sucursal</label>
                        <select className="form-control">
                            <option>Todas</option>
                            <option>Matriz Principal</option>
                            <option>Sucursal Norte</option>
                            <option>Agencia Sur</option>
                        </select>
                    </div>
                    <div className="filter-group">
                        <label className="filter-label"><Calendar size={14} /> Año de Egreso</label>
                        <input type="number" className="form-control" placeholder="Ej: 2015" />
                    </div>
                    <div className="filter-group">
                        <label className="filter-label"><UserIcon size={14} /> Operador</label>
                        <select className="form-control">
                            <option>Todos</option>
                            <option>Admin Demo</option>
                            <option>Oficial Crédito</option>
                        </select>
                    </div>
                    <div className="filter-group">
                        <label className="filter-label"><Calendar size={14} /> Fecha Op.</label>
                        <input type="date" className="form-control" />
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
                                <th>Socio</th>
                                <th>Sucursal</th>
                                <th>Fecha</th>
                                <th style={{ textAlign: 'right' }}>Monto Neto</th>
                                <th style={{ textAlign: 'center' }}>Estado</th>
                                <th style={{ textAlign: 'center' }}>Detalle</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reportData.map((item) => (
                                <tr key={item.id}>
                                    <td style={{ fontWeight: 700 }}>{item.id}</td>
                                    <td style={{ fontWeight: 700 }}>{item.socio}</td>
                                    <td>{item.sucursal}</td>
                                    <td>{item.date}</td>
                                    <td style={{ textAlign: 'right', fontWeight: 800 }}>{formatCurrency(item.amount)}</td>
                                    <td style={{ textAlign: 'center' }}>
                                        <span className={`badge ${item.estado === 'Desembolsado' ? 'activo' : 'active'}`}>{item.estado}</span>
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        <button className="icon-btn hover-teal" onClick={() => setViewingLiquidation(item)}><Eye size={16} /></button>
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
                                <h2 style={{ margin: 0 }}>Vista Previa de Liquidación</h2>
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
                                <span style={{ fontSize: '1.2rem', fontWeight: 700 }}>MONTO TOTAL NETO:</span>
                                <span style={{ fontSize: '2rem', fontWeight: 900 }}>{formatCurrency(viewingLiquidation.amount)}</span>
                            </div>
                        </div>
                        <footer className="modal-footer">
                            <button className="btn" style={{ background: '#f1f5f9' }} onClick={() => setViewingLiquidation(null)}>Cerrar Reporte</button>
                            <button className="btn btn-primary" onClick={() => window.print()}><Printer size={18} /> Imprimir Copia</button>
                        </footer>
                    </div>
                </div>,
                document.body
            )}

            <style>{`
                .filter-label { display: flex; align-items: center; gap: 6px; font-size: 0.75rem; text-transform: uppercase; color: #64748b; font-weight: 700; margin-bottom: 8px; }
                .info-label { font-size: 0.7rem; text-transform: uppercase; color: #94a3b8; fontWeight: 700; margin-bottom: 4px; display: block; }
                .info-value { font-size: 1.1rem; font-weight: 800; color: var(--secondary); margin: 0; }
                .text-primary { color: var(--primary); }
                .close-btn { background: none; border: none; cursor: pointer; color: #64748b; }
            `}</style>
        </div>
    );
};

const XIcon = ({ size }: { size: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);

export default DaaroReportes;
