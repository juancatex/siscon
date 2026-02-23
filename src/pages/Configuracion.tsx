import React, { useState } from 'react';
import {
    Settings, Shield, Landmark, Bell, Database, Globe,
    Smartphone, Save, CheckCircle, Info, User, Mail,
    DollarSign, Percent, Calendar, Layers
} from 'lucide-react';

const Configuracion: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'general' | 'seguridad' | 'financiero' | 'notificaciones'>('general');
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        }, 1500);
    };

    return (
        <div className="configuracion-container fade-in">
            <header className="page-header" style={{ marginBottom: '2.5rem' }}>
                <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Configuración del Sistema</h1>
                <p style={{ color: 'var(--text-muted)' }}>Gestione los parámetros globales, seguridad y políticas financieras de SISCON.</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '2rem' }}>
                {/* Menú Lateral de Configuración */}
                <aside>
                    <div className="card" style={{ padding: '1rem', borderRadius: '20px' }}>
                        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <ConfigMenuItem
                                active={activeTab === 'general'}
                                onClick={() => setActiveTab('general')}
                                icon={<Settings size={20} />}
                                label="General"
                                description="Información de la institución"
                            />
                            <ConfigMenuItem
                                active={activeTab === 'financiero'}
                                onClick={() => setActiveTab('financiero')}
                                icon={<Landmark size={20} />}
                                label="Finanzas"
                                description="Tasas y políticas de crédito"
                            />
                            <ConfigMenuItem
                                active={activeTab === 'seguridad'}
                                onClick={() => setActiveTab('seguridad')}
                                icon={<Shield size={20} />}
                                label="Seguridad"
                                description="Roles y acceso al sistema"
                            />
                            <ConfigMenuItem
                                active={activeTab === 'notificaciones'}
                                onClick={() => setActiveTab('notificaciones')}
                                icon={<Bell size={20} />}
                                label="Notificaciones"
                                description="Alertas y comunicación"
                            />
                        </nav>
                    </div>

                    <div className="card" style={{ marginTop: '1.5rem', background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)', color: 'white', border: 'none' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                            <Info size={20} />
                            <strong style={{ fontSize: '0.9rem' }}>Versión del Core</strong>
                        </div>
                        <p style={{ fontSize: '0.8rem', opacity: 0.9, margin: 0 }}>SISCON Enterprise v3.0.4<br />Última actualización: 23 Feb 2026</p>
                    </div>
                </aside>

                {/* Contenido de Configuración */}
                <div className="card" style={{ borderRadius: '24px', padding: '2.5rem' }}>
                    {activeTab === 'general' && <GeneralConfig />}
                    {activeTab === 'financiero' && <FinanzasConfig />}
                    {activeTab === 'seguridad' && <SeguridadConfig />}
                    {activeTab === 'notificaciones' && <NotificacionesConfig />}

                    <div style={{
                        marginTop: '3rem',
                        paddingTop: '2rem',
                        borderTop: '1px solid #e2e8f0',
                        display: 'flex',
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                        gap: '20px'
                    }}>
                        {showSuccess && (
                            <div style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
                                <CheckCircle size={20} /> Cambios guardados correctamente
                            </div>
                        )}
                        <button
                            className="btn btn-primary"
                            style={{ height: '48px', padding: '0 2.5rem', fontSize: '1rem' }}
                            onClick={handleSave}
                            disabled={isSaving}
                        >
                            <Save size={20} /> {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

/* COMPONENTES INTERNOS */

const ConfigMenuItem = ({ active, icon, label, description, onClick }: any) => (
    <div
        onClick={onClick}
        style={{
            padding: '12px 16px',
            borderRadius: '12px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
            transition: 'all 0.2s ease',
            background: active ? 'rgba(57, 108, 240, 0.08)' : 'transparent',
            color: active ? 'var(--primary)' : '#64748b'
        }}
        className="config-menu-item"
    >
        <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: active ? 'var(--primary)' : '#f1f5f9',
            color: active ? 'white' : '#64748b',
            transition: 'all 0.2s ease'
        }}>
            {icon}
        </div>
        <div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{label}</div>
            <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>{description}</div>
        </div>
    </div>
);

const GeneralConfig = () => (
    <div className="fade-in">
        <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Settings className="text-primary" /> Parámetros Institucionales
        </h3>
        <div className="info-grid">
            <div className="form-group">
                <label>Nombre de la Institución</label>
                <div style={{ position: 'relative' }}>
                    <Landmark size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input type="text" className="form-control" style={{ paddingLeft: '3rem' }} defaultValue="Cooperativa de Ahorro y Crédito SISCON R.L." />
                </div>
            </div>
            <div className="form-group">
                <label>NIT / Registro Fiscal</label>
                <input type="text" className="form-control" defaultValue="1020304050" />
            </div>
        </div>
        <div className="info-grid" style={{ marginTop: '1rem' }}>
            <div className="form-group">
                <label>Correo Institucional</label>
                <div style={{ position: 'relative' }}>
                    <Mail size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input type="email" className="form-control" style={{ paddingLeft: '3rem' }} defaultValue="contacto@siscon-rl.com" />
                </div>
            </div>
            <div className="form-group">
                <label>Web Oficial</label>
                <div style={{ position: 'relative' }}>
                    <Globe size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input type="text" className="form-control" style={{ paddingLeft: '3rem' }} defaultValue="www.siscon-rl.com" />
                </div>
            </div>
        </div>
        <div className="form-group" style={{ marginTop: '1rem' }}>
            <label>Dirección Matriz</label>
            <textarea className="form-control" rows={3} defaultValue="Av. Central #123, Zona Financiera, Edificio SISCON Corporate." />
        </div>
    </div>
);

const FinanzasConfig = () => (
    <div className="fade-in">
        <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <DollarSign className="text-primary" /> Políticas Financieras y Tasas
        </h3>
        <div className="info-grid">
            <div className="form-group">
                <label>Moneda Base del Sistema</label>
                <select className="form-control">
                    <option>Bolivianos (Bs.)</option>
                    <option>Dólares (USD)</option>
                </select>
            </div>
            <div className="form-group">
                <label>Tasa Máxima Mensual (%)</label>
                <input type="number" className="form-control" defaultValue="3.5" />
            </div>
        </div>
        <div className="info-grid" style={{ marginTop: '1.5rem' }}>
            <div className="form-group">
                <label>Día de Cierre Contable</label>
                <div style={{ position: 'relative' }}>
                    <Calendar size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input type="number" className="form-control" style={{ paddingLeft: '3rem' }} defaultValue="28" />
                </div>
            </div>
            <div className="form-group">
                <label>Sanción por Mora (%)</label>
                <div style={{ position: 'relative' }}>
                    <Percent size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input type="number" className="form-control" style={{ paddingLeft: '3rem' }} defaultValue="1.5" />
                </div>
            </div>
        </div>
        <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '15px', marginTop: '1.5rem', border: '1px dashed #cbd5e1' }}>
            <h4 style={{ margin: '0 0 10px', fontSize: '1rem' }}>Sectores Prioritarios</h4>
            <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Configure los sectores que reciben tasas preferenciales de inversión.</p>
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <span className="badge active">AGRICULTURA: 5.0%</span>
                <span className="badge active">VIVIENDA: 6.5%</span>
                <span className="badge active">MICROPRESTAMO: 8.0%</span>
            </div>
        </div>
    </div>
);

const SeguridadConfig = () => (
    <div className="fade-in">
        <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Shield className="text-primary" /> Seguridad y Gestión de Accesos
        </h3>
        <div className="form-group">
            <label>Política de Contraseñas</label>
            <select className="form-control">
                <option>Alta (Mínimo 10 caracteres, Alfanumérico, Símbolos)</option>
                <option>Media (Mínimo 8 caracteres, Alfanumérico)</option>
                <option>Baja (Solo caracteres)</option>
            </select>
        </div>
        <div style={{ marginTop: '2rem' }}>
            <label style={{ display: 'block', marginBottom: '1rem', fontWeight: 700 }}>Roles Activos</label>
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <table className="premium-table" style={{ margin: 0 }}>
                    <thead>
                        <tr>
                            <th>Rol</th>
                            <th>Usuarios</th>
                            <th>Estado</th>
                            <th style={{ textAlign: 'center' }}>Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>Super Administrador</strong></td>
                            <td>2</td>
                            <td><span className="badge active">Activo</span></td>
                            <td style={{ textAlign: 'center' }}><button className="btn" style={{ fontSize: '0.75rem', padding: '4px 10px' }}>Editar Permisos</button></td>
                        </tr>
                        <tr>
                            <td><strong>Oficial de Crédito</strong></td>
                            <td>12</td>
                            <td><span className="badge active">Activo</span></td>
                            <td style={{ textAlign: 'center' }}><button className="btn" style={{ fontSize: '0.75rem', padding: '4px 10px' }}>Editar Permisos</button></td>
                        </tr>
                        <tr>
                            <td><strong>Cajero</strong></td>
                            <td>8</td>
                            <td><span className="badge active">Activo</span></td>
                            <td style={{ textAlign: 'center' }}><button className="btn" style={{ fontSize: '0.75rem', padding: '4px 10px' }}>Editar Permisos</button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
);

const NotificacionesConfig = () => (
    <div className="fade-in">
        <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Bell className="text-primary" /> Canales de Comunicación y Alertas
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <NotificationToggle
                icon={<Smartphone size={24} />}
                title="Sms de Alerta de Cobro"
                desc="Enviar recordatorio automático 3 días antes del vencimiento de cuota."
                enabled={true}
            />
            <NotificationToggle
                icon={<Mail size={24} />}
                title="Extractos Mensuales por Email"
                desc="Envío programado de estados de cuenta a todos los socios activos."
                enabled={true}
            />
            <NotificationToggle
                icon={<Database size={24} />}
                title="Backup de Base de Datos"
                desc="Notificar al administrador sobre el estado de la copia de seguridad diaria."
                enabled={false}
            />
        </div>
    </div>
);

const NotificationToggle = ({ icon, title, desc, enabled }: any) => (
    <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1.5rem',
        background: '#f8fafc',
        borderRadius: '15px',
        border: '1px solid #e2e8f0'
    }}>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <div style={{ color: 'var(--primary)', background: 'white', padding: '12px', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                {icon}
            </div>
            <div>
                <div style={{ fontWeight: 800, fontSize: '1.05rem', marginBottom: '4px' }}>{title}</div>
                <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{desc}</div>
            </div>
        </div>
        <div style={{
            width: '50px',
            height: '26px',
            background: enabled ? 'var(--primary)' : '#cbd5e1',
            borderRadius: '20px',
            position: 'relative',
            cursor: 'pointer'
        }}>
            <div style={{
                width: '18px',
                height: '18px',
                background: 'white',
                borderRadius: '50%',
                position: 'absolute',
                top: '4px',
                left: enabled ? '28px' : '4px',
                transition: 'all 0.3s ease'
            }} />
        </div>
    </div>
);

export default Configuracion;
