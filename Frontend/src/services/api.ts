import axios from "axios";
// import { store } from "../redux/store";

export const api = axios.create({
  baseURL: "http://localhost:3001/api",
  withCredentials: true
});


api.interceptors.request.use((config)=>{
  const token = localStorage.getItem("accessToken");
  console.log("token  token",token)
  if(token){
    config.headers.Authorization = `Bearer ${token}`
  }
  return config;
})
// let count = 0;
// api.interceptors.request.use((config)=>{
//   const state = store.getState();
//   console.log("state ",state , count);
//  count ++;
//   const token = state.auth.accessToken;


//    console.log("token will token",token)
//   if(token){
//     config.headers.Authorization = `Bearer ${token}`;
//     console.log("checking anneeee",config.headers.Authorization)
//   }
//   console.log(config)
//   return config;
// });
// export default api;



// import axios from "axios";
// import { store } from "../redux/store";
// import { setAuth, logout } from "../redux/slices/authSlice";

// export const api = axios.create({
//   baseURL: "http://localhost:3001/api",
//   withCredentials: true
// });



// api.interceptors.request.use((config) => {

//   const state = store.getState();
//   const token = state.auth.accessToken;

//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }

//   return config;
// });


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

// export default api;