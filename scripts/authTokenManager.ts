import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'userToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

export const AuthTokenManager = {
    async getToken() {
        return await SecureStore.getItemAsync(TOKEN_KEY);
    },
    async getRefreshToken() {
        return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
    },

    async setToken(token: string) {
        await SecureStore.setItemAsync(TOKEN_KEY, token);
    },
    async setRefreshToken(token: string) {
        await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token);
    },

    async clearToken() {
        await SecureStore.deleteItemAsync(TOKEN_KEY);
    },
    async clearRefreshToken() {
        console.log('inclear refresh token 🤣🤣🤣🤣🤣🤣🤣🤣🤣🤣🤣🤣🤣🤣🤣🤣🤣🤣🤣🤣🤣🤣🤣🤣🤣🤣🤣')
        await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
    }
};