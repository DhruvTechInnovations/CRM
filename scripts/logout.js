import { redirectToLogin } from "@/components/navigation";
import { AuthTokenManager } from "./authTokenManager";
const logout = async () => {
    await AuthTokenManager.clearToken();
    await AuthTokenManager.clearRefreshToken();
    redirectToLogin();
}
export default logout;