import React, { useState, useEffect, useMemo } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    Legend, PieChart, Pie, Cell
} from 'recharts';
import { Users, CreditCard, TrendingUp, Landmark, ShieldCheck } from 'lucide-react';
import { MOCK_DATA } from '../data/mockData';

const Dashboard: React.FC = () => {
    const [branchCode, setBranchCode] = useState(localStorage.getItem('demo_branch_code') || 'MAT01');
    const [data, setData] = useState(MOCK_DATA.dashboard[branchCode as keyof typeof MOCK_DATA.dashboard] || MOCK_DATA.dashboard['MAT01']);

    useEffect(() => {
        const handleUpdate = () => {
            const newCode = localStorage.getItem('demo_branch_code') || 'MAT01';
            setBranchCode(newCode);
            setData(MOCK_DATA.dashboard[newCode as keyof typeof MOCK_DATA.dashboard] || MOCK_DATA.dashboard['MAT01']);
        };

        window.addEventListener('branchChanged', handleUpdate);
        return () => window.removeEventListener('branchChanged', handleUpdate);
    }, []);

    // Get unique users from colocaciones data for the bar chart
    const users = useMemo(() => {
        if (!data.colocaciones || data.colocaciones.length === 0) return [];
        const firstEntry = data.colocaciones[0];
        return Object.keys(firstEntry).filter(key => key !== 'name');
    }, [data.colocaciones]);

    const userColors = ['#396CF0', '#2FDE91', '#5C869D', '#FFA500'];

    return (
        <div className="dashboard-container fade-in">
            <header className="page-header" style={{ marginBottom: '2.5rem' }}>
                <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Resumen Ejecutivo SISCON</h1>
                <p style={{ color: 'var(--text-muted)' }}>Métricas financieras institucionales al día de hoy expresadas en Bolivianos (Bs.)</p>
            </header>

            {/* KPI CARDS */}
            <div className="kpi-grid">
                <KPICard icon={<Landmark size={28} />} title={data.kpis[0].title} value={data.kpis[0].value} color="blue" />
                <KPICard icon={<Users size={28} />} title={data.kpis[1].title} value={data.kpis[1].value} color="teal" />
                <KPICard icon={<CreditCard size={28} />} title={data.kpis[2].title} value={data.kpis[2].value} color="purple" />
                <KPICard icon={<TrendingUp size={28} />} title={data.kpis[3].title} value={data.kpis[3].value} color="orange" />
            </div>

            <div className="charts-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem', marginTop: '2rem' }}>
                {/* COLOCACIONES CHART - BY USER */}
                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700 }}>Evolución de Colocaciones por Usuario</h3>
                            <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: '#94a3b8' }}>Producción diaria de oficiales de crédito (Bs.)</p>
                        </div>
                        <span style={{ fontSize: '0.8rem', background: '#f0f9ff', color: '#0369a1', padding: '6px 12px', borderRadius: '20px', fontWeight: 700 }}>Semanal</span>
                    </div>
                    <div style={{ height: '320px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.colocaciones}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <Tooltip
                                    cursor={{ fill: 'rgba(57, 108, 240, 0.05)' }}
                                    formatter={(value) => [`Bs. ${value.toLocaleString()}`, 'Monto']}
                                    contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                                />
                                <Legend verticalAlign="top" height={36} />
                                {users.map((user, index) => (
                                    <Bar
                                        key={user}
                                        dataKey={user}
                                        name={user}
                                        fill={userColors[index % userColors.length]}
                                        radius={[4, 4, 0, 0]}
                                        barSize={20}
                                    />
                                ))}
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* CARTERA PIE CHART - BY LOAN TYPE */}
                <div className="card">
                    <div style={{ marginBottom: '1.5rem' }}>
                        <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700 }}>Distribución de Cartera Ejecutada</h3>
                        <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: '#94a3b8' }}>Concentración por producto financiero activo</p>
                    </div>
                    <div style={{ height: '260px', position: 'relative' }}>
                        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                            <ShieldCheck size={32} color="var(--primary)" style={{ opacity: 0.2 }} />
                            <div style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--secondary)' }}>100%</div>
                            <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase' }}>Auditoría</div>
                        </div>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data.cartera}
                                    innerRadius={80}
                                    outerRadius={105}
                                    paddingAngle={8}
                                    dataKey="value"
                                    strokeWidth={0}
                                >
                                    {data.cartera.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value) => [`${value}%`, 'Distribución']}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px rgba(0,0,0,0.1)' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="legend" style={{ marginTop: '1.5rem' }}>
                        {data.cartera.map(item => (
                            <div key={item.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <span style={{ width: '12px', height: '12px', background: item.color, borderRadius: '4px' }}></span>
                                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>{item.name}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <div className="progress-container" style={{ width: '80px', height: '6px', margin: 0 }}>
                                        <div className="progress-bar" style={{ width: `${item.value}%`, background: item.color }}></div>
                                    </div>
                                    <span style={{ fontWeight: 800, color: 'var(--secondary)', fontSize: '0.85rem', width: '35px', textAlign: 'right' }}>{item.value}%</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* DAARO BY BRANCH (PIE CHART) */}
                <div className="card">
                    <div style={{ marginBottom: '1.5rem' }}>
                        <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700 }}>Liquidaciones DAARO por Sucursal</h3>
                        <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: '#94a3b8' }}>Participación porcentual de cierres por agencia</p>
                    </div>
                    <div style={{ height: '300px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={[
                                        { name: 'Matriz Principal', value: 45, color: '#396CF0' },
                                        { name: 'Sucursal Norte', value: 25, color: '#2FDE91' },
                                        { name: 'Agencia Sur', value: 30, color: '#FFA500' }
                                    ]}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    dataKey="value"
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                >
                                    {['#396CF0', '#2FDE91', '#FFA500'].map((color, index) => (
                                        <Cell key={`cell-${index}`} fill={color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* DAARO BY USER (BAR CHART) */}
                <div className="card">
                    <div style={{ marginBottom: '1.5rem' }}>
                        <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700 }}>Liquidaciones por Operador</h3>
                        <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: '#94a3b8' }}>Volumen de transacciones procesadas</p>
                    </div>
                    <div style={{ height: '300px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                layout="vertical"
                                data={[
                                    { name: 'Admin Demo', qty: 124 },
                                    { name: 'Oficial Crédito', qty: 98 },
                                    { name: 'Cajero Principal', qty: 76 },
                                    { name: 'Auxiliar Contable', qty: 45 }
                                ]}
                                margin={{ left: 20 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 12, fontWeight: 600 }} width={120} />
                                <Tooltip
                                    cursor={{ fill: 'rgba(57, 108, 240, 0.05)' }}
                                    contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                                />
                                <Bar dataKey="qty" fill="#396CF0" radius={[0, 4, 4, 0]} barSize={25} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

const KPICard: React.FC<{ icon: React.ReactNode, title: string, value: string, color: string }> = ({ icon, title, value, color }) => (
    <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
        <div className={`icon-box ${color}`}>{icon}</div>
        <div>
            <span style={{ display: 'block', marginBottom: '8px', color: '#888', fontWeight: 500, fontSize: '0.9rem' }}>{title}</span>
            <h2 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 800 }}>{value}</h2>
        </div>
    </div>
);

export default Dashboard;
