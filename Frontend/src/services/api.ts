import axios from "axios";
import { store } from "../redux/store";

export const api = axios.create({
  baseURL: "http://localhost:3001/api",
  withCredentials: true
});


api.interceptors.request.use((config)=>{
  const state = store.getState();
  console.log("state",state);
  const token = state.auth.accessToken;
  if(token){
    config.headers.Authorization = `Bearer ${token}`;
    console.log("checking anneeee",config.headers.Authorization)
  }
  console.log(config)
  return config;
});
export default api;