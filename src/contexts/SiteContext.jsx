import { createContext, useContext, useState, useEffect } from 'react';
import analyticsService from '../services/analytics.service';

const SiteContext = createContext();

export const useSite = () => {
    const context = useContext(SiteContext);
    if (!context) {
        throw new Error('useSite must be used within a SiteProvider');
    }
    return context;
};

export const SiteProvider = ({ children }) => {
    const [sites, setSites] = useState([]);
    const [selectedSite, setSelectedSite] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSites();
    }, []);

    const fetchSites = async () => {
        try {
            setLoading(true);
            const sitesData = await analyticsService.getSites();
            console.log('sitesData', sitesData);

            if (sitesData && Array.isArray(sitesData)) {
                setSites(sitesData);
                // Select first site by default
                if (sitesData.length > 0) {
                    setSelectedSite(sitesData[0]);
                }
            } else {
                // Fallback to mock site
                const mockSite = {
                    siteId: 'SITE-AE-DXB-001',
                    name: 'Dubai Mall',
                    timezone: 'Asia/Dubai',
                    country: 'UAE',
                    city: 'Dubai',
                    zones: [
                        {
                            zoneId: 'Z-AE-DXB-001-H',
                            name: 'Luxury Retail Wing',
                            securityLevel: 'high'
                        },
                        {
                            zoneId: 'Z-AE-DXB-001-M',
                            name: 'Food Court Area',
                            securityLevel: 'medium'
                        },
                        {
                            zoneId: 'Z-AE-DXB-001-L',
                            name: 'General Shopping Zone',
                            securityLevel: 'low'
                        }
                    ]
                };
                setSites([mockSite]);
                setSelectedSite(mockSite);
            }
        } catch (error) {
            console.error('Error fetching sites:', error);
            // Use mock site on error
            const mockSite = {
                siteId: 'SITE-AE-DXB-001',
                name: 'Dubai Mall',
                timezone: 'Asia/Dubai',
                country: 'UAE',
                city: 'Dubai',
                zones: [
                    {
                        zoneId: 'Z-AE-DXB-001-H',
                        name: 'Luxury Retail Wing',
                        securityLevel: 'high'
                    },
                    {
                        zoneId: 'Z-AE-DXB-001-M',
                        name: 'Food Court Area',
                        securityLevel: 'medium'
                    },
                    {
                        zoneId: 'Z-AE-DXB-001-L',
                        name: 'General Shopping Zone',
                        securityLevel: 'low'
                    }
                ]
            };
            setSites([mockSite]);
            setSelectedSite(mockSite);
        } finally {
            setLoading(false);
        }
    };

    const selectSite = (siteId) => {
        const site = sites.find(s => s.siteId === siteId);
        if (site) {
            setSelectedSite(site);
        }
    };

    const value = {
        sites,
        selectedSite,
        selectSite,
        loading
    };

    return (
        <SiteContext.Provider value={value}>
            {children}
        </SiteContext.Provider>
    );
};
