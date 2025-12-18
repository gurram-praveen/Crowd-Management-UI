// Format time to HH:MM AM/PM
export const formatTime = (timeString) => {
    if (!timeString) return '--';

    try {
        const date = new Date(timeString);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    } catch (error) {
        return timeString;
    }
};

// Format date to readable format
export const formatDate = (dateString) => {
    if (!dateString) return '--';

    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: '2-digit',
            year: 'numeric'
        });
    } catch (error) {
        return dateString;
    }
};

// Format dwell time from minutes to HH:MM
export const formatDwellTime = (minutes) => {
    if (!minutes || minutes === 0) return '--';

    const hours = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);

    if (hours > 0) {
        return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
    }
    return `00:${String(mins).padStart(2, '0')}`;
};

// Format dwell time in seconds to readable format
export const formatDwellTimeSeconds = (seconds) => {
    if (!seconds || seconds === 0) return '--';

    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);

    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

// Format number with commas
export const formatNumber = (num) => {
    if (num === null || num === undefined) return '0';
    return num.toLocaleString('en-US');
};

// Calculate percentage change
export const calculatePercentageChange = (current, previous) => {
    if (!previous || previous === 0) return 0;
    return ((current - previous) / previous) * 100;
};

// Format percentage
export const formatPercentage = (value) => {
    if (!value || value === 0) return '0%';
    const sign = value > 0 ? '+' : '';
    return `${sign}${Math.abs(value).toFixed(1)}%`;
};
