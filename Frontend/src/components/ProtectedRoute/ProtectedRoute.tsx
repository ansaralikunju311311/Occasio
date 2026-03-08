import { Navigate } from "react-router-dom";
import { useAppSelector } from "../../redux/hook";
import {  type JSX } from "react";

export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const user = useAppSelector((state) => state.auth.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// export default ProtectedRoute;


export const ProtectedRouteAdmin =({children}:{children:JSX.Element})=>{
    const user = useAppSelector((state)=>state.auth.user);
    if(!user){
        return <Navigate to="/adminlogin" replace/>
    }
    return children
}