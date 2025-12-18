import { useState, useEffect } from 'react';
import { useSite } from '../contexts/SiteContext';
import { useDateRange } from '../contexts/DateRangeContext';
import Layout from '../components/Layout';
import MetricCard from '../components/MetricCard';
import OccupancyChart from '../components/OccupancyChart';
import DemographicsCharts from '../components/DemographicsCharts';
import analyticsService from '../services/analytics.service';
import socketService from '../services/socket.service';
import { formatNumber, formatDwellTimeSeconds } from '../utils/formatters';
import { convertEntriesToAlerts, generateMockAlerts } from '../utils/alertUtils';
import './Dashboard.css';

const Dashboard = () => {
    const { selectedSite } = useSite();

    const [metrics, setMetrics] = useState({
        liveOccupancy: 0,
        todayFootfall: 0,
        avgDwellTime: 0,
        occupancyChange: 0,
        footfallChange: 0,
        dwellTimeChange: 0
    });

    const { fromUtc, toUtc } = useDateRange();
    console.log('DateRange', new Date(fromUtc), new Date(toUtc));
    const [occupancyData, setOccupancyData] = useState({ labels: [], values: [], toUtc: null });
    const [demographicsData, setDemographicsData] = useState({
        pie: { male: 0, female: 0 },
        timeSeries: { labels: [], male: [], female: [] }
    });

    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(false);

    // useEffect(() => {
    //     if (selectedSite) {
    //         fetchDashboardData();
    //         fetchAlerts();
    //     }
    // }, [selectedSite]);

    useEffect(() => {
        if (!selectedSite) return;

        fetchDashboardData();
        fetchAlerts();
    }, [selectedSite, fromUtc, toUtc]);


    useEffect(() => {
        setupSocketConnection();

        // Refresh alerts every 30 seconds
        const alertInterval = setInterval(fetchAlerts, 30000);

        return () => {
            socketService.disconnect();
            clearInterval(alertInterval);
        };
    }, []);

    const fetchDashboardData = async () => {

        if (loading) return;
        if (!selectedSite?.siteId) return;

        setLoading(true);

        const payload = {
            siteId: selectedSite.siteId,
            fromUtc,
            toUtc,
        };

        // // Calculate previous day range for comparison
        // const selectedDate = new Date(fromUtc);
        // const prevDayStart = new Date(selectedDate);
        // prevDayStart.setDate(prevDayStart.getDate() - 1);
        // prevDayStart.setHours(0, 0, 0, 0);

        // const prevDayEnd = new Date(prevDayStart);
        // prevDayEnd.setHours(23, 59, 59, 999);

        // const prevPayload = {
        //     siteId: selectedSite.siteId,
        //     fromUtc: prevDayStart.getTime(),
        //     toUtc: prevDayEnd.getTime(),
        // };

        const DAY_MS = 24 * 60 * 60 * 1000;

        const prevPayload = {
            siteId: selectedSite.siteId,
            fromUtc: fromUtc - DAY_MS,
            toUtc: toUtc - DAY_MS,
        };


        try {
            // const [
            //     dwellData,
            //     footfallData,
            //     occupancyData,
            //     demographicsData,
            //     prevDwellData,
            //     prevFootfallData,
            //     prevOccupancyData
            // ] = await Promise.all([
            //     analyticsService.getDwellTime(payload),
            //     analyticsService.getFootfall(payload),
            //     analyticsService.getOccupancy(payload),
            //     analyticsService.getDemographics(payload),
            //     analyticsService.getDwellTime(prevPayload),
            //     analyticsService.getFootfall(prevPayload),
            //     analyticsService.getOccupancy(prevPayload)
            // ]);

            const results = await Promise.allSettled([
                analyticsService.getDwellTime(payload),
                analyticsService.getFootfall(payload),
                analyticsService.getOccupancy(payload),
                analyticsService.getDemographics(payload),
                analyticsService.getDwellTime(prevPayload),
                analyticsService.getFootfall(prevPayload),
                analyticsService.getOccupancy(prevPayload)
            ]);

            const [
                dwellData,
                footfallData,
                occupancyData,
                demographicsData,
                prevDwellData,
                prevFootfallData,
                prevOccupancyData
            ] = results.map(r => r.status === 'fulfilled' ? r.value : null);




            // ---- METRICS ----
            const avgDwellSeconds =
                typeof dwellData?.avgDwellMinutes === 'number'
                    ? Math.round(dwellData.avgDwellMinutes * 60)
                    : 0;

            const prevAvgDwellSeconds =
                typeof prevDwellData?.avgDwellMinutes === 'number'
                    ? Math.round(prevDwellData.avgDwellMinutes * 60)
                    : 0;

            const liveOccupancy =
                occupancyData?.buckets?.length
                    ? Math.round(occupancyData.buckets.at(-1).avg)
                    : 0;

            const prevOccupancy =
                prevOccupancyData?.buckets?.length
                    ? Math.round(prevOccupancyData.buckets.at(-1).avg)
                    : 0;

            const todayFootfall = footfallData?.footfall ?? 0;
            const prevFootfall = prevFootfallData?.footfall ?? 0;

            // Calculate percentage changes
            const calculateChange = (current, previous) => {
                if (previous === 0) return 0;
                return Math.round(((current - previous) / previous) * 100);
            };

            setMetrics({
                liveOccupancy,
                todayFootfall,
                avgDwellTime: avgDwellSeconds,
                occupancyChange: calculateChange(liveOccupancy, prevOccupancy),
                footfallChange: calculateChange(todayFootfall, prevFootfall),
                dwellTimeChange: calculateChange(avgDwellSeconds, prevAvgDwellSeconds)
            });

            // ---- OCCUPANCY CHART ----

            // Check if we have valid occupancy data
            if (!occupancyData || !occupancyData.buckets || occupancyData.buckets.length === 0) {
                console.warn('⚠️ No occupancy data received from API');
            }

            setOccupancyData({
                labels: occupancyData?.buckets?.map(b => b.local) ?? [],
                values: occupancyData?.buckets?.map(b => Math.round(b.avg)) ?? [],
                fromUtc,
                toUtc
            });

            // ---- DEMOGRAPHICS ----
            const maleSeries = demographicsData?.buckets?.map(b => b.male) ?? [];
            const femaleSeries = demographicsData?.buckets?.map(b => b.female) ?? [];

            setDemographicsData({
                pie: {
                    male: maleSeries.length
                        ? maleSeries.reduce((a, b) => a + b, 0) / maleSeries.length
                        : 0,
                    female: femaleSeries.length
                        ? femaleSeries.reduce((a, b) => a + b, 0) / femaleSeries.length
                        : 0
                },
                timeSeries: {
                    labels: demographicsData?.buckets?.map(b => b.local) ?? [],
                    male: maleSeries,
                    female: femaleSeries
                }
            });

        } catch (err) {
            console.error(
                'Dashboard failed because:',
                err?.response?.config?.url || err
            );
        }
        finally {
            setLoading(false);
        }
    };


    const fetchAlerts = async () => {
        if (!selectedSite) return;

        try {
            // Get current time and time 24 hours ago
            // const now = Date.now();
            // const yesterday = now - (24 * 60 * 60 * 1000);

            // Fetch entry-exit data for the last 24 hours
            const entryData = await analyticsService.getEntryExit({
                siteId: selectedSite.siteId,
                fromUtc,
                toUtc,
                pageSize: 50,
                pageNumber: 1
            });

            // // Convert entries to alerts format with site data for zone resolution
            // if (entryData?.data && Array.isArray(entryData.data)) {
            //     const alertsList = convertEntriesToAlerts(entryData.data, selectedSite);
            //     setAlerts(alertsList);
            // } else {
            //     // Fallback to mock data if API doesn't return expected format
            //     console.log('Using mock alerts data');
            //     setAlerts(generateMockAlerts(10));
            // }

            console.log(entryData)
            console.log(
                'records length:',
                entryData.records.length
            );

            console.log(
                'alerts length:',
                convertEntriesToAlerts(entryData.records, selectedSite).length
            );


            if (entryData?.records && Array.isArray(entryData.records)) {
                setAlerts(convertEntriesToAlerts(entryData.records, selectedSite));
            }

        } catch (error) {
            console.error('Error fetching alerts:', error);
            // Use mock data on error
            setAlerts(generateMockAlerts(10));
        }
    };

    const setupSocketConnection = () => {
        socketService.connect();

        // Listen for live occupancy updates
        socketService.on('live_occupancy', (data) => {
            console.log('Live occupancy update:', data);
            if (data.count !== undefined) {
                setMetrics(prev => ({
                    ...prev,
                    liveOccupancy: data.count
                }));
            }
        });

        // Listen for alerts
        socketService.on('alert', (data) => {
            console.log('Alert received:', data);
            // Handle alerts (could show notification)
        });
    };

    const generateTimeLabels = () => {
        const labels = [];
        for (let i = 8; i <= 18; i++) {
            labels.push(`${i}:00`);
        }
        return labels;
    };

    const generateMockOccupancyData = () => {
        return [120, 145, 160, 175, 190, 200, 210, 205, 198, 185, 170];
    };

    const generateMockDemographicsData = (min, max) => {
        return Array.from({ length: 11 }, () =>
            Math.floor(Math.random() * (max - min + 1)) + min
        );
    };

    if (loading) {
        return (
            <Layout title="Overview" alerts={alerts}>
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Loading dashboard...</p>
                </div>
            </Layout>
        );
    }

    return (
        <Layout title="Overview" alerts={alerts}>
            <div className="dashboard">
                <section className="occupancy-section">
                    <h3 className="section-title">Occupancy</h3>

                    <div className="metrics-grid">
                        <MetricCard
                            title="Live Occupancy"
                            value={formatNumber(metrics.liveOccupancy)}
                            change={metrics.occupancyChange}
                            isPositive={metrics.occupancyChange > 0}
                        />
                        <MetricCard
                            title="Today's Footfall"
                            value={formatNumber(metrics.todayFootfall)}
                            change={metrics.footfallChange}
                            isPositive={metrics.footfallChange > 0}
                        />
                        <MetricCard
                            title="Avg Dwell Time"
                            value={formatDwellTimeSeconds(metrics.avgDwellTime)}
                            change={metrics.dwellTimeChange}
                            isPositive={metrics.dwellTimeChange > 0}
                        />
                    </div>

                    <div className="chart-container">
                        <h4 className="chart-title">Overall Occupancy</h4>
                        <OccupancyChart data={occupancyData} />
                    </div>
                </section>

                <DemographicsCharts
                    pieData={demographicsData.pie}
                    timeSeriesData={demographicsData.timeSeries}
                />
            </div>
        </Layout>
    );
};

export default Dashboard;
