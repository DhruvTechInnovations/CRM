import { AuthTokenManager } from '@/scripts/authTokenManager';
import axios from 'axios';
import { privateApi } from './privateapi';

// const API_BASE_URL = 'http://[IP_ADDRESS]';
const API_BASE_URL = 'https://backend.com.jplawsuvidha.com/api';
// const API_BASE_URL = 'http://localhost:3001/api';
// const API_BASE_URL = 'http://10.0.2.2:3001/api';


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
            const refreshToken = await AuthTokenManager.getRefreshToken();
            console.log('refresh token', refreshToken)

            if (!refreshToken) {
                throw new Error('No refresh token');
            }
            const res = await api.post('/mobile/refresh', {
                refreshToken,
            });

            if (res.data?.token) {
                await AuthTokenManager.setToken(res.data.token);
            }
            return res;
        } catch (err) {
            throw err;
        }
    },

    login: async (email, password) => {
        try {
            const res = await api.post('/mobile/login', { email, password }, { withCredentials: true });
            console.log('login data', res.data)
            if (res.data.token) {
                await AuthTokenManager.setToken(res.data.token);
                await AuthTokenManager.setRefreshToken(res.data.refreshToken);
            }
            return res.data;
        } catch (err) {
            console.log('error is', err)
            throw err;
        }
    },

    logout: async () => {
        try {
            await api.post('/logout', {}, { withCredentials: true });
            await AuthTokenManager.clearToken();
            await AuthTokenManager.clearRefreshToken();
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
            return res;
        } catch (err) {
            throw err;
        }
    },
    updateProfileImage: async (formData) => {
        return privateApi.post("/profile/upload-profile", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    },
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

export const paymentService = {
    createRazorpayOrder: async (planDetails) => {
        try {
            console.log('plan details', planDetails)
            // Placeholder: Replace with actual endpoint to create order
            const res = await privateApi.post('/create-payment-order', planDetails);
            console.log('order response from api', res.data)
            return res.data;
        } catch (err) {
            console.error('Error creating Razorpay order:', err);
            throw err;
        }
    },
    verifyPayment: async (paymentDetails) => {
        try {
            console.log('payment details', paymentDetails)
            // Placeholder: Replace with actual endpoint to verify signature
            const res = await privateApi.post('/payment-verify', paymentDetails);
            return res.data;
        } catch (err) {
            console.error('Error verifying Razorpay payment:', err);
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
    subscription: subscriptionService,
    payment: paymentService
};


export const notificationService = {
    saveOneSignalId: async (email, onesignalId) => {
        console.log('check 1 from notification api')
        const res = await privateApi.post("/onesignalId", {
            email,
            onesignal_id: onesignalId,
        });
        console.log('check 2 from notificaiton api')
        return res.data;
    },
};
export default api;
