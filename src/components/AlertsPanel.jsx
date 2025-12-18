import { useEffect, useState } from 'react';
import './AlertsPanel.css';

const AlertsPanel = ({ isOpen, onClose, alerts = [] }) => {
    const [isClosing, setIsClosing] = useState(false);

    useEffect(() => {
        // Prevent body scroll when panel is open
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsClosing(false);
            onClose();
        }, 250); // Match animation duration
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };

    if (!isOpen && !isClosing) {
        return null;
    }

    return (
        <>
            <div className="alerts-overlay" onClick={handleOverlayClick} />
            <div className={`alerts-panel ${isClosing ? 'closing' : ''}`}>
                <div className="alerts-header">
                    <h2 className="alerts-title">Alerts</h2>
                    <button className="alerts-close-btn" onClick={handleClose}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <line x1="18" y1="6" x2="6" y2="18" strokeWidth="2" strokeLinecap="round" />
                            <line x1="6" y1="6" x2="18" y2="18" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </button>
                </div>

                <div className="alerts-content">
                    {alerts.length === 0 ? (
                        <div className="alerts-empty">
                            <svg className="alerts-empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M13.73 21a2 2 0 0 1-3.46 0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <p className="alerts-empty-text">No alerts at this time</p>
                        </div>
                    ) : (
                        <div className="alerts-list">
                            {/* <div style={{ color: 'red', padding: '10px' }}>
                                DEBUG: alerts = {alerts.length}
                            </div> */}
                            {alerts.map((alert) => (
                                <div key={alert.id} className="alert-item">
                                    <div className="alert-header">
                                        <div className="alert-timestamp">
                                            <span className="alert-date">{alert.timestamp.date}</span>
                                            <span className="alert-time">{alert.timestamp.time}</span>
                                        </div>
                                        <span className={`alert-severity-badge ${alert.severity}`}>
                                            {alert.severity}
                                        </span>
                                    </div>

                                    <div className="alert-body">
                                        <div className="alert-name">{alert.name}</div>
                                        <div className="alert-status">Entered</div>
                                    </div>

                                    <div className="alert-footer">
                                        <svg className="alert-zone-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            <circle cx="12" cy="10" r="3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <span className="alert-zone">{alert.zone}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default AlertsPanel;
