import { useEffect, useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import HomeButton from '../../components/common/HomeButton';
import { useEventDetails, useUpdateEvent } from '../../hooks/useEvents';

export const EventType = {
  ONLINE: 'ONLINE',
  OFFLINE: 'OFFLINE',
  HYBRID: 'HYBRID',
} as const;

export type EventType = (typeof EventType)[keyof typeof EventType];

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

const EditEvent = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);

  const { data: event, isLoading: isFetching } = useEventDetails(id);
  const updateMutation = useUpdateEvent();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
    trigger,
  } = useForm<IEventFormInput>({
    mode: 'onChange',
  });

  const selectedEventType = watch('eventType');
  const startTimeValue = watch('startTime');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Layout Builder State
  const [layoutBlocks, setLayoutBlocks] = useState<any[]>([]);

  useEffect(() => {
    if (event && !initialDataLoaded) {
      const formatDateTime = (dateStr: string) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        const tzOffset = d.getTimezoneOffset() * 60000;
        return new Date(d.getTime() - tzOffset).toISOString().slice(0, 16);
      };

      reset({
        title: event.title,
        description: event.description,
        eventType: event.eventType as EventType,
        startTime: formatDateTime(event.startTime),
        endTime: formatDateTime(event.endTime),
        address: event.location?.address || '',
        latitude: event.location?.coordinates?.[1] || 0,
        longitude: event.location?.coordinates?.[0] || 0,
        maxOnlineUsers: event.maxOnlineUsers,
        price: event.price || 0,
        isSeatLayoutEnabled: !!event.SeatLayout?.blocks?.length,
      });

      if (event.picture) {
        setImagePreview(event.picture);
      }

      if (event.SeatLayout?.blocks) {
        setLayoutBlocks(event.SeatLayout.blocks);
      } else {
        setLayoutBlocks([
          {
            blockName: '',
            category: { name: '', price: '' },
            rows: [{ rowNumber: 1, columns: '' }],
          },
        ]);
      }
      setInitialDataLoaded(true);
    }
  }, [event, reset, initialDataLoaded]);

  const addBlock = () => {
    setLayoutBlocks((prev) => [
      ...prev,
      {
        blockName: '',
        category: { name: '', price: '' },
        rows: [{ rowNumber: 1, columns: '' }],
      },
    ]);
  };

  const removeBlock = (index: number) => {
    setLayoutBlocks((prev) => prev.filter((_, i) => i !== index));
  };

  const updateBlock = (index: number, field: string, value: any) => {
    setLayoutBlocks((prev) => {
      const newBlocks = [...prev];
      const blockCopy = { ...newBlocks[index], category: { ...newBlocks[index].category } };
      if (field === 'blockName') blockCopy.blockName = value;
      if (field === 'categoryName') blockCopy.category.name = value;
      if (field === 'categoryPrice') blockCopy.category.price = value === '' ? '' : Number(value);
      newBlocks[index] = blockCopy;
      return newBlocks;
    });
  };

  const addRow = (blockIndex: number) => {
    setLayoutBlocks((prev) => {
      const newBlocks = [...prev];
      const blockCopy = { ...newBlocks[blockIndex] };
      const rowsCopy = [...blockCopy.rows];
      const nextRowNumber = rowsCopy.length > 0 ? rowsCopy[rowsCopy.length - 1].rowNumber + 1 : 1;
      rowsCopy.push({ rowNumber: nextRowNumber, columns: '' });
      blockCopy.rows = rowsCopy;
      newBlocks[blockIndex] = blockCopy;
      return newBlocks;
    });
  };

  const removeRow = (blockIndex: number, rowIndex: number) => {
    setLayoutBlocks((prev) => {
      const newBlocks = [...prev];
      const blockCopy = { ...newBlocks[blockIndex] };
      let rowsCopy = blockCopy.rows
        .filter((_: any, i: number) => i !== rowIndex)
        .map((r: any, i: number) => ({ ...r, rowNumber: i + 1 }));
      blockCopy.rows = rowsCopy;
      newBlocks[blockIndex] = blockCopy;
      return newBlocks;
    });
  };

  // const updateRowColumns = (blockIndex: number, rowIndex: number, columns: number | string) => {
  //   setLayoutBlocks((prev) => {
  //     const newBlocks = [...prev];
  //     const blockCopy = { ...newBlocks[blockIndex] };
  //     const rowsCopy = [...blockCopy.rows];
  //     rowsCopy[rowIndex] = { ...rowsCopy[rowIndex], columns: columns === '' ? '' : Number(columns) };
  //     blockCopy.rows = rowsCopy;
  //     newBlocks[blockIndex] = blockCopy;
  //     return newBlocks;
  //   });
  // };



   const updateRowColumns = (blockIndex: number, rowIndex: number, columns: number | string) => {
  setLayoutBlocks((prev) => {
    const newBlocks = [...prev];
    const blockCopy = { ...newBlocks[blockIndex] };
    const rowsCopy = [...blockCopy.rows];

    const value = Number(columns);

    rowsCopy[rowIndex] = {
      ...rowsCopy[rowIndex],
      columns: isNaN(value) ? 0 : value, // ✅ FIX
    };

    blockCopy.rows = rowsCopy;
    newBlocks[blockIndex] = blockCopy;
    return newBlocks;
  });
};

  const getLocalISOString = (date: Date) => {
    const tzOffset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - tzOffset).toISOString().slice(0, 16);
  };

  const minDateTime = getLocalISOString(new Date());

  const uploadImageToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'occasio_upload');
    const res = await fetch('https://api.cloudinary.com/v1_1/dliraelbo/image/upload', {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) throw new Error('Image upload failed');
    const data = await res.json();
    return data.secure_url;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setValue('banner', undefined);
  };

  const onSubmit: SubmitHandler<IEventFormInput> = async (data) => {
    const start = new Date(data.startTime);
    const end = new Date(data.endTime);


    for (const block of layoutBlocks) {
  for (const row of block.rows) {
    if (!row.columns || Number(row.columns) <= 0) {
      toast.error("Each row must have at least 1 seat");
      return;
    }
  }
}
    if (end <= start) {
      toast.error('End time must be after start time!');
      return;
    }

    try {
      let bannerUrl = imagePreview || '';
      if (data.banner && data.banner.length > 0) {
        bannerUrl = await uploadImageToCloudinary(data.banner[0]);
      }

      const isOfflineOrHybrid = data.eventType === EventType.OFFLINE || data.eventType === EventType.HYBRID;
      if (isOfflineOrHybrid) {
        for (const block of layoutBlocks) {
          if (!block.blockName.trim() || !block.category.name || block.category.price === '' || Number(block.category.price) < 0) {
            toast.error('Please complete all block details!');
            return;
          }
        }
      }

      updateMutation.mutate(
        {
          id: id!,
          payload: {
            ...data,
            location: isOfflineOrHybrid
              ? {
                  type: 'Point',
                  coordinates: [Number(data.longitude), Number(data.latitude)],
                  address: data.address,
                }
              : null,
            startTime: new Date(data.startTime),
            endTime: new Date(data.endTime),
            picture: bannerUrl,
            layout: isOfflineOrHybrid ? { blocks: layoutBlocks } : undefined,
          },
        },
        {
          onSuccess: () => {
            toast.success('Event updated successfully!');
            setShowSuccessModal(true);
          },
          onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to update event.');
          },
        }
      );
    } catch (err) {
      toast.error('Image upload failed');
    }
  };

  const isSubmitting = updateMutation.isPending;

  if (isFetching) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight">
          Edit <span className="text-teal-400">Event</span>
        </h1>
        <p className="text-slate-400 mt-2">Update your event details and settings.</p>
        <div className="mt-4">
          <HomeButton />
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/60 rounded-2xl p-8 shadow-xl group hover:border-teal-500/30 transition-all duration-300">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
            <span className="p-2 bg-teal-500/10 rounded-lg mr-3 text-teal-400 border border-teal-500/20">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </span>
            Basic Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">
                Event Title <span className="text-red-500">*</span>
              </label>
              <input
                {...register('title', { required: 'Event Title is required' })}
                type="text"
                className={`w-full bg-slate-800/50 border rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all ${errors.title ? 'border-red-500 focus:border-red-500' : 'border-slate-700 focus:border-teal-500'}`}
              />
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">
                Event Type <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: EventType.ONLINE, label: 'Online' },
                  { id: EventType.OFFLINE, label: 'Offline' },
                  { id: EventType.HYBRID, label: 'Hybrid' },
                ].map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => {
                      setValue('eventType', type.id);
                      // When switching to OFFLINE/HYBRID but no blocks yet, init empty block
                      if ((type.id === EventType.OFFLINE || type.id === EventType.HYBRID) && layoutBlocks.length === 0) {
                        setLayoutBlocks([{ blockName: '', category: { name: '', price: '' }, rows: [{ rowNumber: 1, columns: '' }] }]);
                      }
                    }}
                    className={`flex items-center justify-center px-4 py-3 rounded-xl border transition-all font-medium ${
                      selectedEventType === type.id
                        ? 'bg-teal-500/10 border-teal-500 text-teal-400 shadow-[0_0_15px_rgba(20,184,166,0.2)]'
                        : 'bg-slate-800/50 border-slate-700 text-slate-400'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/60 rounded-2xl p-8 shadow-xl group hover:border-teal-500/30 transition-all duration-300">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
            <span className="p-2 bg-teal-500/10 rounded-lg mr-3 text-teal-400 border border-teal-500/20">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </span>
            Date & Time
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Start Time</label>
              <input
                {...register('startTime', { required: 'Start time is required' })}
                type="datetime-local"
                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">End Time</label>
              <input
                {...register('endTime', { required: 'End time is required' })}
                type="datetime-local"
                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>
        </div>

        {(selectedEventType === EventType.OFFLINE || selectedEventType === EventType.HYBRID) && (
          <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/60 rounded-2xl p-8 shadow-xl group hover:border-teal-500/30 transition-all duration-300">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
              <span className="p-2 bg-teal-500/10 rounded-lg mr-3 text-teal-400 border border-teal-500/20">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                </svg>
              </span>
              Location
            </h2>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Venue Address</label>
              <input
                {...register('address', { required: 'Address is required' })}
                type="text"
                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>
        )}

        {/* Seat Layout (Simplified version of CreateEvent layout) */}
        {(selectedEventType === EventType.OFFLINE || selectedEventType === EventType.HYBRID) && (
          <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/60 rounded-2xl p-8 shadow-xl">
            <h2 className="text-xl font-semibold text-white mb-6">Seat Layout</h2>
            {layoutBlocks.map((block, blockIndex) => (
              <div key={blockIndex} className="bg-slate-800/40 border border-slate-700 rounded-xl p-5 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <input
                    type="text"
                    value={block.blockName}
                    onChange={(e) => updateBlock(blockIndex, 'blockName', e.target.value)}
                    placeholder="Block Name"
                    className="bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  />
                  <select
                    value={block.category.name}
                    onChange={(e) => updateBlock(blockIndex, 'categoryName', e.target.value)}
                    className="bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  >
                    <option value="">Select Category</option>
                    <option value="VIP">VIP</option>
                    <option value="PREMIUM">PREMIUM</option>
                    <option value="GOLD">GOLD</option>
                    <option value="SILVER">SILVER</option>
                    <option value="REGULAR">REGULAR</option>
                  </select>
                  <input
                    type="number"
                    value={block.category.price}
                    onChange={(e) => updateBlock(blockIndex, 'categoryPrice', e.target.value)}
                    placeholder="Price"
                    className="bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div className="space-y-2">
                  {block.rows.map((row: any, rowIndex: number) => (
                    <div key={rowIndex} className="flex gap-2">
                      <span className="text-slate-400 py-2">Row {row.rowNumber}</span>
                      <input
                        type="number"
                        value={row.columns}
                        onChange={(e) => updateRowColumns(blockIndex, rowIndex, e.target.value)}
                        placeholder="Seats"
                        className="bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-white w-24"
                      />
                      {block.rows.length > 1 && (
                        <button type="button" onClick={() => removeRow(blockIndex, rowIndex)} className="text-red-400">
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  <button type="button" onClick={() => addRow(blockIndex)} className="text-teal-400 text-sm">
                    + Add Row
                  </button>
                </div>
                {layoutBlocks.length > 1 && (
                  <button type="button" onClick={() => removeBlock(blockIndex)} className="text-red-400 mt-4 block">
                    Remove Block
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={addBlock} className="w-full py-2 border border-dashed border-slate-700 text-slate-400 rounded-xl">
              + Add Block
            </button>
          </div>
        )}

        {/* Ticketing & Capacity */}
        <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/60 rounded-2xl p-8 shadow-xl group hover:border-teal-500/30 transition-all duration-300">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
            <span className="p-2 bg-teal-500/10 rounded-lg mr-3 text-teal-400 border border-teal-500/20">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
            </span>
            Ticketing &amp; Capacity
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(selectedEventType === EventType.ONLINE || selectedEventType === EventType.HYBRID) && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">
                  Ticket Price ($) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-3.5 text-slate-400 font-medium">$</span>
                  <input
                    {...register('price', {
                      required: 'Price is required',
                      valueAsNumber: true,
                      min: { value: 0, message: 'Price cannot be negative' },
                      validate: (val) => !isNaN(val) || 'Price must be a valid number',
                    })}
                    type="number"
                    placeholder="0 for free events"
                    min="0"
                    className={`w-full bg-slate-800/50 border rounded-xl pl-8 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all ${errors.price ? 'border-red-500 focus:border-red-500' : 'border-slate-700 focus:border-teal-500'}`}
                  />
                </div>
                {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
              </div>
            )}
            {(selectedEventType === EventType.ONLINE || selectedEventType === EventType.HYBRID) && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">
                  Total Online Capacity (Max Users) <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('maxOnlineUsers', {
                    valueAsNumber: true,
                    min: { value: 1, message: 'Capacity must be at least 1' },
                    validate: (val) => !val || !isNaN(val) || 'Must be a valid number',
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

        <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/60 rounded-2xl p-8 shadow-xl">
          <h2 className="text-xl font-semibold text-white mb-6">About &amp; Banner</h2>
          <textarea
            {...register('description', { required: 'Description is required' })}
            rows={5}
            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white mb-6 focus:outline-none focus:border-teal-500"
          ></textarea>

          {imagePreview ? (
            <div className="relative rounded-xl overflow-hidden h-48">
              <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-lg"
              >
                Remove
              </button>
            </div>
          ) : (
            <input type="file" accept="image/*" {...register('banner', { onChange: handleImageChange })} className="text-slate-400" />
          )}
        </div>

        <div className="flex justify-end gap-4">
          <button type="button" onClick={() => navigate(-1)} className="px-6 py-3 border border-slate-700 text-slate-300 rounded-xl">
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3 bg-teal-500 text-white rounded-xl hover:bg-teal-400 flex items-center disabled:opacity-50"
          >
            {isSubmitting ? 'Updating...' : 'Update Event'}
          </button>
        </div>
      </form>

      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-md w-full text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Event Updated!</h2>
            <p className="text-slate-400 mb-8">Your event has been successfully updated.</p>
            <button
              onClick={() => navigate('/eventmanager/my-events')}
              className="w-full bg-teal-500 text-white py-3 rounded-xl font-bold"
            >
              Back to My Events
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditEvent;
