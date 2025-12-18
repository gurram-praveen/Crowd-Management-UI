import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Pagination from '../components/Pagination';
import analyticsService from '../services/analytics.service';
import { useSite } from '../contexts/SiteContext';
import { useDateRange } from '../contexts/DateRangeContext';
import { formatTime, formatDwellTime } from '../utils/formatters';
import './CrowdEntries.css';

const CrowdEntries = () => {
    const { selectedSite } = useSite();
    const { fromUtc, toUtc } = useDateRange();
    const [entries, setEntries] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const pageSize = 10;

    useEffect(() => {
        if (selectedSite) {
            fetchEntries(currentPage);
        }
    }, [currentPage, selectedSite, fromUtc, toUtc]);

    const fetchEntries = async (page) => {
        if (!selectedSite?.siteId) return;

        try {
            setLoading(true);
            const response = await analyticsService.getEntryExit({
                siteId: selectedSite.siteId,
                fromUtc,
                toUtc,
                pageNumber: page,
                pageSize: pageSize
            });

            console.log('Entry-Exit API Response:', response);

            // if (response?.data && Array.isArray(response.data)) {
            //     setEntries(response.data);
            //     setTotalPages(response.totalPages || Math.ceil((response.total || response.data.length) / pageSize));
            // } else {
            //     console.warn('No data in API response, using empty array');
            //     setEntries([]);
            //     setTotalPages(1);
            // }

if (response?.records && Array.isArray(response.records)) {
    setEntries(response.records);
    setTotalPages(response.totalPages || 1);
} else {
    setEntries([]);
    setTotalPages(1);
}

        } catch (error) {
            console.error('Error fetching entries:', error);
            setEntries([]);
            setTotalPages(1);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const getAvatarUrl = (name, gender) => {
        const seed = name.replace(/\s/g, '');
        return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
    };

    if (loading) {
        return (
            <Layout title="Crowd Entries">
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Loading entries...</p>
                </div>
            </Layout>
        );
    }

    return (
        <Layout title="Crowd Entries">
            <div className="crowd-entries">
                <div className="entries-table-container">
                    <table className="table entries-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Sex</th>
                                <th>Entry</th>
                                <th>Exit</th>
                                <th>Dwell Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {entries.length > 0 ? (
                                entries.map((entry) => (
                                    // <tr key={entry.id || entry.name + entry.entryTime}>
                                    //     <td>
                                    //         <div className="name-cell">
                                    //             <img
                                    //                 src={getAvatarUrl(entry.name, entry.gender)}
                                    //                 alt={entry.name}
                                    //                 className="avatar"
                                    //             />
                                    //             <span>{entry.name || 'Unknown'}</span>
                                    //         </div>
                                    //     </td>
                                    //     <td>{entry.gender || '--'}</td>
                                    //     <td>{formatTime(entry.entryTime)}</td>
                                    //     <td>{entry.exitTime ? formatTime(entry.exitTime) : '--'}</td>
                                    //     <td>{entry.dwellTime ? formatDwellTime(entry.dwellTime) : '--'}</td>
                                    // </tr>

                                        <tr key={entry.personId}>
                                        <td>
                                            <div className="name-cell">
                                            <img
                                                src={getAvatarUrl(entry.personName, entry.gender)}
                                                alt={entry.personName}
                                                className="avatar"
                                            />
                                            <span>{entry.personName}</span>
                                            </div>
                                        </td>
                                        <td>{entry.gender || '--'}</td>
                                        <td>{formatTime(entry.entryUtc)}</td>
                                        <td>{entry.exitUtc ? formatTime(entry.exitUtc) : '--'}</td>
                                        <td>
                                            {entry.dwellMinutes != null
                                            ? formatDwellTime(entry.dwellMinutes)
                                            : '--'}
                                        </td>
                                        </tr>

                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: '#808080' }}>
                                        No entries found for the selected date range
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            </div>
        </Layout>
    );
};

export default CrowdEntries;
