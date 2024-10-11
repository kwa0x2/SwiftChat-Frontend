//#region Public and Auth Routes Configuration
export const publicRoutes = ["/", "/home"]; // Public routes accessible to everyone

export const authRoutes = ["/createname", "/error", "/login"]; // Auth routes that require user authentication

export const DEFAULT_LOGIN_REDIRECT = "/chat"; // Default redirection path after successful login
//#endregion
