import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { api } from '../../services/api';
import { useAppSelector, useAppDispatch } from '../../redux/hook';
import { setAuth } from '../../redux/slices/authSlice';
import { UpgradeStatus } from '../../types/upgrade-status.enum';



interface ManagerFormData {
    fullName: string;
    organizationName: string;
    organizationType: string;
    experienceLevel: string;
    aboutEvents: string;
    socialLinks: string;
    documentReference: string;
    certificate: any;
}

const RocketIcon = () => (
    <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.59 14.37a6 6 0 01-5.84 0M4.74 11.24a3 3 0 013.12-2.9 3.1 3.1 0 011.85.61 3.1 3.1 0 011.85-.61 3 3 0 013.12 2.9M12 3c-1.1 0-2 .9-2 2v2h4V5c0-1.1-.9-2-2-2z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11v8m-4-4h8" />
    </svg>
);

const TrendingIcon = () => (
    <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
);

const UsersIcon = () => (
    <svg className="w-6 h-6 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
);

const ShieldIcon = () => (
    <svg className="w-6 h-6 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
);

const CheckIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
    </svg>
);

const BecomeAManager: React.FC = () => {


    const user = useAppSelector((state) => state.auth.user);


    console.log("thos userfrom the redux", user)
    const dispatch = useAppDispatch()
    const navigate = useNavigate();
    const [view, setView] = React.useState<'perks' | 'form' | 'success'>('perks');

    const [preview, setPreview] = React.useState<string | null>(null);





    const uploadImageToCloudinary = async (file: File) => {

        const formData = new FormData();

        formData.append("file", file);
        formData.append("upload_preset", "occasio_upload");

        const res = await fetch(
            "https://api.cloudinary.com/v1_1/dliraelbo/image/upload",
            {
                method: "POST",
                body: formData
            }
        );

        const data = await res.json();

        return data.secure_url;
    };
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors }
    } = useForm<ManagerFormData>();

    const certificateFile = watch("certificate");

    React.useEffect(() => {
        if (certificateFile && certificateFile.length > 0) {
            const file = certificateFile[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setPreview(null);
        }
    }, [certificateFile]);

    const perks = [
        {
            icon: <RocketIcon />,
            title: "Launch Events",
            description: "Create and publish your own unique event experiences to our global community."
        },
        {
            icon: <TrendingIcon />,
            title: "Revenue Growth",
            description: "Keep a larger share of your ticket sales and unlock premium monetization features."
        },
        {
            icon: <UsersIcon />,
            title: "Audience Insights",
            description: "Access detailed analytics to understand your attendees and grow your brand."
        },
        {
            icon: <ShieldIcon />,
            title: "Priority Support",
            description: "Get dedicated 24/7 assistance for all your event management needs."
        }
    ];

    const onSubmit = async (data: ManagerFormData) => {

        const file = data.certificate[0];

        const imageUrl = await uploadImageToCloudinary(file);

        const payload = {
            ...data,
            certificate: imageUrl
        };

        console.log("Final Data:", payload);


        const response = await api.post("/user/upgraderole", {
            email: user?.email,
            fullName: payload.fullName,
            organizationName: payload.organizationName,
            aboutEvents: payload.aboutEvents,
            certificate: payload.certificate,
            documentReference: payload.documentReference,
            experienceLevel: payload.experienceLevel,
            socialLinks: payload.socialLinks,
            organizationType: payload.organizationType
        })
        console.log("for the chekign the checking the thingssss", response)

        dispatch(
            setAuth({
                user: response.data.users
            })
        )
        setView('success');
    };

    return (
        <div className="min-h-screen bg-[#050B18] text-white selection:bg-indigo-500/30 overflow-x-hidden">
            {/* Background Glows */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full" />
            </div>

            <div className="relative max-w-7xl mx-auto px-6 py-20 lg:py-32">
                {user?.role === 'EVENT_MANAGER' ? (
                    <div className="max-w-2xl mx-auto text-center animate-in fade-in zoom-in-95 duration-500">
                        <div className="w-24 h-24 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-indigo-500/20 shadow-2xl shadow-indigo-500/10">
                            <CheckIcon className="w-12 h-12 text-indigo-400" />
                        </div>
                        <h2 className="text-4xl font-bold mb-4">Welcome, Manager</h2>
                        <p className="text-slate-400 text-lg mb-10 max-w-md mx-auto">
                            You are already an Event Manager. You can access your specialized tools and manage your events from the dashboard.
                        </p>
                        <button
                            onClick={() => navigate('/eventmanager/stats')}
                            className="px-8 py-4 bg-linear-to-r from-indigo-600 to-purple-700 hover:from-indigo-500 hover:to-purple-600 text-white font-bold rounded-2xl transition-all shadow-xl shadow-indigo-500/20"
                        >
                            Go to Dashboard
                        </button>
                    </div>
                ) : user?.applyingupgrade === UpgradeStatus.REJECTED ? (
                    <div className="max-w-2xl mx-auto text-center animate-in fade-in zoom-in-95 duration-500">
                        <div className="w-24 h-24 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-rose-500/20 shadow-2xl shadow-rose-500/10">
                            <svg className="w-12 h-12 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <h2 className="text-4xl font-bold mb-4 text-rose-500">Application Rejected</h2>
                        <p className="text-slate-400 text-lg mb-10 max-w-md mx-auto">
                            Unfortunately, your application to become an event manager has been rejected at this time. Please contact support for more information or try again later.
                        </p>
                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={() => navigate('/')}
                                className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl transition-all"
                            >
                                Back to Homepage
                            </button>
                        </div>
                    </div>
                ) : user?.applyingupgrade === UpgradeStatus.PENDING ? (
                    <div className="max-w-2xl mx-auto text-center animate-in fade-in zoom-in-95 duration-500">
                        <div className="w-24 h-24 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-amber-500/20 shadow-2xl shadow-amber-500/10">
                            <svg className="w-12 h-12 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" fill="none" />
                            </svg>
                        </div>
                        <h2 className="text-4xl font-bold mb-4">Application Under Review</h2>
                        <p className="text-slate-400 text-lg mb-10 max-w-md mx-auto">
                            Your application to become an event manager is currently pending admin approval. You will receive an update once it's reviewed.
                        </p>
                        <button
                            onClick={() => navigate('/')}
                            className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl transition-all"
                        >
                            Return to Homepage
                        </button>
                    </div>
                ) : (
                    <>
                        {view === 'perks' && (
                            <div className="grid lg:grid-cols-2 gap-16 items-center">

                                {/* Left Content */}
                                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
                                    <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium">
                                        <span className="relative flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                                        </span>
                                        <span>Join the Elite Event Managers</span>
                                    </div>

                                    <h1 className="text-5xl lg:text-7xl font-black tracking-tighter leading-tight">
                                        Elevate Your <br />
                                        <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 via-purple-500 to-pink-500">
                                            Event Game
                                        </span>
                                    </h1>

                                    <p className="text-xl text-slate-400 max-w-lg leading-relaxed">
                                        Stop attending. Start leading. Our manager tools give you everything you need to build a thriving event ecosystem.
                                    </p>

                                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                        <button
                                            onClick={() => setView('form')}
                                            className="px-8 py-4 bg-linear-to-r from-indigo-600 to-purple-700 hover:from-indigo-500 hover:to-purple-600 text-white font-bold rounded-2xl shadow-2xl shadow-indigo-500/20 transition-all hover:scale-105 active:scale-95 group flex items-center justify-center gap-2"
                                        >
                                            Become a Manager
                                            <CheckIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                        </button>
                                        <button
                                            onClick={() => navigate(-1)}
                                            className="px-8 py-4 bg-slate-900/50 hover:bg-slate-800/80 text-white border border-slate-700 font-bold rounded-2xl transition-all"
                                        >
                                            Not Ready Yet
                                        </button>
                                    </div>
                                </div>

                                {/* Right Content - Stats/Card */}
                                <div className="relative animate-in fade-in slide-in-from-right-5 duration-1000">
                                    <div className="absolute inset-0 bg-linear-to-r from-indigo-500/20 to-purple-500/20 blur-[80px] rounded-3xl" />
                                    <div className="relative bg-slate-900/40 backdrop-blur-3xl border border-white/10 p-8 lg:p-12 rounded-[2.5rem] shadow-2xl space-y-8">
                                        <h3 className="text-2xl font-bold">Why Upgrade?</h3>

                                        <div className="space-y-6">
                                            {perks.map((perk, index) => (
                                                <div key={index} className="flex gap-4 group">
                                                    <div className="shrink-0 w-12 h-12 rounded-xl bg-slate-800/50 border border-white/5 flex items-center justify-center group-hover:border-indigo-500/50 transition-colors">
                                                        {perk.icon}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-lg mb-1">{perk.title}</h4>
                                                        <p className="text-slate-400 text-sm leading-relaxed">{perk.description}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="pt-6 border-t border-white/5">
                                            <div className="flex items-center justify-between text-sm text-slate-500">
                                                <span>Upgrade Fee</span>
                                                <span className="text-teal-400 font-bold text-lg">FREE (Beta)</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {view === 'form' && (
                            <div className="max-w-3xl mx-auto animate-in fade-in zoom-in-95 duration-500">
                                <div className="text-center mb-12">
                                    <h2 className="text-4xl font-bold mb-4">Manager Application</h2>
                                    <p className="text-slate-400 text-lg">Tell us a bit about yourself and your experience.</p>
                                </div>

                                <form onSubmit={handleSubmit(onSubmit)} className="bg-slate-900/40 backdrop-blur-3xl border border-white/10 p-8 lg:p-10 rounded-[2.5rem] shadow-2xl space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-slate-300 ml-1">Full Name</label>
                                            <input
                                                type="text"
                                                placeholder="John Doe"
                                                {...register("fullName", { required: "Full name is required" })}
                                                className={`w-full px-5 py-4 bg-slate-800/50 border ${errors.fullName ? 'border-red-500' : 'border-white/5'} rounded-2xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all outline-none`}
                                            />
                                            {errors.fullName && <p className="text-red-500 text-xs mt-1 ml-1">{errors.fullName.message}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-slate-300 ml-1">Organization Name</label>
                                            <input
                                                type="text"
                                                placeholder="Epic Events Co."
                                                {...register("organizationName", { required: "Organization name is required" })}
                                                className={`w-full px-5 py-4 bg-slate-800/50 border ${errors.organizationName ? 'border-red-500' : 'border-white/5'} rounded-2xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all outline-none`}
                                            />
                                            {errors.organizationName && <p className="text-red-500 text-xs mt-1 ml-1">{errors.organizationName.message}</p>}
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-slate-300 ml-1">Type of Organization</label>
                                            <input
                                                type="text"
                                                placeholder="e.g. Individual, Music, Tech, Corporate"
                                                {...register("organizationType", { required: "Organization type is required" })}
                                                className={`w-full px-5 py-4 bg-slate-800/50 border ${errors.organizationType ? 'border-red-500' : 'border-white/5'} rounded-2xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all outline-none`}
                                            />
                                            {errors.organizationType && <p className="text-red-500 text-xs mt-1 ml-1">{errors.organizationType.message}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-slate-300 ml-1">Experience Level</label>
                                            <div className="relative">
                                                <select
                                                    {...register("experienceLevel", { required: "Please select experience level" })}
                                                    className={`w-full px-5 py-4 bg-slate-800/50 border ${errors.experienceLevel ? 'border-red-500' : 'border-white/5'} rounded-2xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all outline-none appearance-none cursor-pointer`}
                                                >
                                                    <option value="">Select Level</option>
                                                    <option value="beginner">Beginner (0-1 years)</option>
                                                    <option value="intermediate">Intermediate (1-3 years)</option>
                                                    <option value="professional">Professional (3-5 years)</option>
                                                    <option value="expert">Expert (5+ years)</option>
                                                </select>
                                                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </div>
                                            </div>
                                            {errors.experienceLevel && <p className="text-red-500 text-xs mt-1 ml-1">{errors.experienceLevel.message}</p>}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-300 ml-1">About Your Events</label>
                                        <textarea
                                            rows={3}
                                            placeholder="Briefly describe the types of events you've hosted or plan to host..."
                                            {...register("aboutEvents", { required: "Description is required", minLength: { value: 20, message: "Please provide a bit more detail (min 20 chars)" } })}
                                            className={`w-full px-5 py-4 bg-slate-800/50 border ${errors.aboutEvents ? 'border-red-500' : 'border-white/5'} rounded-2xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all outline-none resize-none`}
                                        />
                                        {errors.aboutEvents && <p className="text-red-500 text-xs mt-1 ml-1">{errors.aboutEvents.message}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-300 ml-1">Past Event / Social Proof Links</label>
                                        <input
                                            type="text"
                                            placeholder="Links to past events, Instagram, LinkedIn, etc."
                                            {...register("socialLinks", { required: "Social proof is required for verification" })}
                                            className={`w-full px-5 py-4 bg-slate-800/50 border ${errors.socialLinks ? 'border-red-500' : 'border-white/5'} rounded-2xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all outline-none`}
                                        />
                                        {errors.socialLinks && <p className="text-red-500 text-xs mt-1 ml-1">{errors.socialLinks.message}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-300 ml-1">Identity Verification / Document Reference</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. ID Number, GST Number, or Document Link"
                                            {...register("documentReference", { required: "Identity verification reference is required" })}
                                            className={`w-full px-5 py-4 bg-slate-800/50 border ${errors.documentReference ? 'border-red-500' : 'border-white/5'} rounded-2xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all outline-none`}
                                        />
                                        {errors.documentReference && <p className="text-red-500 text-xs mt-1 ml-1">{errors.documentReference.message}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-300 ml-1">Upload Certificate / Proof of Work (Image)</label>
                                        <div className={`relative group border-2 border-dashed ${errors.certificate ? 'border-red-500' : 'border-slate-800'} hover:border-indigo-500/50 rounded-2xl p-8 transition-all bg-slate-800/20 text-center`}>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                {...register("certificate", {
                                                    required: "Certificate/Proof image is required",
                                                    validate: {
                                                        lessThan2MB: (files) => files[0]?.size < 2000000 || 'Max size is 2MB',
                                                        acceptedFormats: (files) => ['image/jpeg', 'image/png', 'image/webp'].includes(files[0]?.type) || 'Only JPEG, PNG and WebP are accepted'
                                                    }
                                                })}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                            />

                                            {!preview ? (
                                                <div className="space-y-3">
                                                    <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center mx-auto text-indigo-400">
                                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                                        </svg>
                                                    </div>
                                                    <div className="text-sm text-slate-400">
                                                        <span className="text-indigo-400 font-bold">Click to upload</span> or drag and drop
                                                    </div>
                                                    <div className="text-xs text-slate-500 uppercase tracking-widest font-semibold text-[10px]">
                                                        PNG, JPG or WebP (MAX. 2MB)
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="relative group/preview inline-block">
                                                    <img
                                                        src={preview}
                                                        alt="Preview"
                                                        className="max-h-48 rounded-xl ring-1 ring-white/10 shadow-2xl"
                                                    />
                                                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm opacity-0 group-hover/preview:opacity-100 transition-opacity rounded-xl flex items-center justify-center text-white text-xs font-bold">
                                                        Change Image
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        {errors.certificate && <p className="text-red-500 text-xs mt-1 ml-1">{errors.certificate.message?.toString()}</p>}
                                    </div>

                                    <div className="flex gap-4 pt-4">
                                        <button
                                            type="button"
                                            onClick={() => setView('perks')}
                                            className="flex-1 px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl transition-all"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="flex-2 px-8 py-4 bg-linear-to-r from-indigo-600 to-purple-700 hover:from-indigo-500 hover:to-purple-600 text-white font-bold rounded-2xl shadow-xl shadow-indigo-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                                        >
                                            Submit Application
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {view === 'success' && (
                            <div className="max-w-2xl mx-auto text-center animate-in fade-in zoom-in-95 duration-500">
                                <div className="w-24 h-24 bg-teal-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-teal-500/20 shadow-2xl shadow-teal-500/10">
                                    <CheckIcon className="w-12 h-12 text-teal-400" />
                                </div>
                                <h2 className="text-4xl font-bold mb-4">Application Submitted!</h2>
                                <p className="text-slate-400 text-lg mb-10 max-w-md mx-auto">
                                    Thank you for applying. Our admin team will review your proof of work and identity details. You'll hear from us within 24-48 hours.
                                </p>
                                <button
                                    onClick={() => navigate('/')}
                                    className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl transition-all"
                                >
                                    Return to Homepage
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default BecomeAManager;
