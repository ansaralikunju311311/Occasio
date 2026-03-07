import axios from "axios";
import { store } from "../redux/store";

export const api = axios.create({
  baseURL: "http://localhost:3001/api",
  withCredentials: true
});

let count = 0;
api.interceptors.request.use((config)=>{
  const state = store.getState();
  console.log("state ",state , count);
 count ++;
  const token = state.auth.accessToken;


   console.log("token will token",token)
  if(token){
    config.headers.Authorization = `Bearer ${token}`;
    console.log("checking anneeee",config.headers.Authorization)
  }
  console.log(config)
  return config;
});
export default api;