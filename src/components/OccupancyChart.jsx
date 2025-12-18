import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';

/* ─────────────────────────────────────────────── */
/* Chart.js registration (ONCE)                    */
/* ─────────────────────────────────────────────── */
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
    Filler,
    annotationPlugin
);

/* ─────────────────────────────────────────────── */
/* Helpers                                         */
/* ─────────────────────────────────────────────── */

// Fixed 24-hour axis
const HOURS_24 = Array.from({ length: 24 }, (_, i) =>
    `${i.toString().padStart(2, '0')}:00`
);

// Map backend timestamps → 24 slots, missing hours = null
const mapTo24Hours = (labels = [], values = []) => {
    const result = Array(24).fill(null);

    labels.forEach((label, idx) => {
        // Handle different date formats
        let d;

        // Check if label is in DD/MM/YYYY HH:MM:SS format
        if (typeof label === 'string' && label.includes('/')) {
            // Parse DD/MM/YYYY HH:MM:SS format
            const parts = label.split(' ');
            if (parts.length >= 2) {
                const [datePart, timePart] = parts;
                const [day, month, year] = datePart.split('/');
                // Convert to ISO format: YYYY-MM-DDTHH:MM:SS
                const isoString = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T${timePart}`;
                d = new Date(isoString);
            } else {
                d = new Date(label);
            }
        } else {
            // Try parsing as-is (for ISO format or timestamp)
            d = new Date(label);
        }

        if (!isNaN(d.getTime())) {
            const hour = d.getHours();
            result[hour] = values[idx];
        }
    });

    return result;
};

/* ─────────────────────────────────────────────── */
/* Component                                       */
/* ─────────────────────────────────────────────── */

const OccupancyChart = ({ data }) => {
    const values24 = mapTo24Hours(data?.labels, data?.values);

    const now = new Date();
    // Check if the selected date range includes today
    // const endDate = data?.toUtc ? new Date(data.toUtc) : null;
const startDate = data?.fromUtc ? new Date(data.fromUtc) : null;


    console.log('=== LIVE Line Debug ===');
    console.log('now:', now);
    console.log('startDate (from fromUtc):', startDate);
    console.log('now date parts:', now.getFullYear(), now.getMonth(), now.getDate());
    console.log('startDate date parts:', startDate?.getFullYear(), startDate?.getMonth(), startDate?.getDate());

    // const isToday = endDate &&
    //     endDate.getFullYear() === now.getFullYear() &&
    //     endDate.getMonth() === now.getMonth() &&
    //     endDate.getDate() === now.getDate();

const isToday =
  startDate &&
  startDate.getFullYear() === now.getFullYear() &&
  startDate.getMonth() === now.getMonth() &&
  startDate.getDate() === now.getDate();

    console.log('isToday:', isToday);

    // Find the last hour with data for smart LIVE line positioning
    let lastDataHour = -1;
    for (let i = values24.length - 1; i >= 0; i--) {
        if (values24[i] !== null) {
            lastDataHour = i;
            break;
        }
    }

    // Only show LIVE line if we have data and it's today
    // Position it at the last data point (completed hour) instead of current hour
    const showLiveLine = isToday && lastDataHour >= 0;
    const liveLinePosition = lastDataHour;

    const chartData = {
        labels: HOURS_24,
        datasets: [
            {
                label: 'Occupancy',
                data: values24,
                borderColor: '#2D8B8A',
                backgroundColor: 'rgba(45, 139, 138, 0.12)',
                fill: true,
                tension: 0.4,
                spanGaps: false, // 🔴 critical: do NOT connect missing hours
                pointRadius: 0,
                pointHoverRadius: 6,
                pointHoverBackgroundColor: '#2D8B8A',
                pointHoverBorderColor: '#fff',
                pointHoverBorderWidth: 2
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: 'nearest',
            axis: 'x',
            intersect: false
        },
        plugins: {
            legend: { display: false },
            tooltip: {
                mode: 'index',
                intersect: false,
                backgroundColor: 'rgba(26,26,26,0.9)',
                titleColor: '#fff',
                bodyColor: '#B0B0B0',
                borderColor: '#2D8B8A',
                borderWidth: 1,
                padding: 12,
                displayColors: false,
                callbacks: {
                    title: ctx => `Time: ${ctx[0].label}`,
                    label: ctx =>
                        ctx.parsed.y == null
                            ? 'No data yet'
                            : `Occupancy: ${ctx.parsed.y}`
                }
            },
            annotation: showLiveLine
                ? {
                    annotations: {
                        liveLine: {
                            type: 'line',
                            xMin: liveLinePosition,
                            xMax: liveLinePosition,
                            borderColor: 'red',
                            borderWidth: 2,
                            borderDash: [6, 4],
                            label: {
                                display: true,
                                content: 'LIVE',
                                position: 'start',
                                backgroundColor: 'red',
                                color: '#fff',
                                padding: 6
                            }
                        }
                    }
                }
                : {}
        },
        scales: {
            x: {
                grid: {
                    display: false,
                    drawBorder: false
                },
                ticks: {
                    color: '#808080',
                    font: { size: 11 }
                }
            },
            y: {
                grid: {
                    color: 'rgba(58,74,74,0.3)',
                    drawBorder: false
                },
                ticks: {
                    color: '#808080',
                    font: { size: 11 }
                }
            }
        }
    };

    return (
        <div style={{ height: 300, width: '100%' }}>
            <Line data={chartData} options={options} />
        </div>
    );
};

export default OccupancyChart;
