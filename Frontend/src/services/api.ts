// import axios from "axios";
// // import { store } from "../redux/store";

// export const api = axios.create({
//   baseURL: "http://localhost:3001/api",
//   withCredentials: true
// });


// api.interceptors.request.use((config)=>{
//   const token = localStorage.getItem("accessToken");
//   console.log("token  token",token)
//   if(token){
//     config.headers.Authorization = `Bearer ${token}`
//   }
//   return config;
// })



// // let count = 0;
// // api.interceptors.request.use((config)=>{
// //   const state = store.getState();
// //   console.log("state ",state , count);
// //  count ++;
// //   const token = state.auth.accessToken;


// //    console.log("token will token",token)
// //   if(token){
// //     config.headers.Authorization = `Bearer ${token}`;
// //     console.log("checking anneeee",config.headers.Authorization)
// //   }
// //   console.log(config)
// //   return config;
// // });
// // export default api;



// import { store } from "../redux/store";
// import { setAuth, logout } from "../redux/slices/authSlice";

// // export const api = axios.create({
// //   baseURL: "http://localhost:3001/api",
// //   withCredentials: true
// // });



// // api.interceptors.request.use((config) => {

// //   const state = store.getState();
// //   const token = state.auth.accessToken;

// //   if (token) {
// //     config.headers.Authorization = `Bearer ${token}`;
// //   }

// //   return config;
// // });


// api.interceptors.response.use(
//   (response) => response,

//   async (error) => {

//     const originalRequest = error.config;


//     if (error.response?.status === 401 && !originalRequest._retry) {

//       originalRequest._retry = true;

//       try {


//         const res = await axios.get(
//           "http://localhost:3001/api/auth/me",
//           { withCredentials: true }
//         );

//         // update redux
//         store.dispatch(
//           setAuth({
//             token: res.data.accessToken,
//             user: res.data.user
//           })
//         );

//         // attach new token
//         originalRequest.headers.Authorization =
//           `Bearer ${res.data.accessToken}`;

//         // retry original request
//         return api(originalRequest);

//       } catch (err) {

//         // refresh token expired
//         store.dispatch(logout());

//         window.location.href = "/login";

//         return Promise.reject(err);
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// // export default api;
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


/* RESPONSE INTERCEPTOR */

// api.interceptors.response.use(
//   (response) => response,

//   (error) => {
//     if (error.response?.status === 401) {
//       console.log("Unauthorized (401) detected → clearing session");

//       // Clear the invalid token
//       localStorage.removeItem("accessToken");

//       const skipRedirectPages = ["/", "/login", "/adminlogin", "/signup", "/otpverification", "/forgotpassword", "/resetpassword"];
//       const currentPath = window.location.pathname;

//       // Only redirect if NOT already on a public or auth page
//       if (!skipRedirectPages.includes(currentPath)) {
//         console.log("Redirecting to login portal");
//         if (currentPath.startsWith("/admin")) {
//           window.location.href = "/adminlogin";
//         } else {
//           window.location.href = "/login";
//         }
//       } else {
//         console.log("On a public or auth page, skipping redirect");
//       }
//     }

//     return Promise.reject(error);
//   }
// );





api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // List of auth endpoints that should NOT trigger a token refresh on 401
    const authEndpoints = ["/auth/login", "/auth/verify-otp", "/auth/signup", "/auth/resend-otp", "/auth/forgot-password", "/auth/reset-password", "/auth/admin-login"];

    const isAuthRequest = authEndpoints.some(endpoint => originalRequest.url?.includes(endpoint));

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthRequest) {

      originalRequest._retry = true;

      try {
        console.log("Access token expired → trying refresh");

        const res = await api.post("/auth/refresh");

        const newAccessToken = res.data.accessToken;

        // store new access token
        localStorage.setItem("accessToken", newAccessToken);

        // update header
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