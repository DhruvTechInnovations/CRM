import { redirectToLogin } from '@/components/navigation';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// const API_BASE_URL = 'http://10.0.2.2:3001/api';
const API_BASE_URL = 'https://backend.com.jplawsuvidha.com/api';


export const privateApi = axios.create({
    baseURL: API_BASE_URL,
    timeout: 15000,
});

// Request Interceptor: Inject Auth Token
privateApi.interceptors.request.use(
    async (config) => {
        try {
            const token = await SecureStore.getItemAsync('userToken');
            console.log('token is', token);
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (error) {
            // Error
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor: Handle Global Errors (like 401)

privateApi.interceptors.response.use(
    (response) => response,

    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            console.log('inside response interceptor')

            try {
                // const token = await SecureStore.getItemAsync("userToken");

                // if (!token) {
                //     throw new Error("No token");
                // }

                // // call validate API
                // const res = await axios.post(
                //     `${API_BASE_URL}/validate`,
                //     {},
                //     {
                //         headers: {
                //             Authorization: `Bearer ${token}`,
                //         },
                //     }
                // );

                // if (res.status === 200) {
                //     // retry original request
                //     return privateApi(originalRequest);
                // }
                redirectToLogin()
            } catch (err) {
                await SecureStore.deleteItemAsync("userToken");
            }
        }

        return Promise.reject(error);
    }
);

export default privateApi;
