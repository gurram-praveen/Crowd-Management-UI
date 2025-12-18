import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import authService from '../services/auth.service';
import './Sidebar.css';

const Sidebar = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const handleLogout = () => {
        authService.logout();
        window.location.href = '/';
    };

    return (
        <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
            <div className="sidebar-header">
                <div className="logo">
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                        <circle cx="16" cy="16" r="16" fill="#2D8B8A" />
                        <path d="M16 8L20 12L16 16L12 12L16 8Z" fill="white" />
                        <path d="M16 16L20 20L16 24L12 20L16 16Z" fill="white" opacity="0.7" />
                    </svg>
                    {!isCollapsed && <span className="logo-text">kloudspot</span>}
                </div>
                <button
                    className="collapse-btn"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        {isCollapsed ? (
                            <polyline points="9 18 15 12 9 6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        ) : (
                            <polyline points="15 18 9 12 15 6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        )}
                    </svg>
                </button>
            </div>

            <nav className="sidebar-nav">
                <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'} title="Overview">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <polyline points="9 22 9 12 15 12 15 22" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {!isCollapsed && <span>Overview</span>}
                </NavLink>

                <NavLink to="/crowd-entries" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'} title="Crowd Entries">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <circle cx="9" cy="7" r="4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {!isCollapsed && <span>Crowd Entries</span>}
                </NavLink>
            </nav>

            <div className="sidebar-footer">
                <button onClick={handleLogout} className="logout-btn" title="Logout">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <polyline points="16 17 21 12 16 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <line x1="21" y1="12" x2="9" y2="12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {!isCollapsed && <span>Logout</span>}
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
