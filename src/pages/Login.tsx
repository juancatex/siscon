import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, ChevronRight, DollarSign, Landmark, Briefcase } from 'lucide-react';

const Login: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => {
            navigate('/dashboard');
        }, 1500);
    };

    return (
        <div className="login-container" style={{
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #001F3F 0%, #001021 100%)',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* DECORATIVE BACKGROUND ELEMENTS */}
            <div className="floating-icons" style={{ position: 'absolute', width: '100%', height: '100%', pointerEvents: 'none', overflow: 'hidden' }}>
                <DollarSign size={80} style={{ position: 'absolute', top: '10%', left: '5%', opacity: 0.05, color: 'var(--primary)' }} />
                <Landmark size={120} style={{ position: 'absolute', bottom: '15%', right: '8%', opacity: 0.05, color: 'var(--primary)' }} />
                <Briefcase size={60} style={{ position: 'absolute', top: '20%', right: '15%', opacity: 0.05, color: 'var(--primary)' }} />
            </div>

            <div className="login-card card" style={{
                width: '100%',
                maxWidth: '450px',
                padding: '3rem',
                textAlign: 'center',
                zIndex: 10
            }}>
                <div className="logo-section" style={{ justifyContent: 'center', marginBottom: '2rem', padding: 0 }}>
                    <div className="logo-icon" style={{ width: '50px', height: '50px', fontSize: '1.8rem' }}>S</div>
                    <div className="logo-text" style={{ fontSize: '1.5rem' }}>SISCON <span style={{ fontSize: '0.9rem' }}>FINANCIERO</span></div>
                </div>

                <h2 style={{ marginBottom: '0.5rem', fontWeight: 800 }}>Bienvenido de nuevo</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem' }}>Ingrese sus credenciales para acceder al sistema</p>

                <form onSubmit={handleLogin}>
                    <div className="form-group" style={{ textAlign: 'left' }}>
                        <label>Usuario / Correo</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                            <input
                                type="text"
                                className="form-control"
                                style={{ paddingLeft: '3rem' }}
                                placeholder="usuario_siscon"
                                defaultValue="admin_demo"
                            />
                        </div>
                    </div>

                    <div className="form-group" style={{ textAlign: 'left' }}>
                        <label>Contraseña</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                            <input
                                type="password"
                                className="form-control"
                                style={{ paddingLeft: '3rem' }}
                                placeholder="••••••••"
                                defaultValue="password123"
                            />
                        </div>
                    </div>

                    <div style={{ textAlign: 'right', marginBottom: '2rem' }}>
                        <a href="#" style={{ color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none' }}>¿Olvidó su contraseña?</a>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%', padding: '1.2rem', gap: '15px' }}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Autenticando...' : (
                            <>Acceder al Sistema <ChevronRight size={20} /></>
                        )}
                    </button>
                </form>

                <div style={{ marginTop: '2.5rem', color: '#cbd5e1', fontSize: '0.8rem' }}>
                    &copy; 2024 SISCON Financiero - Todos los derechos reservados.
                </div>
            </div>
        </div>
    );
};

export default Login;
