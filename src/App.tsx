import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/Layout';
import Dashboard from './pages/Dashboard';
import SociosList from './pages/Socios';
import Login from './pages/Login';
import Contabilidad from './pages/Contabilidad';
import Prestamos from './pages/Prestamos';
import Aportes from './pages/Aportes';
import Configuracion from './pages/Configuracion';
import Daaro from './pages/Daaro';
import DaaroGestion from './pages/DaaroGestion';
import DaaroReportes from './pages/DaaroReportes';
import './styles/globals.css';

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                {/* Redirección inicial a Login */}
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<Login />} />

                {/* Usamos el path /dashboard como base */}
                <Route path="/dashboard" element={<AppLayout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="socios" element={<SociosList />} />
                    <Route path="prestamos" element={<Prestamos />} />
                    <Route path="aportes" element={<Aportes />} />
                    <Route path="contabilidad" element={<Contabilidad />} />
                    <Route path="daaro" element={<Daaro />} />
                    <Route path="daaro/gestion" element={<DaaroGestion />} />
                    <Route path="daaro/reportes" element={<DaaroReportes />} />
                    <Route path="settings" element={<Configuracion />} />
                    <Route path="support" element={<div className="card fade-in"><h3>Soporte</h3><p>Centro de ayuda y soporte técnico.</p></div>} />
                </Route>

                {/* Todas las rutas no encontradas van a Login */}
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </Router>
    );
};

export default App;
