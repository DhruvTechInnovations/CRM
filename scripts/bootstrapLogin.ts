import axios from "axios";
import { AuthTokenManager } from "./authTokenManager";
// const API_BASE_URL = 'http://10.0.2.2:3001/api';
const API_BASE_URL = 'https://backend.jplawsuvidha.com/api';
// const API_BASE_URL = 'http://localhost:3001/api';
export async function bootstrapAuth() {
    try {
        const refreshToken = await AuthTokenManager.getRefreshToken();

        if (!refreshToken) return false;

        const res = await axios.post(
            `${API_BASE_URL}/mobile/refresh`,
            { refreshToken }
        );
        console.log('after mobile refresh 🫵🏻ß')
        if (res.data?.token) {
            await AuthTokenManager.setToken(res.data.token);
            return true;
        }

        return false;
    } catch (err) {
        await AuthTokenManager.clearToken();
        await AuthTokenManager.clearRefreshToken();
        return false;
    }
}