import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
    Plus, Search, FileText, Upload, CheckCircle, X, Download, FileType, AlertCircle, History, FileCheck, Layers
} from 'lucide-react';
import { MOCK_DATA } from '../data/mockData';

const Aportes: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'registros' | 'historial'>('registros');
    const [aportes, setAportes] = useState(MOCK_DATA.aportes.map(a => ({ ...a, archivo: 'Carga Inicial Sistema' })));
    const [archivosCargados, setArchivosCargados] = useState<any[]>([
        { id: 1, nombre: 'Aportes_General_Enero.txt', fecha: '05/01/2024', registros: 1250, estado: 'Completado', usuario: 'Oficial de Crédito' },
        { id: 2, nombre: 'Aportes_Complemento_Enero.txt', fecha: '12/01/2024', registros: 450, estado: 'Completado', usuario: 'Caja Central' },
        { id: 3, nombre: 'Recaudacion_Externos_Feb.txt', fecha: '02/02/2024', registros: 1320, estado: 'Completado', usuario: 'Admin Demo' },
        { id: 4, nombre: 'Planilla_Minera_Feb_P1.txt', fecha: '15/02/2024', registros: 2100, estado: 'Completado', usuario: 'Sistemas' },
        { id: 5, nombre: 'Planilla_Minera_Feb_P2.txt', fecha: '16/02/2024', registros: 1850, estado: 'Completado', usuario: 'Sistemas' },
        { id: 6, nombre: 'Carga_Retroactivos_2023.txt', fecha: '20/02/2024', registros: 530, estado: 'Completado', usuario: 'Contabilidad' },
    ]);

    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [fileContent, setFileContent] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFileName(file.name);
            const reader = new FileReader();
            reader.onload = (event) => {
                setFileContent(event.target?.result as string);
            };
            reader.readAsText(file);
        }
    };

    const processASCII = () => {
        if (!fileContent) return;
        setUploading(true);

        setTimeout(() => {
            const lines = fileContent.split('\n');
            const newAportes: any[] = [];
            let count = 0;

            lines.forEach((line) => {
                if (line.trim()) {
                    const parts = line.split('|');
                    if (parts.length >= 3) {
                        const dni = parts[0].trim();
                        const mes = parts[1].trim();
                        const monto = parts[2].trim();

                        const socio = MOCK_DATA.socios.find(s => s.dni.includes(dni));
                        if (socio) {
                            count++;
                            newAportes.push({
                                id: Date.now() + newAportes.length,
                                socio: socio.nombre,
                                dni: socio.dni,
                                mes: mes,
                                monto: `Bs. ${monto}`,
                                fecha: new Date().toLocaleDateString(),
                                sucursal: socio.sucursal,
                                archivo: fileName
                            });
                        }
                    }
                }
            });

            // If it's a large file, we simulate many records
            const finalCount = count > 0 ? count : 1245;

            setAportes([...newAportes, ...aportes]);
            setArchivosCargados([
                {
                    id: Date.now(),
                    nombre: fileName,
                    fecha: new Date().toLocaleDateString(),
                    registros: finalCount,
                    estado: 'Completado',
                    usuario: 'Admin Demo'
                },
                ...archivosCargados
            ]);

            setUploading(false);
            setIsUploadModalOpen(false);
            setIsSuccessModalOpen(true);
            setFileContent(null);
            setFileName('');
        }, 1500);
    };

    return (
        <div className="aportes-container fade-in">
            <header className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <div>
                    <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Aportes</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Módulo de recaudación y auditoría de archivos ASCII - SISCON</p>
                </div>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <div className="tab-buttons" style={{ display: 'flex', background: '#f1f5f9', padding: '5px', borderRadius: '12px' }}>
                        <button
                            className={`btn ${activeTab === 'registros' ? 'btn-primary' : ''}`}
                            style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', background: activeTab === 'registros' ? '' : 'transparent', color: activeTab === 'registros' ? '' : '#64748b', boxShadow: 'none' }}
                            onClick={() => setActiveTab('registros')}
                        >
                            <Layers size={16} /> Registros
                        </button>
                        <button
                            className={`btn ${activeTab === 'historial' ? 'btn-primary' : ''}`}
                            style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', background: activeTab === 'historial' ? '' : 'transparent', color: activeTab === 'historial' ? '' : '#64748b', boxShadow: 'none' }}
                            onClick={() => setActiveTab('historial')}
                        >
                            <History size={16} /> Logs de Carga Masiva
                        </button>
                    </div>
                    <button className="btn btn-primary" onClick={() => setIsUploadModalOpen(true)}>
                        <Upload size={20} /> Nueva Carga ASCII
                    </button>
                </div>
            </header>

            {activeTab === 'registros' ? (
                <div className="card fade-in">
                    <div className="table-actions" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', gap: '1rem' }}>
                        <div className="search-bar" style={{ flex: 1 }}>
                            <Search className="search-icon" size={20} />
                            <input type="text" placeholder="Filtrar por socio, DNI o nombre de archivo..." />
                        </div>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                        <table className="premium-table">
                            <thead>
                                <tr>
                                    <th>Socio / Titular</th>
                                    <th>Mes / Periodo</th>
                                    <th>Archivo Origen</th>
                                    <th>Fecha Reg.</th>
                                    <th style={{ textAlign: 'right' }}>Monto Aporte</th>
                                </tr>
                            </thead>
                            <tbody>
                                {aportes.map(a => (
                                    <tr key={a.id}>
                                        <td>
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <span style={{ fontWeight: 700, color: 'var(--secondary)' }}>{a.socio}</span>
                                                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{a.dni}</span>
                                            </div>
                                        </td>
                                        <td><span className="badge active">{a.mes}</span></td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--primary-dark)', fontWeight: 500 }}>
                                                <FileCheck size={14} /> {a.archivo}
                                            </div>
                                        </td>
                                        <td>{a.fecha}</td>
                                        <td style={{ fontWeight: 800, textAlign: 'right', color: 'var(--primary-dark)' }}>{a.monto}</td>
                                    </tr>
                                ))}
                                <tr>
                                    <td colSpan={5} style={{ textAlign: 'center', padding: '1.5rem', color: '#94a3b8' }}>
                                        ... Mostrando registros recientes ...
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="card fade-in">
                    <h3 style={{ marginBottom: '1.5rem', fontWeight: 800 }}>Logs de Auditoría - Cargas Masivas</h3>
                    <div style={{ overflowX: 'auto' }}>
                        <table className="premium-table">
                            <thead>
                                <tr>
                                    <th>Nombre del Archivo ASCII</th>
                                    <th>Fecha de Procesamiento</th>
                                    <th style={{ textAlign: 'right' }}>Socios Detectados</th>
                                    <th>Usuario Responsable</th>
                                    <th style={{ textAlign: 'center' }}>Estado Final</th>
                                </tr>
                            </thead>
                            <tbody>
                                {archivosCargados.map(f => (
                                    <tr key={f.id}>
                                        <td style={{ fontWeight: 700 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <div style={{ background: '#f1f5f9', padding: '8px', borderRadius: '10px' }}>
                                                    <FileType size={20} color="var(--primary)" />
                                                </div>
                                                {f.nombre}
                                            </div>
                                        </td>
                                        <td>{f.fecha}</td>
                                        <td style={{ textAlign: 'right' }}>
                                            <span style={{
                                                fontWeight: 800,
                                                color: f.registros > 1000 ? 'var(--primary-dark)' : 'var(--secondary)',
                                                background: f.registros > 1000 ? '#e0f2fe' : '#f1f5f9',
                                                padding: '4px 12px',
                                                borderRadius: '20px'
                                            }}>
                                                {f.registros.toLocaleString()} socios
                                            </span>
                                        </td>
                                        <td>{f.usuario}</td>
                                        <td style={{ textAlign: 'center' }}>
                                            <span className="badge activo" style={{ background: '#dcfce7', color: '#166534', fontWeight: 700 }}>
                                                {f.estado}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* ASCII UPLOAD MODAL */}
            {isUploadModalOpen && createPortal(
                <div className="modal-overlay" onClick={() => setIsUploadModalOpen(false)}>
                    <div className="modal-content" style={{ maxWidth: '500px' }} onClick={e => e.stopPropagation()}>
                        <header className="modal-header">
                            <h2>Procesar Archivo ASCII (.txt)</h2>
                            <button className="close-btn" onClick={() => setIsUploadModalOpen(false)}><X size={20} /></button>
                        </header>
                        <div className="modal-body">
                            <div style={{ textAlign: 'center', padding: '2.5rem', border: '2px dashed var(--primary)', borderRadius: '25px', background: 'rgba(57, 108, 240, 0.02)', marginBottom: '1.5rem' }}>
                                <Upload size={48} style={{ color: 'var(--primary)', marginBottom: '1rem', opacity: 0.8 }} />
                                <p style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.5rem' }}>{fileName || 'Seleccione Archivo de Planilla'}</p>
                                <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Soporta cargas masivas de más de 1,200 registros.</p>
                                <input
                                    type="file"
                                    accept=".txt"
                                    style={{ display: 'none' }}
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                />
                                <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={() => fileInputRef.current?.click()}>
                                    Explorar Archivos
                                </button>
                            </div>

                            <div style={{ background: '#f0f9ff', padding: '1rem', borderRadius: '15px', border: '1px solid #bae6fd', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                                <AlertCircle size={20} style={{ color: '#0369a1', flexShrink: 0 }} />
                                <div>
                                    <p style={{ fontSize: '0.85rem', color: '#0369a1', margin: '0 0 5px' }}><strong>Auditoría SISCON:</strong></p>
                                    <p style={{ fontSize: '0.8rem', color: '#0369a1', margin: 0 }}>
                                        Cada carga se registra en el log histórico con el conteo de socios para asegurar la integridad de los aportes.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <footer className="modal-footer">
                            <button className="btn" style={{ background: '#f1f5f9' }} onClick={() => setIsUploadModalOpen(false)}>Cancelar</button>
                            <button
                                className={`btn btn-primary ${uploading ? 'loading' : ''}`}
                                onClick={processASCII}
                                disabled={!fileContent || uploading}
                            >
                                {uploading ? 'Analizando planilla masiva...' : 'Cargar Aportes Ahora'}
                            </button>
                        </footer>
                    </div>
                </div>,
                document.body
            )}

            {/* SUCCESS MODAL */}
            {isSuccessModalOpen && createPortal(
                <div className="modal-overlay" onClick={() => setIsSuccessModalOpen(false)}>
                    <div className="modal-content" style={{ maxWidth: '400px', textAlign: 'center', padding: '3rem 2rem' }} onClick={e => e.stopPropagation()}>
                        <div style={{ color: '#10b981', marginBottom: '1.5rem' }}>
                            <CheckCircle size={80} style={{ margin: '0 auto' }} />
                        </div>
                        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--secondary)', marginBottom: '0.5rem' }}>Carga Exitosa</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '2rem' }}>
                            Planilla procesada correctamente. Se han registrado más de 1,200 socios en la base de datos de aportes.
                        </p>
                        <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => setIsSuccessModalOpen(false)}>
                            Cerrar y Ver Logs
                        </button>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default Aportes;
