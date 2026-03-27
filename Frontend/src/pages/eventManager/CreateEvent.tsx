import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';

export const EventType = {
    ONLINE: "ONLINE",
    OFFLINE: "OFFLINE",
    HYBRID: "HYBRID"
} as const;

export type EventType = typeof EventType[keyof typeof EventType];

interface IEventFormInput {
    title: string;
    description: string;
    eventType: EventType;
    startTime: string;
    endTime: string;
    address: string;
    latitude: number;
    longitude: number;
    maxOnlineUsers?: number;
    price: number;
    banner?: FileList;
    isSeatLayoutEnabled?: boolean;
}

const CreateEvent = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<IEventFormInput>({
        defaultValues: {
            eventType: EventType.ONLINE,
            price: 0,
            latitude: 0,
            longitude: 0,
            isSeatLayoutEnabled: false
        }
    });

    const selectedEventType = watch("eventType");
    const [imagePreview, setImagePreview] = useState<string | null>(null);

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

        if (!res.ok) throw new Error("Image upload failed");

        const data = await res.json();
        return data.secure_url;
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setImagePreview(null);
        }
    };

    const handleRemoveImage = () => {
        setImagePreview(null);
    };

    const onSubmit: SubmitHandler<IEventFormInput> = async (data) => {
        try {
            setIsSubmitting(true);
            
            let bannerUrl = "";
            if (data.banner && data.banner.length > 0) {
                bannerUrl = await uploadImageToCloudinary(data.banner[0]);
            }

            const eventPayload = {
                ...data,
                location: (data.eventType === EventType.OFFLINE || data.eventType === EventType.HYBRID) ? {
                    type: "Point",
                    coordinates: [Number(data.longitude), Number(data.latitude)],
                    address: data.address
                } : null,
                startTime: new Date(data.startTime),
                endTime: new Date(data.endTime),
                maxOnlineUsers: (data.eventType === EventType.ONLINE || data.eventType === EventType.HYBRID) ? (data.maxOnlineUsers ? Number(data.maxOnlineUsers) : undefined) : undefined,
                price: Number(data.price),
                bannerUrl: bannerUrl
            };
            
            console.log('Form Submitted with Cloudinary URL', eventPayload);
            // Add API call here



            


            
        } catch (error) {
            console.error('Submission Error:', error);
            // You might want to add a toast notification here
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <div className="animate-fade-in-up pb-12">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white tracking-tight">
                    Create <span className="text-teal-400">New Event</span>
                </h1>
                <p className="text-slate-400 mt-2">Set up a new event for your audience with all the details.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Basic Details Section */}
                <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/60 rounded-2xl p-8 shadow-xl group hover:border-teal-500/30 transition-all duration-300">
                    <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                        <span className="p-2 bg-teal-500/10 rounded-lg mr-3 text-teal-400 border border-teal-500/20">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </span>
                        Basic Details
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Event Title <span className="text-red-500">*</span></label>
                            <input
                                {...register("title", { required: "Event Title is required" })}
                                type="text"
                                placeholder="E.g. Summer Music Festival"
                                className={`w-full bg-slate-800/50 border rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all ${errors.title ? 'border-red-500 focus:border-red-500' : 'border-slate-700 focus:border-teal-500'}`}
                            />
                            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Event Type <span className="text-red-500">*</span></label>
                            <div className="grid grid-cols-3 gap-3">
                                {[
                                    { id: EventType.ONLINE, label: 'Online', icon: <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg> },
                                    { id: EventType.OFFLINE, label: 'Offline', icon: <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
                                    { id: EventType.HYBRID, label: 'Hybrid', icon: <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg> }
                                ].map((type) => (
                                    <button
                                        key={type.id}
                                        type="button"
                                        onClick={() => setValue("eventType", type.id)}
                                        className={`flex items-center justify-center px-4 py-3 rounded-xl border transition-all font-medium ${selectedEventType === type.id 
                                            ? 'bg-teal-500/10 border-teal-500 text-teal-400 shadow-[0_0_15px_rgba(20,184,166,0.2)]' 
                                            : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-600 hover:text-slate-300'
                                        }`}
                                    >
                                        {type.icon}
                                        {type.label}
                                    </button>
                                ))}
                            </div>
                            <input type="hidden" {...register("eventType", { required: "Event Type is required" })} />
                            {errors.eventType && <p className="text-red-500 text-xs mt-1">{errors.eventType.message}</p>}
                        </div>
                    </div>
                </div>

                {/* Date & Time Section */}
                <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/60 rounded-2xl p-8 shadow-xl group hover:border-teal-500/30 transition-all duration-300">
                    <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                        <span className="p-2 bg-teal-500/10 rounded-lg mr-3 text-teal-400 border border-teal-500/20">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        </span>
                        Date & Time
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Start Time <span className="text-red-500">*</span></label>
                            <input
                                {...register("startTime", { required: "Start time is required" })}
                                type="datetime-local"
                                className={`w-full bg-slate-800/50 border rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all [color-scheme:dark] ${errors.startTime ? 'border-red-500 focus:border-red-500' : 'border-slate-700 focus:border-teal-500'}`}
                            />
                            {errors.startTime && <p className="text-red-500 text-xs mt-1">{errors.startTime.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">End Time <span className="text-red-500">*</span></label>
                            <input
                                {...register("endTime", { required: "End time is required" })}
                                type="datetime-local"
                                className={`w-full bg-slate-800/50 border rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all [color-scheme:dark] ${errors.endTime ? 'border-red-500 focus:border-red-500' : 'border-slate-700 focus:border-teal-500'}`}
                            />
                            {errors.endTime && <p className="text-red-500 text-xs mt-1">{errors.endTime.message}</p>}
                        </div>
                    </div>
                </div>

                {/* Location Details Section - Conditional */}
                {(selectedEventType === EventType.OFFLINE || selectedEventType === EventType.HYBRID) && (
                    <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/60 rounded-2xl p-8 shadow-xl group hover:border-teal-500/30 transition-all duration-300 animate-in fade-in slide-in-from-top-4 duration-500">
                        <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                            <span className="p-2 bg-teal-500/10 rounded-lg mr-3 text-teal-400 border border-teal-500/20">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            </span>
                            Location Details
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-medium text-slate-300">Venue Address <span className="text-red-500">*</span></label>
                                <input
                                    {...register("address", { required: "Address is required" })}
                                    type="text"
                                    placeholder="Full venue address"
                                    className={`w-full bg-slate-800/50 border rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all ${errors.address ? 'border-red-500 focus:border-red-500' : 'border-slate-700 focus:border-teal-500'}`}
                                />
                                {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Latitude (Coordinates)</label>
                                <input
                                    {...register("latitude", {
                                        valueAsNumber: true,
                                        validate: val => !val || (val >= -90 && val <= 90) || "Invalid latitude"
                                    })}
                                    type="number"
                                    step="any"
                                    placeholder="e.g. 40.7128"
                                    className={`w-full bg-slate-800/50 border rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all ${errors.latitude ? 'border-red-500 focus:border-red-500' : 'border-slate-700 focus:border-teal-500'}`}
                                />
                                {errors.latitude && <p className="text-red-500 text-xs mt-1">{errors.latitude.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Longitude (Coordinates)</label>
                                <input
                                    {...register("longitude", {
                                        valueAsNumber: true,
                                        validate: val => !val || (val >= -180 && val <= 180) || "Invalid longitude"
                                    })}
                                    type="number"
                                    step="any"
                                    placeholder="e.g. -74.0060"
                                    className={`w-full bg-slate-800/50 border rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all ${errors.longitude ? 'border-red-500 focus:border-red-500' : 'border-slate-700 focus:border-teal-500'}`}
                                />
                                {errors.longitude && <p className="text-red-500 text-xs mt-1">{errors.longitude.message}</p>}
                            </div>
                        </div>
                    </div>
                )}

                {/* Seat Layout Section - Conditional */}
                {(selectedEventType === EventType.OFFLINE || selectedEventType === EventType.HYBRID) && (
                    <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/60 rounded-2xl p-8 shadow-xl group hover:border-teal-500/30 transition-all duration-300 animate-in fade-in slide-in-from-top-4 duration-500 delay-75">
                        <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                            <span className="p-2 bg-teal-500/10 rounded-lg mr-3 text-teal-400 border border-teal-500/20">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>
                            </span>
                            Seat Layout
                        </h2>
                        
                        <div className="flex items-center justify-between p-4 bg-slate-800/30 border border-slate-700/50 rounded-xl">
                            <div>
                                <h3 className="text-white font-medium">Enable Seat Layout</h3>
                                <p className="text-xs text-slate-400">Specify precise seating for your venue</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    className="sr-only peer"
                                    {...register("isSeatLayoutEnabled")}
                                />
                                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500"></div>
                            </label>
                        </div>
                    </div>
                )}

                {/* Ticketing & Capacity Section */}
                <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/60 rounded-2xl p-8 shadow-xl group hover:border-teal-500/30 transition-all duration-300">
                    <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                        <span className="p-2 bg-teal-500/10 rounded-lg mr-3 text-teal-400 border border-teal-500/20">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>
                        </span>
                        Ticketing & Capacity
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Ticket Price ($) <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <span className="absolute left-4 top-3.5 text-slate-400 font-medium">$</span>
                                <input
                                    {...register("price", {
                                        required: "Price is required",
                                        valueAsNumber: true,
                                        min: { value: 0, message: "Price cannot be negative" },
                                        validate: val => !isNaN(val) || "Price must be a valid number"
                                    })}
                                    type="number"
                                    placeholder="0 for free events"
                                    min="0"
                                    className={`w-full bg-slate-800/50 border rounded-xl pl-8 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all ${errors.price ? 'border-red-500 focus:border-red-500' : 'border-slate-700 focus:border-teal-500'}`}
                                />
                            </div>
                            {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
                        </div>

                        {(selectedEventType === EventType.ONLINE || selectedEventType === EventType.HYBRID) && (
                            <div className="space-y-2 animate-in fade-in slide-in-from-left-4 duration-500">
                                <label className="text-sm font-medium text-slate-300">Total Online Capacity (Max Users)</label>
                                <input
                                    {...register("maxOnlineUsers", {
                                        valueAsNumber: true,
                                        min: { value: 1, message: "Capacity must be at least 1" },
                                        validate: val => !val || !isNaN(val) || "Must be a valid number"
                                    })}
                                    type="number"
                                    placeholder="Maximum attendees"
                                    min="1"
                                    className={`w-full bg-slate-800/50 border rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all ${errors.maxOnlineUsers ? 'border-red-500 focus:border-red-500' : 'border-slate-700 focus:border-teal-500'}`}
                                />
                                {errors.maxOnlineUsers && <p className="text-red-500 text-xs mt-1">{errors.maxOnlineUsers.message}</p>}
                            </div>
                        )}
                    </div>
                </div>

                {/* About Section */}
                <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/60 rounded-2xl p-8 shadow-xl group hover:border-teal-500/30 transition-all duration-300">
                    <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                        <span className="p-2 bg-teal-500/10 rounded-lg mr-3 text-teal-400 border border-teal-500/20">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" /></svg>
                        </span>
                        About the Event
                    </h2>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Event Description <span className="text-red-500">*</span></label>
                        <textarea
                            {...register("description", { required: "Description is required" })}
                            rows={5}
                            placeholder="Tell your audience what this event is about..."
                            className={`w-full bg-slate-800/50 border rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all resize-y ${errors.description ? 'border-red-500 focus:border-red-500' : 'border-slate-700 focus:border-teal-500'}`}
                        ></textarea>
                        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
                    </div>

                    <div className="mt-8">
                        <label className="text-sm font-medium text-slate-300 block mb-2">Event Banner / Image</label>
                        {imagePreview ? (
                            <div className="relative border border-slate-700 rounded-xl overflow-hidden group">
                                <img src={imagePreview} alt="Preview" className="w-full h-64 object-cover" />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <button 
                                        type="button" 
                                        onClick={handleRemoveImage}
                                        className="bg-red-500/20 text-red-400 border border-red-500/50 px-4 py-2 rounded-lg hover:bg-red-500 hover:text-white transition-all flex items-center"
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                        Remove Image
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <label className="border-2 border-dashed border-slate-700 rounded-xl p-8 text-center bg-slate-800/20 hover:bg-slate-800/50 hover:border-teal-500/50 transition-all cursor-pointer group/upload block">
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    className="hidden" 
                                    {...register("banner", {
                                        onChange: handleImageChange
                                    })} 
                                />
                                <div className="flex flex-col items-center justify-center">
                                    <svg className="w-10 h-10 text-slate-500 mb-3 group-hover/upload:text-teal-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                    <p className="text-sm text-slate-400 group-hover/upload:text-teal-300"><span className="font-semibold text-teal-500">Click to upload</span> or drag and drop</p>
                                    <p className="text-xs text-slate-500 mt-1">SVG, PNG, JPG or GIF (max. 800x400px)</p>
                                </div>
                            </label>
                        )}
                    </div>
                </div>

                <div className="flex justify-end gap-4 pt-4">
                    <button type="button" className="px-6 py-3 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white transition-all font-medium">
                        Save as Draft
                    </button>
                    <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="px-6 py-3 rounded-xl bg-teal-500 text-white hover:bg-teal-400 shadow-lg shadow-teal-500/20 transition-all font-medium flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
                                Publishing...
                            </>
                        ) : (
                            <>
                                Publish Event
                                <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                            </>
                        )}
                    </button>

                </div>
            </form>
        </div>
    );
};

export default CreateEvent;

