import { AuthTokenManager } from '@/scripts/authTokenManager';
import axios from 'axios';

// const API_BASE_URL = 'http://10.0.2.2:3002/api';
const API_BASE_URL = 'https://backend.jplawsuvidha.com/api';
// const API_BASE_URL = 'http://localhost:3001/api';


export const privateApi = axios.create({
    baseURL: API_BASE_URL,
    timeout: 15000,
});

// Request Interceptor: Inject Auth Token
privateApi.interceptors.request.use(
    async (config) => {
        try {
            const token = await AuthTokenManager.getToken();
            console.log('token is', token);
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            console.log('config is 🫵🏻🎶👀🚀');
        } catch (error) {
            // Error
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor: Handle Global Errors (like 401)

// privateApi.interceptors.response.use(
//     (response) => response,

//     async (error) => {
//         const originalRequest = error.config;

//         if (error.response?.status === 401 && !originalRequest._retry) {
//             originalRequest._retry = true;
//             console.log('inside response interceptor')

//             try {
//                 console.log('from response interceptor in private api')
//                 const token = await AuthTokenManager.getToken();

//                 if (!token) {
//                     throw new Error("No token");
//                 }

//                 // call validate API
//                 const res = await axios.post(
//                     `${API_BASE_URL}/validate`,
//                     {},
//                     {
//                         headers: {
//                             Authorization: `Bearer ${token}`,
//                         },
//                     }
//                 );

//                 if (res.status === 200) {
//                     // retry original request
//                     return privateApi(originalRequest);
//                 }
//                 redirectToLogin()
//             } catch (err) {
//                 await SecureStore.deleteItemAsync("userToken");
//             }
//         }

//         return Promise.reject(error);
//     }
// );
privateApi.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Prevent infinite loops
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = await AuthTokenManager.getRefreshToken();

                if (!refreshToken) throw new Error('No refresh token');

                const res = await axios.post(
                    `${API_BASE_URL}/mobile/refresh`,
                    { refreshToken }
                );

                const newAccessToken = res.data.token;

                await AuthTokenManager.setToken(newAccessToken);

                // Retry original request
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                return privateApi(originalRequest);

            } catch (err) {
                // Refresh failed → logout
                await AuthTokenManager.clearToken();
                await AuthTokenManager.clearRefreshToken();

                return Promise.reject(err);
            }
        }

        return Promise.reject(error);
    }
);

export default privateApi;
