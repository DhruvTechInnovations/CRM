import axios from "axios";
import { AuthTokenManager } from "./authTokenManager";
export async function bootstrapAuth() {
    try {
        const refreshToken = await AuthTokenManager.getRefreshToken();

        if (!refreshToken) return false;

        const res = await axios.post(
            'http://10.0.2.2:3001/api/mobile/refresh',
            { refreshToken }
        );

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