import api from '../utils/api';

class AnalyticsService {
    async getDwellTime(params = {}) {
        try {
            const response = await api.post('/api/analytics/dwell', params);
            return response.data;
        } catch (error) {
            console.error('Error fetching dwell time:', error);
            throw error;
        }
    }

    async getFootfall(params = {}) {
        try {
            const response = await api.post('/api/analytics/footfall', params);
            return response.data;
        } catch (error) {
            console.error('Error fetching footfall:', error);
            throw error;
        }
    }

    async getOccupancy(params = {}) {
        try {
            const response = await api.post('/api/analytics/occupancy', params);
            return response.data;
        } catch (error) {
            console.error('Error fetching occupancy:', error);
            throw error;
        }
    }

    async getDemographics(params = {}) {
        try {
            const response = await api.post('/api/analytics/demographics', params);
            return response.data;
        } catch (error) {
            console.error('Error fetching demographics:', error);
            throw error;
        }
    }

    async getEntryExit(params = {}) {
        try {
            const response = await api.post('/api/analytics/entry-exit', params);
            return response.data;
        } catch (error) {
            console.error('Error fetching entry-exit data:', error);
            throw error;
        }
    }

    async getSites() {
        try {
            const response = await api.get('/api/sites');
            return response.data;
        } catch (error) {
            console.error('Error fetching sites:', error);
            throw error;
        }
    }

    async getSiteById(siteId) {
        try {
            const response = await api.get(`/api/sites/${siteId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching site:', error);
            throw error;
        }
    }
}

export default new AnalyticsService();
