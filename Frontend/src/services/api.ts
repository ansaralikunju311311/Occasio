







import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3001/api",
  withCredentials: true
});

/* REQUEST INTERCEPTOR */

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});








api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;



    const authEndpoints = ["/auth/login", "/auth/verify-otp", "/auth/signup", "/auth/resend-otp", "/auth/forgot-password", "/auth/reset-password", "/auth/adminlogin"];

    const isAuthRequest = authEndpoints.some(endpoint => originalRequest.url?.includes(endpoint));

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthRequest) {

      originalRequest._retry = true;

      try {
        console.log("Access token expired → trying refresh");

        const res = await api.post("/auth/refresh");

        const newAccessToken = res.data.accessToken;

        
        localStorage.setItem("accessToken", newAccessToken);



        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        console.log("New access token received → retrying request");

        return api(originalRequest);

      } catch (refreshError) {

        console.log("Refresh token failed → logging out");

        localStorage.removeItem("accessToken");

        const skipRedirectPages = [
          "/",
          "/login",
          "/adminlogin",
          "/signup",
          "/otpverification",
          "/forgotpassword",
          "/resetpassword"
        ];

        const currentPath = window.location.pathname;

        if (!skipRedirectPages.includes(currentPath)) {

          if (currentPath.startsWith("/admin")) {
            window.location.href = "/adminlogin";
          } else {
            window.location.href = "/login";
          }

        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);