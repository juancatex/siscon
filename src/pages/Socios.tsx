import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Search, Plus, Filter, MoreVertical, Eye, Edit, X, Save } from 'lucide-react';
import { MOCK_DATA } from '../data/mockData';

const SociosList: React.FC = () => {
    const [selectedSocio, setSelectedSocio] = useState<any>(null);
    const [modalMode, setModalMode] = useState<'view' | 'edit' | 'create' | null>(null);

    const openModal = (socio: any, mode: 'view' | 'edit' | 'create') => {
        setSelectedSocio(socio);
        setModalMode(mode);
    };

    const closeModal = () => {
        setSelectedSocio(null);
        setModalMode(null);
    };

    return (
        <div className="socios-container fade-in">
            <header className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Gestión de Socios</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Administración y control de la base de socios institucional</p>
                </div>
                <button className="btn btn-primary" onClick={() => openModal({}, 'create')}>
                    <Plus size={20} /> Nuevo Socio
                </button>
            </header>

            <div className="card">
                <div className="table-actions" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', gap: '1rem' }}>
                    <div className="search-bar" style={{ flex: 1 }}>
                        <Search className="search-icon" size={20} />
                        <input
                            type="text"
                            placeholder="Buscar por nombre, DNI o email..."
                        />
                    </div>
                    <button className="btn" style={{ background: 'white', border: '1px solid var(--border)' }}>
                        <Filter size={18} /> Filtros
                    </button>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table className="premium-table">
                        <thead>
                            <tr>
                                <th>Socio</th>
                                <th>DNI / Identificación</th>
                                <th>Sucursal Base</th>
                                <th style={{ textAlign: 'right' }}>Ahorro Total</th>
                                <th>Estado</th>
                                <th style={{ textAlign: 'center' }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {MOCK_DATA.socios.map(socio => (
                                <tr key={socio.id}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                            <div className="avatar">{socio.img}</div>
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <span style={{ fontWeight: 700, color: 'var(--secondary)' }}>{socio.nombre}</span>
                                                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{socio.email}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ fontWeight: 600 }}>{socio.dni}</td>
                                    <td>
                                        <span style={{ fontSize: '0.85rem', fontWeight: 500, color: '#64748b' }}>{socio.sucursal}</span>
                                    </td>
                                    <td style={{ fontWeight: 800, textAlign: 'right', color: 'var(--primary-dark)' }}>
                                        {socio.ahorro}
                                    </td>
                                    <td>
                                        <span className={`badge ${socio.estado.toLowerCase()}`}>
                                            {socio.estado}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                                            <button className="icon-btn hover-teal" title="Ver Detalle" onClick={() => openModal(socio, 'view')}><Eye size={18} /></button>
                                            <button className="icon-btn hover-blue" title="Editar" onClick={() => openModal(socio, 'edit')}><Edit size={18} /></button>
                                            <button className="icon-btn" title="Más opciones"><MoreVertical size={18} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MODAL SYSTEM WITH PORTAL */}
            {modalMode && createPortal(
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <header className="modal-header">
                            <h2>
                                {modalMode === 'view' && 'Detalles del Socio'}
                                {modalMode === 'edit' && 'Editar Información'}
                                {modalMode === 'create' && 'Registrar Nuevo Socio'}
                            </h2>
                            <button className="close-btn" onClick={closeModal}><X size={20} /></button>
                        </header>

                        <div className="modal-body">
                            {modalMode === 'view' && selectedSocio && (
                                <div className="fade-in">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '2rem', background: '#f8fafc', padding: '1.5rem', borderRadius: '20px' }}>
                                        <div style={{ width: '100px', height: '100px', background: 'var(--primary)', color: 'white', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 800 }}>
                                            {selectedSocio.img}
                                        </div>
                                        <div>
                                            <h3 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--secondary)' }}>{selectedSocio.nombre}</h3>
                                            <span style={{ color: 'var(--primary)', fontWeight: 700 }}>ID SOCIO: #{selectedSocio.id}00245</span>
                                            <div style={{ marginTop: '0.5rem' }}>
                                                <span className={`badge ${selectedSocio.estado.toLowerCase()}`}>{selectedSocio.estado}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="info-grid">
                                        <InfoItem label="DNI / Cédula" value={selectedSocio.dni} />
                                        <InfoItem label="Email" value={selectedSocio.email} />
                                        <InfoItem label="Teléfono" value="+593 098 765 4321" />
                                        <InfoItem label="Sucursal" value={selectedSocio.sucursal} />
                                        <InfoItem label="Fecha Registro" value="12/10/2023" />
                                        <InfoItem label="Ahorro Acumulado" value={selectedSocio.ahorro} />
                                    </div>

                                    <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#fff9f0', borderRadius: '15px', border: '1px solid #ffe8cc' }}>
                                        <h4 style={{ margin: '0 0 0.5rem', color: '#e67e22' }}>Resumen Crediticio</h4>
                                        <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>Socio con calificación A+. No presenta deudas vencidas a la fecha.</p>
                                    </div>
                                </div>
                            )}

                            {(modalMode === 'edit' || modalMode === 'create') && (
                                <form className="fade-in" onSubmit={e => e.preventDefault()}>
                                    <div className="info-grid">
                                        <div className="form-group">
                                            <label>Nombre Completo</label>
                                            <input type="text" className="form-control" defaultValue={selectedSocio?.nombre || ''} placeholder="Ej: Juan Pérez" />
                                        </div>
                                        <div className="form-group">
                                            <label>DNI / Identificación</label>
                                            <input type="text" className="form-control" defaultValue={selectedSocio?.dni || ''} placeholder="0000000000" />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Correo Electrónico</label>
                                        <input type="email" className="form-control" defaultValue={selectedSocio?.email || ''} placeholder="usuario@ejemplo.com" />
                                    </div>
                                    <div className="info-grid">
                                        <div className="form-group">
                                            <label>Sucursal Base</label>
                                            <select className="form-control" defaultValue={selectedSocio?.sucursal || 'Matriz Principal'}>
                                                <option>Matriz Principal</option>
                                                <option>Sucursal Norte</option>
                                                <option>Agencia Sur</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label>Tipo de Socio</label>
                                            <select className="form-control">
                                                <option>Individual</option>
                                                <option>Corporativo</option>
                                                <option>Juvenil</option>
                                            </select>
                                        </div>
                                    </div>
                                </form>
                            )}
                        </div>

                        <footer className="modal-footer">
                            <button className="btn" style={{ background: '#f1f5f9' }} onClick={closeModal}>
                                {modalMode === 'view' ? 'Cerrar' : 'Cancelar'}
                            </button>
                            {(modalMode === 'edit' || modalMode === 'create') && (
                                <button className="btn btn-primary" onClick={closeModal}>
                                    <Save size={18} /> {modalMode === 'create' ? 'Crear Socio' : 'Guardar Cambios'}
                                </button>
                            )}
                            {modalMode === 'view' && (
                                <button className="btn btn-primary" onClick={() => setModalMode('edit')}>
                                    <Edit size={18} /> Editar Socio
                                </button>
                            )}
                        </footer>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

const InfoItem = ({ label, value }: { label: string, value: string }) => (
    <div className="info-item">
        <span className="info-label">{label}</span>
        <span className="info-value">{value}</span>
    </div>
);

export default SociosList;
