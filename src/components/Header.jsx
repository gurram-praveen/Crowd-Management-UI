import { useState } from 'react';
import { useSite } from '../contexts/SiteContext';
import AlertsPanel from './AlertsPanel';
import { useDateRange } from '../contexts/DateRangeContext';
import authService from '../services/auth.service';
import './Header.css';

const Header = ({ title = 'Overview', alerts = [] }) => {
    const [showAlerts, setShowAlerts] = useState(false);
    const [showSiteDropdown, setShowSiteDropdown] = useState(false);
    const { sites, selectedSite, selectSite } = useSite();
    const { selectedDate, setDay } = useDateRange();
    // const isToday = selectedDate.toDateString() === new Date().toDateString();

    const handleBellClick = () => {
        setShowAlerts(true);
    };

    const handleCloseAlerts = () => {
        setShowAlerts(false);
    };

    const handleSiteSelect = (siteId) => {
        selectSite(siteId);
        setShowSiteDropdown(false);
    };

    const formatDateInput = (date) => {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    };


    return (
        <>
            <div className="header">
                <div className="header-left">
                    <h2 className="page-title">{title}</h2>
                    <div className="location-selector-container">
                        <div
                            className="location-selector"
                            onClick={() => setShowSiteDropdown(!showSiteDropdown)}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <circle cx="12" cy="10" r="3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span>{selectedSite?.name || 'Select Site'}</span>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <polyline points="6 9 12 15 18 9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>

                        {showSiteDropdown && sites.length > 0 && (
                            <div className="site-dropdown">
                                {sites.map((site) => (
                                    <div
                                        key={site.siteId}
                                        className={`site-option ${selectedSite?.siteId === site.siteId ? 'selected' : ''}`}
                                        onClick={() => handleSiteSelect(site.siteId)}
                                    >
                                        <span className="site-name">{site.name}</span>
                                        {site.city && site.country && (
                                            <span className="site-location">{site.city}, {site.country}</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="header-right">
                    <div className="date-filter">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>

                        <input
                            type="date"
                            value={
                                selectedDate
                                    ? formatDateInput(selectedDate)
                                    : ''
                            }
                            onChange={(e) => {
                                if (!e.target.value) return;
                                setDay(e.target.value);
                            }}
                            className="date-input"
                        />
                    </div>


                    <button className="icon-btn notification-btn" onClick={handleBellClick}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M13.73 21a2 2 0 0 1-3.46 0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        {alerts.length > 0 && (
                            <span className="notification-badge">{alerts.length}</span>
                        )}
                    </button>

                    <div className="user-avatar" title={authService.getCurrentUser()?.name || authService.getCurrentUser()?.email || 'User'}>
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" alt="User" />
                    </div>
                </div>
            </div>

            <AlertsPanel
                isOpen={showAlerts}
                onClose={handleCloseAlerts}
                alerts={alerts}
            />
        </>
    );
};

export default Header;
