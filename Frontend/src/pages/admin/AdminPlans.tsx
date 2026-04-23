import { useState } from 'react';
import { toast } from 'sonner';
import { Table } from '../../components/common/Table';
import { usePlans, useCreatePlan, useUpdatePlan } from '../../hooks/useAdmin';

interface Plan {
  id: string;
  name: string;
  price: number;
  eventLimit: number;
  commissionPercentage: number;
  features: string[];
  isActive: boolean;
}

const AdminPlans = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const { data: plansData, isLoading, error } = usePlans();
  const createPlanMutation = useCreatePlan();
  const updatePlanMutation = useUpdatePlan();

  const [formData, setFormData] = useState({
    name: 'FREE',
    price: 0,
    eventLimit: 10,
    commissionPercentage: 5,
    features: [''],
  });

  const plans = plansData?.plans || [];

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  const addFeatureField = () => {
    setFormData({ ...formData, features: [...formData.features, ''] });
  };

  const removeFeatureField = (index: number) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData({ ...formData, features: newFeatures });
  };

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (formData.price < 0) newErrors.price = 'Price cannot be negative';
    if (formData.eventLimit <= 0) newErrors.eventLimit = 'Event limit must be at least 1';
    if (formData.commissionPercentage < 0 || formData.commissionPercentage > 100) {
      newErrors.commissionPercentage = 'Commission must be between 0 and 100';
    }
    
    const validFeatures = formData.features.filter(f => f.trim() !== '');
    if (validFeatures.length === 0) {
      newErrors.features = 'At least one feature is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    const cleanedFeatures = formData.features.filter(f => f.trim() !== '');
    const dataToSend = { ...formData, features: cleanedFeatures };

    if (editingPlan) {
      updatePlanMutation.mutate({ id: editingPlan.id, data: dataToSend }, {
        onSuccess: () => {
          toast.success('Plan updated successfully');
          setIsModalOpen(false);
          setEditingPlan(null);
          setErrors({});
        },
        onError: (err: any) => {
          toast.error(err.response?.data?.message || 'Failed to update plan');
        }
      });
    } else {
      createPlanMutation.mutate(dataToSend, {
        onSuccess: () => {
          toast.success('Plan created successfully');
          setIsModalOpen(false);
          resetForm();
          setErrors({});
        },
        onError: (err: any) => {
          toast.error(err.response?.data?.message || 'Failed to create plan');
        }
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: 'FREE',
      price: 0,
      eventLimit: 10,
      commissionPercentage: 5,
      features: [''],
    });
    setEditingPlan(null);
  };

  const openEditModal = (plan: Plan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      price: plan.price,
      eventLimit: plan.eventLimit,
      commissionPercentage: plan.commissionPercentage,
      features: plan.features.length > 0 ? plan.features : [''],
    });
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Subscription Plans</h1>
          <p className="text-slate-400 mt-1">Manage platform tiers and pricing for event managers.</p>
        </div>
        <button
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20 active:scale-95 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create New Plan
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400">
          Error loading plans. Please try again later.
        </div>
      )}

      <div className="bg-[#0a0f16] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        <Table
          columns={[
            { header: 'Plan Name' },
            { header: 'Price' },
            { header: 'Event Limit' },
            { header: 'Commission' },
            { header: 'Status' },
            { header: 'Actions', className: 'text-right' },
          ]}
          data={plans}
          emptyState={
            <tr>
              <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                No plans found. Create one to get started.
              </td>
            </tr>
          }
          renderRow={(plan: Plan) => (
            <tr key={plan.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
              <td className="px-6 py-4">
                <span className="font-bold text-white">{plan.name}</span>
              </td>
              <td className="px-6 py-4 text-slate-300">${plan.price}/mo</td>
              <td className="px-6 py-4 text-slate-300">{plan.eventLimit} Events</td>
              <td className="px-6 py-4 text-slate-300">{plan.commissionPercentage}%</td>
              <td className="px-6 py-4">
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${plan.isActive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                  {plan.isActive ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <button 
                  onClick={() => openEditModal(plan)}
                  className="text-emerald-400 hover:text-emerald-300 font-bold text-sm transition-colors"
                >
                  Edit
                </button>
              </td>
            </tr>
          )}
        />
      </div>

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-md bg-black/60">
          <div className="bg-[#0d141f] border border-slate-800 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-8 border-b border-slate-800 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">
                {editingPlan ? 'Edit Subscription Plan' : 'Create New Subscription Plan'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-400 uppercase tracking-wider">Plan Name</label>
                  <select
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#070b14] border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-hidden focus:border-emerald-500/50 transition-all"
                  >
                    <option value="FREE">FREE</option>
                    <option value="PRO">PRO</option>
                    <option value="ELITE">ELITE</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-400 uppercase tracking-wider">Price (USD)</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className={`w-full bg-[#070b14] border ${errors.price ? 'border-red-500' : 'border-slate-800'} rounded-xl px-4 py-3 text-white focus:outline-hidden focus:border-emerald-500/50 transition-all`}
                    placeholder="0.00"
                    min="0"
                  />
                  {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-400 uppercase tracking-wider">Event Limit</label>
                  <input
                    type="number"
                    value={formData.eventLimit}
                    onChange={(e) => setFormData({ ...formData, eventLimit: Number(e.target.value) })}
                    className={`w-full bg-[#070b14] border ${errors.eventLimit ? 'border-red-500' : 'border-slate-800'} rounded-xl px-4 py-3 text-white focus:outline-hidden focus:border-emerald-500/50 transition-all`}
                    placeholder="10"
                    min="1"
                  />
                  {errors.eventLimit && <p className="text-red-500 text-xs mt-1">{errors.eventLimit}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-400 uppercase tracking-wider">Commission (%)</label>
                  <input
                    type="number"
                    value={formData.commissionPercentage}
                    onChange={(e) => setFormData({ ...formData, commissionPercentage: Number(e.target.value) })}
                    className={`w-full bg-[#070b14] border ${errors.commissionPercentage ? 'border-red-500' : 'border-slate-800'} rounded-xl px-4 py-3 text-white focus:outline-hidden focus:border-emerald-500/50 transition-all`}
                    placeholder="5"
                    min="0"
                    max="100"
                  />
                  {errors.commissionPercentage && <p className="text-red-500 text-xs mt-1">{errors.commissionPercentage}</p>}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold text-slate-400 uppercase tracking-wider">Features</label>
                  {errors.features && <p className="text-red-500 text-xs">{errors.features}</p>}
                </div>
                <div className={`space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar ${errors.features ? 'p-2 border border-red-500/20 rounded-xl' : ''}`}>
                  {formData.features.map((feature, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => handleFeatureChange(index, e.target.value)}
                        className="flex-1 bg-[#070b14] border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-hidden focus:border-emerald-500/50 transition-all"
                        placeholder={`Feature ${index + 1}`}
                      />
                      <button
                        type="button"
                        onClick={() => removeFeatureField(index)}
                        className="p-2 text-slate-500 hover:text-red-400 transition-colors"
                        disabled={formData.features.length === 1}
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addFeatureField}
                  className="text-emerald-400 hover:text-emerald-300 text-sm font-bold flex items-center gap-1 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Feature
                </button>
              </div>

              <div className="pt-4 flex gap-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createPlanMutation.isPending || updatePlanMutation.isPending}
                  className="flex-1 px-6 py-3.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-bold rounded-2xl transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
                >
                  {createPlanMutation.isPending || updatePlanMutation.isPending 
                    ? 'Processing...' 
                    : editingPlan ? 'Update Plan' : 'Create Plan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPlans;
