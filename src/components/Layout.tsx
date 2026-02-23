import React, { useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
    Home, Users, Briefcase, FileText, Settings, HelpCircle, LogOut, Landmark, ChevronDown, Bell, Search, Menu, X
} from 'lucide-react';
import { MOCK_DATA } from '../data/mockData';

const Sidebar: React.FC<{ isOpen: boolean, toggle: () => void }> = ({ isOpen, toggle }) => {
    const navigate = useNavigate();

    return (
        <aside className={`sidebar ${isOpen ? 'show' : ''}`} style={{ transform: isOpen ? 'translateX(0)' : '' }}>
            <div className="logo-section">
                <div className="logo-icon">S</div>
                <div className="logo-text">SISCON <span>FINANCIERO</span></div>
                <button className="mobile-only" onClick={toggle} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#888' }}>
                    <X size={24} />
                </button>
            </div>

            <nav className="nav-menu">
                <SidebarItem icon={<Home size={22} />} label="Dashboard" to="/dashboard" onClick={toggle} />
                <SidebarItem icon={<Users size={22} />} label="Gestión de Socios" to="/dashboard/socios" onClick={toggle} />
                <SidebarItem icon={<Briefcase size={22} />} label="Préstamos" to="/dashboard/prestamos" onClick={toggle} />
                <SidebarItem icon={<FileText size={22} />} label="Aportes" to="/dashboard/aportes" onClick={toggle} />
                <SidebarItem icon={<Landmark size={22} />} label="Contabilidad" to="/dashboard/contabilidad" onClick={toggle} />

                <div className="nav-separator">Administración</div>
                <SidebarItem icon={<Settings size={22} />} label="Configuración" to="/dashboard/settings" onClick={toggle} />
                <SidebarItem icon={<HelpCircle size={22} />} label="Soporte" to="/dashboard/support" onClick={toggle} />
            </nav>

            <div className="sidebar-footer">
                <button className="logout-btn" onClick={() => navigate('/login')}>
                    <LogOut size={20} />
                    <span>Cerrar Sesión</span>
                </button>
            </div>
        </aside>
    );
};

const SidebarItem = ({ icon, label, to, onClick }: { icon: any, label: string, to: string, onClick?: () => void }) => (
    <NavLink
        to={to}
        end={to === '/dashboard'}
        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        onClick={onClick}
    >
        {icon}
        <span>{label}</span>
    </NavLink>
);

const AppLayout: React.FC = () => {
    const [selectedBranch, setSelectedBranch] = useState(MOCK_DATA.sucursales[0]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation();

    const handleBranchChange = (branch: any) => {
        setSelectedBranch(branch);
        localStorage.setItem('demo_branch_code', branch.codigo);
        window.dispatchEvent(new Event('branchChanged'));
    };

    return (
        <div className="app-layout">
            <Sidebar isOpen={isSidebarOpen} toggle={() => setIsSidebarOpen(false)} />

            {isSidebarOpen && (
                <div
                    onClick={() => setIsSidebarOpen(false)}
                    style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 999 }}
                />
            )}

            <main className="main-content">
                <header className="top-bar">
                    <button
                        className="mobile-toggle"
                        onClick={() => setIsSidebarOpen(true)}
                        style={{ background: 'none', border: 'none', color: 'var(--secondary)', padding: '8px', cursor: 'pointer', display: 'none' }}
                    >
                        <Menu size={28} />
                    </button>

                    <div className="search-bar">
                        <Search className="search-icon" size={20} />
                        <input type="text" placeholder="Buscar socio, préstamo o documento..." />
                    </div>

                    <div className="top-bar-right">
                        <div className="branch-selector">
                            <span className="branch-label">Sucursal:</span>
                            <div className="dropdown">
                                <button className="dropdown-toggle">
                                    {selectedBranch.nombre} <ChevronDown size={14} />
                                </button>
                                <div className="dropdown-menu">
                                    {MOCK_DATA.sucursales.map(s => (
                                        <div key={s.id} className="dropdown-item" onClick={() => handleBranchChange(s)}>
                                            {s.nombre}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="top-bar-actions">
                            <div className="notification-bell">
                                <Bell size={22} />
                                <span className="badge-count">3</span>
                            </div>
                        </div>

                        <div className="user-profile">
                            <div className="avatar">AD</div>
                            <div className="user-info">
                                <span className="username">Admin Demo</span>
                                <span className="role" style={{ display: 'block' }}>Senior Architect</span>
                            </div>
                        </div>
                    </div>
                </header>

                <style>{`
          @media (max-width: 1024px) {
            .mobile-toggle { display: block !important; }
            .sidebar { transform: translateX(-100%); }
            .sidebar.show { transform: translateX(0); }
            .main-content { margin-left: 0 !important; width: 100% !important; }
            .mobile-only { display: block !important; }
          }
          @media (min-width: 1025px) {
            .mobile-only { display: none !important; }
          }
        `}</style>

                <div className="page-content fade-in" key={location.pathname}>
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AppLayout;
