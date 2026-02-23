import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, BarChart2, Zap, Globe, Menu, X } from 'lucide-react';

const LandingPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="landing-container">
            <nav className="landing-nav">
                <div className="logo-section">
                    <div className="logo-icon">S</div>
                    <span className="logo-text">SIGA <span>FINANCIERO</span></span>
                </div>
                <div className="nav-links">
                    <a href="#features">Soluciones</a>
                    <a href="#about">Nosotros</a>
                    <a href="#pricing">Precios</a>
                </div>
                <button className="btn btn-primary" onClick={() => navigate('/login')}>Ingresar al Sistema</button>
            </nav>

            <section className="hero-section">
                <div className="hero-content">
                    <span className="hero-badge">Nueva Versión 5.0 - Ya Disponible</span>
                    <h1>Impulse su Cooperativa con <span>Tecnología de Vanguardia</span></h1>
                    <p>SIGA es el Core Financiero SaaS diseñado para transformar la gestión de instituciones financieras, cooperativas de ahorro y crédito, y fintechs locales.</p>
                    <div className="hero-btns">
                        <button className="btn btn-primary large" onClick={() => navigate('/login')}>Demo Interactiva</button>
                        <button className="btn btn-outline large">Ver Planes</button>
                    </div>
                </div>
                <div className="hero-image">
                    {/* Aquí iría un mockup del dashboard */}
                    <div className="mockup-container">
                        <div className="mock-card main"></div>
                        <div className="mock-card side"></div>
                        <div className="mock-card floating"></div>
                    </div>
                </div>
            </section>

            <section id="features" className="features-section">
                <div className="section-header">
                    <h2>Soluciones Integrales</h2>
                    <p>Todo lo que su institución necesita en una sola plataforma cloud.</p>
                </div>
                <div className="features-grid">
                    <FeatureCard
                        icon={<Shield size={32} />}
                        title="Seguridad Bancaria"
                        desc="Encriptación de nivel militar y cumplimiento con normativas locales e internacionales."
                    />
                    <FeatureCard
                        icon={<BarChart2 size={32} />}
                        title="Business Intelligence"
                        desc="Dashboards predictivos y reportes en tiempo real para la toma de decisiones estratégicas."
                    />
                    <FeatureCard
                        icon={<Zap size={32} />}
                        title="Agilidad Operativa"
                        desc="Reduzca el tiempo de colocación de créditos en un 60% mediante procesos automatizados."
                    />
                    <FeatureCard
                        icon={<Globe size={32} />}
                        title="Multi-sucursal Cloud"
                        desc="Administre todas sus agencias de forma centralizada desde cualquier lugar del mundo."
                    />
                </div>
            </section>

            <footer className="landing-footer">
                <div className="footer-content">
                    <div className="footer-brand">
                        <div className="logo-section">
                            <div className="logo-icon">S</div>
                            <span className="logo-text">SIGA <span>FINANCIERO</span></span>
                        </div>
                        <p>Liderando la transformación digital financiera en Latinoamérica.</p>
                    </div>
                    <div className="footer-links">
                        <h4>Producto</h4>
                        <a href="#">Módulos</a>
                        <a href="#">Seguridad</a>
                        <a href="#">API</a>
                    </div>
                    <div className="footer-links">
                        <h4>Empresa</h4>
                        <a href="#">Nosotros</a>
                        <a href="#">Contacto</a>
                        <a href="#">Soporte</a>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>© {new Date().getFullYear()} SIGA Financial Solutions. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

const FeatureCard = ({ icon, title, desc }: { icon: any, title: string, desc: string }) => (
    <div className="card feature-card">
        <div className="feat-icon">{icon}</div>
        <h3>{title}</h3>
        <p>{desc}</p>
    </div>
);

export default LandingPage;
