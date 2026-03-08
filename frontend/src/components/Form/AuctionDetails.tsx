import React from 'react';
import { useCategories } from '../../hooks/useCategories';

export interface AuctionDetailsData {
    categoryId: number;
    title: string;
    description: string;
    startingPrice: number;
    endDate: string;
    shippingInfo: string;
    specs: Record<string, string>; 
}

export interface AuctionFormData {
    categoryId: number;
    title: string;
    description: string;
    startingPrice: number;
    endDate: string;
    shippingInfo: string;
}

interface AuctionDetailsProps {
    onBack: () => void;
    onSubmit: (data: any) => void;
    isSubmitting: boolean;
    onError: (message: string) => void;
    hasFailedUploads: boolean;

    formData: AuctionFormData;
    setFormData: React.Dispatch<React.SetStateAction<any>>;
    specsList: { key: string; value: string }[];
    setSpecsList: React.Dispatch<React.SetStateAction<{ key: string; value: string }[]>>;
}

const AuctionDetails: React.FC<AuctionDetailsProps> = ({ 
    onBack, onSubmit, isSubmitting, onError, hasFailedUploads,
    formData, setFormData, specsList, setSpecsList
}) => {
    


    const { data: categories, isLoading } = useCategories();


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev: any) => ({
            ...prev,
            [name]: name === 'startingPrice' || name === 'categoryId' ? Number(value) : value
        }));
    };

    const handleSpecChange = (index: number, field: 'key' | 'value', newValue: string) => {
        setSpecsList(prev => {
            const newList = [...prev];
            newList[index][field] = newValue;
            return newList;
        });
    };

    const addSpecRow = () => {
        setSpecsList(prev => [...prev, { key: '', value: '' }]);
    };

    const removeSpecRow = (indexToRemove: number) => {
        setSpecsList(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
     
        if (formData.title.trim().length < 5) {
            onError("Title must contain at least 5 visible characters.");
            return;
        }

        if (formData.categoryId === 0) {
            onError("Please select a category.");
            return;
        }

        const specsMap: Record<string, string> = {};
        for (const spec of specsList) {
            const cleanKey = spec.key.trim();
            const cleanValue = spec.value.trim();

            if (cleanKey && cleanValue) {
                if (specsMap[cleanKey]) {
                    onError(`Duplicate specification found: "${cleanKey}". Please use unique names.`); 
                    return;
                }
                specsMap[cleanKey] = cleanValue;
            }
        }

        const finalPayload = {
            ...formData,
            specs: specsMap
        };

        onSubmit(finalPayload); 
    };

    const today = new Date().toISOString().slice(0, 16);


    const inputClass = "w-full px-4 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all disabled:bg-gray-100 disabled:border-gray-200 tabular-nums placeholder-gray-400";

    return (
        <form onSubmit={handleSubmit} className="space-y-8 animate-fadeIn">
            <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-1">Step 2: Auction Details</h2>
                <p className="text-gray-600 text-sm">Fill out the specifics. All fields marked <span className="text-red-500">*</span> are required.</p>
            </div>

        
            <div className="space-y-6">
                

                <div className="bg-white border border-gray-200 p-6 rounded space-y-4">
                    <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-4">Item Identity</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Item Title <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required minLength={5} maxLength={100}
                                placeholder="e.g., Vintage Rolex Submariner"
                                className={inputClass}
                            />
                        </div>


                        {/* Category Dropdown */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Category <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="categoryId"
                                value={formData.categoryId}
                                onChange={handleChange}
                                required
                                disabled={isLoading || isSubmitting}
                                className={`${inputClass} bg-white disabled:bg-gray-100 disabled:text-gray-500`}
                            >
                                {isLoading ? (
                                    <option value={0} disabled>Loading categories ⏳...</option>
                                ) : categories && categories.length > 0 ? (
                                    <>
                                        <option value={0} disabled>-- Select a Category --</option>
                                        {categories.map((category) => (
                                            <option key={category.id} value={category.id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </>
                                ) : (
                                    <option value={0} disabled>No categories available</option>
                                )}
                            </select>
                        </div>
                    </div>


                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description <span className="text-red-500">*</span></label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required rows={4} maxLength={2000}
                            placeholder="Describe the condition, history, and specifications..."
                            className={`${inputClass} resize-none`}
                        />
                    </div>
                </div>

                <hr className="border-gray-200" />

                <div className="border border-gray-200 p-6 rounded space-y-4 bg-white">
                    <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-4">Pricing & Timeline</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Starting Price <span className="text-red-500">*</span></label>
                            <input
                                type="number"
                                name="startingPrice"
                                value={formData.startingPrice || ''}
                                onChange={handleChange}
                                required min="1" step="1"
                                placeholder="0"
                                className={inputClass}
                            />
                        </div>

                        <div className="min-w-0"> 
                            <label className="block text-sm font-medium text-gray-700 mb-1">Auction End Date <span className="text-red-500">*</span></label>
                            <input
                                type="datetime-local"
                                name="endDate"
                                value={formData.endDate}
                                onChange={handleChange}
                                required min={today}
                                className={inputClass}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Shipping Information <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            name="shippingInfo"
                            value={formData.shippingInfo}
                            onChange={handleChange}
                            required maxLength={100}
                            placeholder="e.g., Free Shipping, DHL Express, or Local Pickup only"
                            className={inputClass}
                        />
                    </div>
                </div>


                <hr className="border-gray-200" />


                <div className="bg-white p-6 rounded border border-gray-300 space-y-4">
                    <div className="flex justify-between items-center border-b border-gray-200 pb-3 mb-4">
                        <div>
                            <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Custom Specifications</h3>
                            <p className="text-xs text-gray-500 mt-1">Add specific details like Brand, Material, or Year.</p>
                        </div>
                        <button
                            type="button"
                            onClick={addSpecRow}
                            disabled={isSubmitting}

                            className="text-sm border border-blue-600 text-blue-700 px-3 py-1.5 rounded hover:bg-blue-50 transition-colors font-medium disabled:opacity-50"
                        >
                            + Add Specification
                        </button>
                    </div>
                    
                    <div className="space-y-3">
                        {specsList.map((spec, index) => (
                            <div key={index} className="flex gap-3 items-start animate-fadeIn">

                                <input
                                    type="text"
                                    placeholder="e.g., Brand"
                                    value={spec.key}
                                    onChange={(e) => handleSpecChange(index, 'key', e.target.value)}
                                    disabled={isSubmitting} maxLength={50}
                                    className={`${inputClass} text-sm`}
                                />
                                <input
                                    type="text"
                                    placeholder="e.g., Rolex"
                                    value={spec.value}
                                    onChange={(e) => handleSpecChange(index, 'value', e.target.value)}
                                    disabled={isSubmitting} maxLength={100}
                                    className={`${inputClass} text-sm`}
                                />
                                <button
                                    type="button"
                                    onClick={() => removeSpecRow(index)}
                                    disabled={isSubmitting || specsList.length === 1}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded disabled:opacity-30 disabled:hover:bg-transparent transition-colors mt-0.5"
                                    title="Remove specification"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>


            <div className="flex justify-between pt-6 border-t border-gray-200 mt-6">
                <button 
                    type="button"
                    onClick={onBack}
                    className="px-6 py-2 text-gray-600 hover:text-gray-900 font-medium transition-colors disabled:opacity-50"
                    disabled={isSubmitting}
                >
                    &larr; Back to Images
                </button>
                
                <button 
                    type="submit" 
                    disabled={isSubmitting}

                    className={`px-8 py-3 rounded text-white font-semibold transition-all
                        ${isSubmitting 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : hasFailedUploads 
                                ? 'bg-orange-500 hover:bg-orange-600 shadow-none' 
                                : 'bg-green-600 hover:bg-green-700 shadow-none'}`} 
                >
                    {isSubmitting 
                        ? 'Processing Network Payload...' 
                        : hasFailedUploads 
                            ? 'Retry Failed Uploads 🔄' 
                            : 'Launch Auction'}
                </button>
            </div>
        </form>
    );
};

export default AuctionDetails;