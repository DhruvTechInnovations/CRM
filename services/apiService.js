import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { privateApi } from './privateapi';

// const API_BASE_URL = 'http://10.0.2.2:3001/api';
const API_BASE_URL = 'https://backend.com.jplawsuvidha.com/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 15000,
});

// A separate instance for the production backend if needed
const prodApi = axios.create({
    baseURL: API_BASE_URL,
    timeout: 15000,
});

export const authService = {
    validateLogin: async (signal) => {
        try {
            const res = await api.get('/validate', { withCredentials: true, signal });
            if (res.data && res.data.token) {
                await SecureStore.setItemAsync('userToken', res.data.token);
            }
            return res;
        } catch (err) {
            throw err;
        }
    },

    login: async (email, password) => {
        try {
            const res = await api.post('/login', { email, password }, { withCredentials: true });
            console.log('login data', res.data)
            if (res.data.token) {
                await SecureStore.setItemAsync('userToken', res.data.token);
            }
            return res.data;
        } catch (err) {
            throw err;
        }
    },

    logout: async () => {
        try {
            await api.post('/logout', {}, { withCredentials: true });
            await SecureStore.deleteItemAsync('userToken');
        } catch (err) {
            throw err;
        }
    },

    resetPassword: async (email) => {
        try {
            const res = await api.post('/forgot-password', { email });
            return res.data;
        } catch (err) {
            throw err;
        }
    }
};

export const registerService = {
    subscribe: async (formData) => {
        try {
            const res = await api.post('/register', { formData });
            return res.data;
        } catch (err) {
            throw err;
        }
    },
};

export const contactService = {
    submitCase: async (newEntry) => {
        try {
            const res = await prodApi.post('/webClients', { newEntry });
            return res.data;
        } catch (err) {
            throw err;
        }
    },
};

export const orderService = { // This is for payment-route
    getOrder: async (id) => {
        try {
            const res = await api.get(`/orders/${id}`);
            return res.data;
        } catch (err) {
            throw err;
        }
    }
};

export const profileService = {
    getProfile: async () => {
        try {
            const res = await privateApi.get('/profile');
            return res.data;
        } catch (err) {
            throw err;
        }
    },
    updateProfile: async (profileData) => {
        try {
            const res = await privateApi.put('/profile', profileData);
            return res.data;
        } catch (err) {
            throw err;
        }
    }
};

export const leadService = {
    getLeads: async () => {
        try {
            const res = await privateApi.get('/leads');
            return res.data;
        } catch (err) {
            console.log('error is', err)
            throw err;
        }
    },
    updateLead: async (id, data) => {
        try {
            console.log('inside the updateLead,,,,,,,,,,,,,,', id, data)
            const res = await privateApi.put(`/leads/${id}`, data);
            return res.data;
        } catch (err) {
            console.log('error is', err)
            throw err;
        }
    },
    addActivity: async (leadId, activity) => {
        try {
            const res = await privateApi.post(`/leads/${leadId}/activity`, { activity });
            return res.data;
        } catch (err) {
            throw err;
        }
    },
    getActivities: async (leadId, signal) => {
        try {
            const res = await privateApi.get(`/leads/${leadId}/activity`, { signal });
            return res.data;
        } catch (err) {
            throw err;
        }
    }
};

export const calendarService = {
    getAll: async () => {
        try {
            const res = await privateApi.get('/custom/events');
            return res.data;
        } catch (err) {
            throw err;
        }
    },
    create: async (event) => {
        try {
            const res = await privateApi.post('/custom/event', event);
            return res.data;
        } catch (err) {
            throw err;
        }
    },
    update: async (id, event) => {
        try {
            const res = await privateApi.put(`/custom/event/${id}`, event);
            return res.data;
        } catch (err) {
            throw err;
        }
    },
    delete: async (id) => {
        try {
            const res = await privateApi.delete(`/custom/event/${id}`);
            return res.data;
        } catch (err) {
            throw err;
        }
    }
};

export const subscriptionService = {
    getSubscription: async () => {
        try {
            const res = await privateApi.get('/subscriptiondetails');
            return res.data;
        } catch (err) {
            throw err;
        }
    }
};

// For backward compatibility while components still use the old `api` object
export const api_legacy = {
    auth: authService,
    leads: {
        getAll: leadService.getLeads,
        updateStatus: (id, status) => leadService.updateLead(id, { status }),
        updateLead: leadService.updateLead,
    },
    calendar: calendarService,
    profile: {
        get: profileService.getProfile,
        update: profileService.updateProfile,
    },
    subscription: subscriptionService
};

export default api;
