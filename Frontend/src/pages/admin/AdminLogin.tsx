// import { useState } from "react";
import { useForm } from "react-hook-form";
import type { LoginDataType } from "../../types/auth.type";
import { api } from '../../services/api';
import { useNavigate } from "react-router-dom";
// import { useAppDispatch } from "../../redux/hook";
// import { setAuth } from "../../redux/slices/authSlice";

const AdminLogin = () => {
    // const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    // const dispath = useAppDispatch()
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginDataType>({
        mode: "onBlur",
    });

    const onSubmit = async (data: LoginDataType) => {
        // setIsLoading(true);
        try {
            const response = await api.post("/auth/admin/login", {
                email: data.email,
                password: data.password,
                role: "ADMIN"
            });



    //         dispath(
    //             setAuth({
    //                 token:response.data.accessToken,
    //                 user:response.data.user
    //             })
    //         )





            console.log(response);
            navigate("/admin/dashboard");
        } catch (error: any) {
            if (error.response) {
                alert(error.response.data.message);
            } else {
                alert("Something went wrong");
            }
        } 
        // finally {
        //     setIsLoading(false);
        // }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#070b14] relative overflow-hidden font-sans">

            {/* Dynamic Background Elements */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-emerald-600/20 rounded-full mix-blend-screen filter blur-[100px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-teal-600/20 rounded-full mix-blend-screen filter blur-[100px] animate-pulse" style={{ animationDelay: "2s" }}></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-transparent via-[#070b14]/80 to-[#070b14] z-0"></div>
            </div>

            <div className="w-full max-w-md p-6 relative z-10 animate-fade-in-up">

                {/* Logo and Header Context */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 mb-6 shadow-[0_0_30px_rgb(16,185,129,0.15)] glow-animation group">
                        <svg className="w-8 h-8 text-emerald-400 group-hover:scale-110 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
                        Admin <span className="text-emerald-400">Portal</span>
                    </h1>
                    <p className="text-sm text-slate-400 uppercase tracking-widest font-semibold flex items-center justify-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        Occasio Secure Access
                    </p>
                </div>

                {/* Login Card */}
                <div className="bg-slate-900/40 backdrop-blur-2xl rounded-4xl p-8 md:p-10 shadow-2xl shadow-black/50 border border-slate-800/60 relative overflow-hidden group hover:border-emerald-500/30 transition-colors duration-500">

                    <div className="absolute inset-0 bg-linear-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                    <form className="space-y-7 relative z-10" onSubmit={handleSubmit(onSubmit)}>

                        {/* EMAIL */}
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-wider">
                                Admin Email
                            </label>
                            <div className="relative group/input">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within/input:text-emerald-400">
                                    <svg className="h-5 w-5 text-slate-500 group-focus-within/input:text-emerald-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                    </svg>
                                </div>
                                <input
                                    type="email"
                                    placeholder="admin@occasio.com"
                                    {...register("email", {
                                        required: "Email is required",
                                        pattern: {
                                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                            message: "Enter a valid email address",
                                        },
                                    })}
                                    className="block w-full pl-11 pr-4 py-3.5 bg-[#0a0f16]/80 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all font-medium"
                                />
                            </div>
                            {errors.email && (
                                <p className="text-emerald-400 text-sm mt-2 flex items-center animate-fade-in-up">
                                    <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        {/* PASSWORD */}
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-wider">
                                Security Key
                            </label>
                            <div className="relative group/input">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-slate-500 group-focus-within/input:text-emerald-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    {...register("password", {
                                        required: "Password is required",
                                    })}
                                    className="block w-full pl-11 pr-4 py-3.5 bg-[#0a0f16]/80 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all font-medium tracking-widest"
                                />
                            </div>
                            {errors.password && (
                                <p className="text-emerald-400 text-sm mt-2 flex items-center animate-fade-in-up">
                                    <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                // disabled={isLoading}
                                className="w-full py-4 px-4 bg-linear-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white rounded-xl font-bold shadow-[0_0_20px_rgb(16,185,129,0.2)] hover:shadow-[0_0_30px_rgb(16,185,129,0.4)] hover:-translate-y-0.5 transition-all duration-300 border border-emerald-400/20 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex justify-center items-center"
                            >
                                {/* {isLoading ? (
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : ( */}
                                    "Establish Connection"
                                {/* )} */}
                            </button>
                        </div>
                    </form>

                </div>

                {/* Footer info */}
                <p className="text-center text-xs text-slate-600 mt-8 font-medium">
                    Restricted System. Unauthorized access is strictly prohibited.
                </p>

            </div>
        </div>
    );
};

export default AdminLogin;
