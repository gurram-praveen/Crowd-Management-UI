import { Pie, Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend
} from 'chart.js';
import './DemographicsCharts.css';

ChartJS.register(
    ArcElement,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend
);

const DemographicsCharts = ({ pieData, timeSeriesData }) => {
    const pieChartData = {
        labels: ['Male', 'Female'],
        datasets: [
            {
                data: [pieData?.male || 0, pieData?.female || 0],
                backgroundColor: ['#5BA3A3', '#8BC6C6'],
                borderColor: ['#2D8B8A', '#3DA5A4'],
                borderWidth: 2,
                spacing: 6,        // ✅ GAP BETWEEN SLICES
                borderRadius: 4    // ✅ rounded slice edges (nice touch)
            }
        ]
    };

const pieOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '70%',
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: 'rgba(26, 26, 26, 0.9)',
      titleColor: '#fff',
      bodyColor: '#B0B0B0',
      borderColor: '#2D8B8A',
      borderWidth: 1,
      padding: 12,
      callbacks: {
        // 🔥 REMOVE "Male 100%" TITLE
        title: ctx => ctx[0].label,

        // ✅ Correct body
        label: context => {
          const value = context.parsed || 0;
          const total = context.dataset.data.reduce((a, b) => a + b, 0);
          const percentage =
            total > 0 ? ((value / total) * 100).toFixed(2) : '0.00';

          return `Count: ${Number(value).toFixed(2)} (${percentage}%)`;
        }
      }
    }
  }
};


    const lineChartData = {
        labels: timeSeriesData?.labels || [],
        datasets: [
            {
                label: 'Male',
                data: timeSeriesData?.male || [],
                borderColor: '#5BA3A3',
                backgroundColor: 'rgba(91, 163, 163, 0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: 0,
                pointHoverRadius: 5,
            },
            {
                label: 'Female',
                data: timeSeriesData?.female || [],
                borderColor: '#8BC6C6',
                backgroundColor: 'rgba(139, 198, 198, 0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: 0,
                pointHoverRadius: 5,
            }
        ]
    };

const lineOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'top',
      align: 'end',
      labels: {
        color: '#B0B0B0',
        usePointStyle: true,
        pointStyle: 'circle',
        padding: 15,
        font: { size: 12 }
      }
    },
    tooltip: {
      mode: 'index',
      intersect: false,
      backgroundColor: 'rgba(26, 26, 26, 0.9)',
      titleColor: '#fff',
      bodyColor: '#B0B0B0',
      borderColor: '#2D8B8A',
      borderWidth: 1,
      padding: 12,
      callbacks: {
        label: ctx => {
          const v = ctx.parsed.y;
          return v == null
            ? 'No data'
            : `${ctx.dataset.label}: ${Number(v).toFixed(2)}`;
        }
      }
    }
  },
  scales: {
    x: {
      grid: { display: false, drawBorder: false },
      ticks: {
        color: '#808080',
        font: { size: 11 },
        callback(value) {
          const label = this.getLabelForValue(value);
          try {
            if (typeof label === 'string' && label.includes('/')) {
              const timePart = label.split(' ')[1];
              if (timePart) return `${timePart.split(':')[0]}:00`;
            }
            const d = new Date(label);
            if (!isNaN(d)) return `${String(d.getHours()).padStart(2, '0')}:00`;
            return label;
          } catch {
            return label;
          }
        }
      }
    },
    y: {
      grid: { color: 'rgba(58, 74, 74, 0.3)', drawBorder: false },
      ticks: {
        color: '#808080',
        font: { size: 11 }
      }
    }
  }
};


    const total = (pieData?.male || 0) + (pieData?.female || 0);
    // const malePercentage = total > 0 ? ((pieData?.male / total) * 100).toFixed(0) : 0;
    // const femalePercentage = total > 0 ? ((pieData?.female / total) * 100).toFixed(0) : 0;

const malePercentage = total > 0
  ? ((pieData.male / total) * 100).toFixed(2)
  : '0.00';

const femalePercentage = total > 0
  ? ((pieData.female / total) * 100).toFixed(2)
  : '0.00';


    return (
        <div className="demographics-section">
            <h3 className="section-title">Demographics</h3>

            <div className="demographics-grid">
                <div className="demographics-pie">
                    <h4 className="chart-title">Chart of Demographics</h4>
                    <div className="pie-chart-container">
                        <Pie data={pieChartData} options={pieOptions} />
                        <div className="pie-center-label">
                            <div className="total-label">Total Crowd</div>
                            <div className="total-value">{total > 0 ? '100%' : '—'}</div>
                        </div>
                    </div>
                    <div className="demographics-legend">
                        <div className="legend-item">
                            <span className="legend-color male"></span>
                            <span className="legend-text">{malePercentage}% Males</span>
                        </div>
                        <div className="legend-item">
                            <span className="legend-color female"></span>
                            <span className="legend-text">{femalePercentage}% Females</span>
                        </div>
                    </div>
                </div>

                <div className="demographics-timeseries">
                    <h4 className="chart-title">Demographics Analysis</h4>
                    <div style={{ height: '300px' }}>
                        <Line data={lineChartData} options={lineOptions} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DemographicsCharts;
