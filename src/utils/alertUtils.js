/**
 * Utility functions for managing alerts
 */

/**
 * Determine alert severity based on zone security level
 * @param {Object} entry - Entry data object with zone information
 * @returns {string} - 'high', 'medium', or 'low'
 */
export const determineAlertSeverity = (entry) => {
    // Use zone security level if available
    if (entry.zone && typeof entry.zone === 'object' && entry.zone.securityLevel) {
        return entry.zone.securityLevel.toLowerCase();
    }

    // Fallback: check if zone is a string with security level info
    if (typeof entry.zone === 'string') {
        const zoneLower = entry.zone.toLowerCase();
        if (zoneLower.includes('high') || zoneLower.includes('restricted') || zoneLower.includes('luxury')) {
            return 'high';
        } else if (zoneLower.includes('medium') || zoneLower.includes('moderate')) {
            return 'medium';
        }
    }

    // Default to low
    return 'low';
};

/**
 * Format alert timestamp to match the design
 * @param {Date|string|number} timestamp - Timestamp to format
 * @returns {Object} - Object with date and time strings
 */
export const formatAlertTimestamp = (timestamp) => {
    const date = new Date(timestamp);

    // Format: "March 03 2025"
    const dateStr = date.toLocaleDateString('en-US', {
        month: 'long',
        day: '2-digit',
        year: 'numeric'
    });

    // Format: "10:12"
    const timeStr = date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });

    return {
        date: dateStr,
        time: timeStr
    };
};

/**
 * Convert entry-exit data to alert format
 * @param {Array} entries - Array of entry-exit records
 * @param {Object} siteData - Site data with zones information
 * @returns {Array} - Array of formatted alerts
 */
// export const convertEntriesToAlerts = (entries, siteData = null) => {
//     if (!entries || !Array.isArray(entries)) {
//         return [];
//     }

//     return entries
//         .filter(entry => entry.entryTime) // Only entries with entry time
//         .map(entry => {
//             const timestamp = formatAlertTimestamp(entry.entryTime);

//             // Get zone information
//             let zoneInfo = entry.zone;
//             let zoneName = 'Unknown Zone';

//             // If zone is an object with name, use it
//             if (typeof entry.zone === 'object' && entry.zone.name) {
//                 zoneName = entry.zone.name;
//             } else if (typeof entry.zone === 'string') {
//                 zoneName = entry.zone;
//             } else if (entry.zoneId && siteData?.zones) {
//                 // Try to find zone by zoneId in site data
//                 const zone = siteData.zones.find(z => z.zoneId === entry.zoneId);
//                 if (zone) {
//                     zoneInfo = zone;
//                     zoneName = zone.name;
//                 }
//             }

//             const severity = determineAlertSeverity({ ...entry, zone: zoneInfo });

//             return {
//                 id: entry.id || `${entry.name}-${entry.entryTime}`,
//                 name: entry.name || 'Unknown',
//                 zone: zoneName,
//                 severity,
//                 timestamp,
//                 entryTime: entry.entryTime,
//                 rawData: entry
//             };
//         })
//         .sort((a, b) => new Date(b.entryTime) - new Date(a.entryTime)); // Most recent first
// };

export const convertEntriesToAlerts = (entries, siteData = null) => {
  if (!Array.isArray(entries)) return [];

  return entries
    .filter(entry => entry.entryUtc) // ✅ correct field
    .map(entry => {
      const timestamp = formatAlertTimestamp(entry.entryUtc);

      return {
        id: entry.personId,
        name: entry.personName || 'Unknown',
        zone: entry.zoneName || 'Unknown Zone',
        severity: entry.severity || 'low',
        timestamp,
        entryTime: entry.entryUtc,
        rawData: entry
      };
    })
    .sort((a, b) => b.entryTime - a.entryTime);
};


/**
 * Generate mock alerts for testing
 * @param {number} count - Number of mock alerts to generate
 * @returns {Array} - Array of mock alerts
 */
export const generateMockAlerts = (count = 10) => {
    const names = [
        'Ahmad', 'Mathew', 'Rony', 'Alice Johnson', 'Brian Smith',
        'Catherine Lee', 'David Brown', 'Eva White', 'Frank Green'
    ];

    const zones = [
        { name: 'Luxury Retail Wing', securityLevel: 'high' },
        { name: 'Food Court Area', securityLevel: 'medium' },
        { name: 'General Shopping Zone', securityLevel: 'low' }
    ];

    const alerts = [];
    const now = new Date();

    for (let i = 0; i < count; i++) {
        // Generate timestamps going back in time
        const entryTime = new Date(now.getTime() - (i * 5 * 60 * 1000)); // 5 minutes apart
        const timestamp = formatAlertTimestamp(entryTime);
        const zoneData = zones[Math.floor(Math.random() * zones.length)];

        alerts.push({
            id: `mock-${i}`,
            name: names[Math.floor(Math.random() * names.length)],
            zone: zoneData.name,
            severity: zoneData.securityLevel,
            timestamp,
            entryTime: entryTime.toISOString()
        });
    }

    return alerts;
};

/**
 * Filter alerts by time range
 * @param {Array} alerts - Array of alerts
 * @param {number} hoursBack - Number of hours to look back
 * @returns {Array} - Filtered alerts
 */
export const filterAlertsByTime = (alerts, hoursBack = 24) => {
    const cutoffTime = new Date(Date.now() - (hoursBack * 60 * 60 * 1000));

    return alerts.filter(alert => {
        const alertTime = new Date(alert.entryTime);
        return alertTime >= cutoffTime;
    });
};
