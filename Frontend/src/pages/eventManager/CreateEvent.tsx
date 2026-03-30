import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { api } from '../../services/api';
// import EventMap from '../../components/eventManager/EventMap';

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
    layout?: any;
}

const CreateEvent = () => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const { register, handleSubmit, setValue, watch, reset, formState: { errors }, trigger } = useForm<IEventFormInput>({
        mode: "onChange",
        defaultValues: {
            eventType: EventType.ONLINE,
            price: 0,
            latitude: 0,
            longitude: 0,
            isSeatLayoutEnabled: false
        }
    });

    const selectedEventType = watch("eventType");
    const startTimeValue = watch("startTime");
    const isSeatLayoutEnabled = watch("isSeatLayoutEnabled");
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    // Layout Builder State
    const [layoutBlocks, setLayoutBlocks] = useState<any[]>([
        {
            blockName: "",
            category: { name: "", price: "" },
            rows: [{ rowNumber: 1, columns: "" }]
        }
    ]);

    const addBlock = () => {
        setLayoutBlocks(prev => [...prev, {
            blockName: "",
            category: { name: "", price: "" },
            rows: [{ rowNumber: 1, columns: "" }]
        }]);
    };

    const removeBlock = (index: number) => {
        setLayoutBlocks(prev => prev.filter((_, i) => i !== index));
    };

    const updateBlock = (index: number, field: string, value: any) => {
        setLayoutBlocks(prev => {
            const newBlocks = [...prev];
            // deep copy the block and category to avoid strict mode mutations
            const blockCopy = { ...newBlocks[index], category: { ...newBlocks[index].category } };
            
            if (field === 'blockName') blockCopy.blockName = value;
            if (field === 'categoryName') blockCopy.category.name = value;
            if (field === 'categoryPrice') blockCopy.category.price = value === "" ? "" : Number(value);
            
            newBlocks[index] = blockCopy;
            return newBlocks;
        });
    };

    const addRow = (blockIndex: number) => {
        setLayoutBlocks(prev => {
            const newBlocks = [...prev];
            const blockCopy = { ...newBlocks[blockIndex] };
            const rowsCopy = [...blockCopy.rows];
            
            const nextRowNumber = rowsCopy.length > 0 ? rowsCopy[rowsCopy.length - 1].rowNumber + 1 : 1;
            rowsCopy.push({ rowNumber: nextRowNumber, columns: "" });
            
            blockCopy.rows = rowsCopy;
            newBlocks[blockIndex] = blockCopy;
            return newBlocks;
        });
    };

    const removeRow = (blockIndex: number, rowIndex: number) => {
        setLayoutBlocks(prev => {
            const newBlocks = [...prev];
            const blockCopy = { ...newBlocks[blockIndex] };
            
            let rowsCopy = blockCopy.rows.filter((_: any, i: number) => i !== rowIndex);
            // Reassign row numbers immutably to keep them sequential
            rowsCopy = rowsCopy.map((r: any, i: number) => ({ ...r, rowNumber: i + 1 }));
            
            blockCopy.rows = rowsCopy;
            newBlocks[blockIndex] = blockCopy;
            return newBlocks;
        });
    };

    const updateRowColumns = (blockIndex: number, rowIndex: number, columns: number | string) => {
        setLayoutBlocks(prev => {
            const newBlocks = [...prev];
            const blockCopy = { ...newBlocks[blockIndex] };
            const rowsCopy = [...blockCopy.rows];
            
            rowsCopy[rowIndex] = { 
                ...rowsCopy[rowIndex], 
                columns: columns === "" ? "" : Number(columns) 
            };
            
            blockCopy.rows = rowsCopy;
            newBlocks[blockIndex] = blockCopy;
            return newBlocks;
        });
    };

    // Helper to get local ISO string (YYYY-MM-DDTHH:MM) for datetime-local
    const getLocalISOString = (date: Date) => {
        const tzOffset = date.getTimezoneOffset() * 60000;
        return new Date(date.getTime() - tzOffset).toISOString().slice(0, 16);
    };

    const minDateTime = getLocalISOString(new Date());

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

            const now = new Date();
            const start = new Date(data.startTime);
            const end = new Date(data.endTime);

            if (start.getTime() < (now.getTime() - 60000)) {
                toast.error("Start time is in the past! Please select a future time.");
                setIsSubmitting(false);
                return;
            }

            if (end <= start) {
                toast.error("End time must be after start time!");
                setIsSubmitting(false);
                return;
            }

            let bannerUrl = "";
            if (data.banner && data.banner.length > 0) {
                bannerUrl = await uploadImageToCloudinary(data.banner[0]);
            }

            const eventPayload = {
                ...data,
                location: (data.eventType === EventType.OFFLINE || data.eventType === EventType.HYBRID) ? {
                    type: "Point",
                    coordinates: [Number(data.longitude), Number(data.latitude)],
                    address: null
                } : null,
                startTime: new Date(data.startTime),
                endTime: new Date(data.endTime),
                maxOnlineUsers: (data.eventType === EventType.ONLINE || data.eventType === EventType.HYBRID) ? (data.maxOnlineUsers ? Number(data.maxOnlineUsers) : undefined) : undefined,
                price: Number(data.price),
                bannerUrl: bannerUrl,
                layout: (data.isSeatLayoutEnabled && (data.eventType === EventType.OFFLINE || data.eventType === EventType.HYBRID)) ? { blocks: layoutBlocks } : undefined
            };

            console.log('Form Submitted with Cloudinary URL', eventPayload);






            const response = await api.post("/events/creation", eventPayload);
            console.log("well the contoller", response)

            toast.success("Event created successfully!");
            setShowSuccessModal(true);






        } catch (error) {
            console.error('Submission Error:', error);
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
                                {...register("startTime", {
                                    required: "Start time is required",
                                    validate: (value) => {
                                        const now = new Date();
                                        const start = new Date(value);
                                        // Allow a small buffer (1 minute) for selection lag
                                        return start.getTime() >= (now.getTime() - 60000) || "Start time cannot be in the past";
                                    },
                                    onChange: () => trigger("endTime") // Re-validate end time when start time changes
                                })}
                                type="datetime-local"
                                min={minDateTime}
                                className={`w-full bg-slate-800/50 border rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all scheme-dark ${errors.startTime ? 'border-red-500 focus:border-red-500' : 'border-slate-700 focus:border-teal-500'}`}
                            />
                            {errors.startTime && <p className="text-red-500 text-xs mt-1">{errors.startTime.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">End Time <span className="text-red-500">*</span></label>
                            <input
                                {...register("endTime", {
                                    required: "End time is required",
                                    validate: (value) => {
                                        if (!startTimeValue) return true;
                                        const start = new Date(startTimeValue);
                                        const end = new Date(value);
                                        return end > start || "End time must be after start time";
                                    }
                                })}
                                type="datetime-local"
                                min={startTimeValue || minDateTime}
                                className={`w-full bg-slate-800/50 border rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all scheme-dark ${errors.endTime ? 'border-red-500 focus:border-red-500' : 'border-slate-700 focus:border-teal-500'}`}
                            />
                            {errors.endTime && <p className="text-red-500 text-xs mt-1">{errors.endTime.message}</p>}
                        </div>
                    </div>
                </div>

                {(selectedEventType === EventType.OFFLINE || selectedEventType === EventType.HYBRID) && (
                    <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/60 rounded-2xl p-8 shadow-xl group hover:border-teal-500/30 transition-all duration-300 animate-in fade-in slide-in-from-top-4">
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

                            {/* <div className="space-y-2">
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
                            </div> */}

                            {/* <div className="space-y-2">
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
                            </div> */}
                        </div>
                    </div>
                )}

                {(selectedEventType === EventType.OFFLINE || selectedEventType === EventType.HYBRID) && (
                    <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/60 rounded-2xl p-8 shadow-xl group hover:border-teal-500/30 transition-all duration-300 animate-in fade-in slide-in-from-top-4 delay-75">
                        <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                            <span className="p-2 bg-teal-500/10 rounded-lg mr-3 text-teal-400 border border-teal-500/20">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>
                            </span>
                            Seat Layout
                        </h2>

                        <div className="flex items-center justify-between p-4 bg-slate-800/30 border border-slate-700/50 rounded-xl mb-4">
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
                                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500"></div>
                            </label>
                        </div>
                        
                        {isSeatLayoutEnabled && (
                            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
                                {layoutBlocks.map((block, blockIndex) => (
                                    <div key={blockIndex} className="bg-slate-800/40 border border-slate-700 rounded-xl p-5 relative overflow-hidden group/block">
                                        <div className="absolute top-0 left-0 w-1 h-full bg-teal-500/50"></div>
                                        
                                        <div className="flex justify-between items-start mb-4">
                                            <h4 className="text-slate-200 font-semibold flex items-center">
                                                <span className="bg-slate-700 text-teal-400 text-xs px-2 py-1 rounded mr-2 font-mono">Block {blockIndex + 1}</span>
                                            </h4>
                                            {layoutBlocks.length > 1 && (
                                                <button 
                                                    type="button" 
                                                    onClick={() => removeBlock(blockIndex)}
                                                    className="text-slate-500 hover:text-red-400 p-1 bg-slate-800 rounded transition-all"
                                                    title="Remove Block"
                                                >
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                </button>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 relative z-10">
                                            <div>
                                                <label className="block text-xs font-medium text-slate-400 mb-1">Block Name (e.g., A, Left Balcony)</label>
                                                <input 
                                                    type="text" 
                                                    value={block.blockName} 
                                                    onChange={(e) => updateBlock(blockIndex, 'blockName', e.target.value)}
                                                    className="w-full bg-slate-900/50 border border-slate-700/80 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-teal-500 transition-colors"
                                                    placeholder="Block Name"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-slate-400 mb-1">Category Name</label>
                                                <select
                                                    value={block.category.name}
                                                    onChange={(e) => updateBlock(blockIndex, 'categoryName', e.target.value)}
                                                    className={`w-full bg-slate-900/50 border border-slate-700/80 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal-500 transition-colors ${!block.category.name ? 'text-slate-500' : 'text-white'}`}
                                                >
                                                    <option value="" disabled>Select Category</option>
                                                    <option value="VIP">VIP</option>
                                                    <option value="VVIP">VVIP</option>
                                                    <option value="PREMIUM">PREMIUM</option>
                                                    <option value="GOLD">GOLD</option>
                                                    <option value="SILVER">SILVER</option>
                                                    <option value="REGULAR">REGULAR</option>
                                                    <option value="BALCONY">BALCONY</option>
                                                    <option value="BOX">BOX</option>
                                                    <option value="RECLINER">RECLINER</option>
                                                    <option value="FAN_PIT">FAN_PIT</option>
                                                    <option value="GENERAL">GENERAL</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-slate-400 mb-1">Price per Seat ($)</label>
                                                <input 
                                                    type="number" 
                                                    min="0"
                                                    value={block.category.price} 
                                                    onChange={(e) => updateBlock(blockIndex, 'categoryPrice', e.target.value)}
                                                    className="w-full bg-slate-900/50 border border-slate-700/80 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-teal-500 transition-colors"
                                                    placeholder="0"
                                                />
                                            </div>
                                        </div>

                                        <div className="bg-slate-900/30 rounded-lg p-4 border border-slate-800/50">
                                            <div className="flex justify-between items-center mb-3">
                                                <h5 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Rows in this Block</h5>
                                                <button 
                                                    type="button" 
                                                    onClick={() => addRow(blockIndex)}
                                                    className="text-xs text-teal-400 hover:text-teal-300 font-medium px-2 py-1 bg-teal-500/10 rounded border border-teal-500/20 transition-all flex items-center"
                                                >
                                                    <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                                    Add Row
                                                </button>
                                            </div>

                                            <div className="space-y-2">
                                                {block.rows.map((row: any, rowIndex: number) => (
                                                    <div key={rowIndex} className="flex items-center gap-3 bg-slate-800/50 px-3 py-2 rounded-lg border border-slate-700/50">
                                                        <span className="text-xs font-mono text-slate-500 w-12 shrink-0">Row {row.rowNumber}</span>
                                                        <div className="flex-1 flex items-center bg-slate-900/80 rounded-md border border-slate-700 overflow-hidden focus-within:border-teal-500">
                                                            <span className="text-[10px] text-slate-500 px-2 bg-slate-800/50 uppercase tracking-wider border-r border-slate-700 h-full flex items-center">Seats</span>
                                                            <input 
                                                                type="number" 
                                                                min="1"
                                                                value={row.columns}
                                                                onChange={(e) => updateRowColumns(blockIndex, rowIndex, e.target.value as any)}
                                                                className="w-full bg-transparent border-none text-white text-sm px-2 py-1.5 focus:outline-none focus:ring-0"
                                                                placeholder="Columns"
                                                            />
                                                        </div>
                                                        <button 
                                                            type="button" 
                                                            onClick={() => removeRow(blockIndex, rowIndex)}
                                                            className="text-slate-600 hover:text-red-400 transition-colors p-1"
                                                            title="Delete Row"
                                                            disabled={block.rows.length <= 1}
                                                        >
                                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                <button 
                                    type="button" 
                                    onClick={addBlock}
                                    className="w-full py-3 border-2 border-dashed border-slate-700 rounded-xl text-slate-400 font-medium hover:border-teal-500/50 hover:bg-slate-800/30 hover:text-teal-400 transition-all flex items-center justify-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                                    Add Another Block
                                </button>
                            </div>
                        )}
                    </div>
                )}

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


            {showSuccessModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">


                    <div
                        className="absolute inset-0 bg-slate-950/80 backdrop-blur-md animate-fade-in"
                        onClick={() => setShowSuccessModal(false)}
                    ></div>


                    <div className="relative bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl animate-scale-in">
                        <div className="flex flex-col items-center text-center">

                            <div className="w-20 h-20 bg-teal-500/10 rounded-full flex items-center justify-center mb-6 border border-teal-500/20 shadow-[0_0_30px_rgba(20,184,166,0.2)]">
                                <svg className="w-10 h-10 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>

                            <h2 className="text-2xl font-bold text-white mb-2 underline decoration-teal-500/50 decoration-4 underline-offset-4">Event Created!</h2>
                            <p className="text-slate-400 mb-8 mt-4">
                                Your event has been successfully scheduled and published.
                                It's now active on our platform.
                            </p>

                            <div className="grid grid-cols-1 gap-3 w-full">
                                <button
                                    onClick={() => navigate("/eventmanager/stats")}
                                    className="w-full bg-teal-500 hover:bg-teal-400 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-teal-500/20 flex items-center justify-center"
                                >
                                    Go to Dashboard
                                    <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                                </button>

                                <button
                                    onClick={() => navigate("/eventmanager/my-events")}
                                    className="w-full bg-slate-800 hover:bg-slate-700 text-white font-semibold py-4 rounded-2xl border border-slate-700 transition-all flex items-center justify-center"
                                >
                                    View My Events
                                    <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                                </button>

                                <button
                                    onClick={() => {
                                        setShowSuccessModal(false);
                                        reset();
                                        setImagePreview(null);
                                    }}
                                    className="w-full text-slate-500 hover:text-teal-400 py-2 transition-all font-medium text-sm mt-2">
                                    Create Another Event
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreateEvent;

