import { formatPercentage } from '../utils/formatters';
import './MetricCard.css';

const MetricCard = ({ title, value, change, isPositive, icon }) => {
    return (
        <div className="metric-card">
            <div className="metric-header">
                <span className="metric-title">{title}</span>
                {icon && <div className="metric-icon">{icon}</div>}
            </div>

            <div className="metric-value">{value}</div>

            {change !== undefined && change !== null && (
                <div className="metric-change">
                    <span className={`change-indicator ${isPositive ? 'positive' : 'negative'}`}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            {isPositive ? (
                                <polyline points="18 15 12 9 6 15" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                            ) : (
                                <polyline points="6 9 12 15 18 9" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                            )}
                        </svg>
                        {formatPercentage(Math.abs(change))}
                    </span>
                    <span className="change-text">More than yesterday</span>
                </div>
            )}
        </div>
    );
};

export default MetricCard;
