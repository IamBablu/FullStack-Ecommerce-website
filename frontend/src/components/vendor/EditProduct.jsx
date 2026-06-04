import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { MdAddPhotoAlternate, MdDelete, MdAdd, MdClose, MdCheckCircle, MdEdit, MdLocalOffer, MdCategory, MdInventory, MdDescription, MdLocalShipping, MdVerified, MdWarning, MdSave } from "react-icons/md";
import { FaTshirt, FaBoxOpen, FaMoneyBillWave, FaTruck, FaShieldAlt, FaExchangeAlt, FaSave } from "react-icons/fa";
import axios from 'axios';
import { userDataContext } from '../../context/UserContext'
import { useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const EditProduct = () => {
    let availableSize = ["XS", "S", "M", "L", "XL", "XXL", "3XL"]
    let categories = [
        { value: 'fashion-lifestyle', label: '👕 Fashion & Lifestyle', icon: '👕' },
        { value: 'electronics-gadgets', label: '📱 Electronics & Gadgets', icon: '📱' },
        { value: 'home-living', label: '🏠 Home & Living', icon: '🏠' },
        { value: 'beauty-personal-care', label: '💄 Beauty & Personal Care', icon: '💄' },
        { value: 'toys-kids-baby', label: '🧸 Toys, Kids & Baby', icon: '🧸' },
        { value: 'food-grocery', label: '🍕 Food & Grocery', icon: '🍕' },
        { value: 'sports-fitness', label: '⚽ Sports & Fitness', icon: '⚽' },
        { value: 'automotive-accessories', label: '🚗 Automotive Accessories', icon: '🚗' },
        { value: 'gifts-handicrafts', label: '🎁 Gifts & Handicrafts', icon: '🎁' },
        { value: 'books-stationery', label: '📚 Books & Stationery', icon: '📚' },
        { value: 'others', label: '📦 Others', icon: '📦' }
    ]
    const [isAdditionalCat, setIsAdditionalCat] = useState(false)
    const [additionalCat, setAdditionalCat] = useState('')
    const [detailPoint, setDetailPoint] = useState("");
    const { serverUrl } = useContext(userDataContext);
    const [loading, setLoading] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [errors, setErrors] = useState({});
    const [imageErrors, setImageErrors] = useState({});
    const location = useLocation();
    const navigate = useNavigate()
    const product = location.state?.product;
    const [formData, setFormData] = useState({
        title: "",
        price: "",
        description: "",
        stock: "",
        category: "",
        isWearable: false,
        replacementDays: "",
        warranty: "",
        freeDelivery: false,
        payOnDelivery: false,
        images: Array(4).fill(null),
        detailPoints: [],
        size: []
    });

    const validateForm = () => {
        const newErrors = {};
        if (!formData.title.trim()) newErrors.title = "Product title is required";
        if (!formData.price || formData.price <= 0) newErrors.price = "Valid price is required";
        if (!formData.stock || formData.stock < 0) newErrors.stock = "Valid stock quantity is required";
        if (!formData.category) newErrors.category = "Please select a category";
        if (!formData.description.trim()) newErrors.description = "Product description is required";
        if (formData.isWearable && formData.size.length === 0) newErrors.size = "Please select at least one size";
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name === 'isWearable' && !checked) {
            setFormData((pre) => ({
                ...pre,
                size: []
            }))
        }

        if (name === 'category' && value === 'others') {
            setIsAdditionalCat(true)
        }
        if (name === 'category' && value !== 'others') {
            setIsAdditionalCat(false)
        }
        
        setFormData(pre => ({
            ...pre,
            [name]: type === 'checkbox' ? checked : value
        }));
        
        // Clear error for this field
        if (errors[name]) {
            setErrors({ ...errors, [name]: null });
        }
    };

    const handleImageUpload = (index, e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setImageErrors({ ...imageErrors, [index]: "Image size should be less than 5MB" });
                return;
            }
            const newImages = [...formData.images];
            newImages[index] = file;
            setFormData(pre => ({ ...pre, images: newImages }));
            setImageErrors({ ...imageErrors, [index]: null });
        }
    };

    const removeImage = (index) => {
        const newImages = [...formData.images];
        newImages[index] = null;
        setFormData(pre => ({ ...pre, images: newImages }));
    };

    const addDetailPoint = () => {
        if (detailPoint.trim()) {
            setFormData((pre) => ({
                ...pre,
                detailPoints: [...pre.detailPoints, detailPoint.trim()]
            }))
            setDetailPoint('')
        }
    };

    const removeDetailPoint = (index) => {
        setFormData(pre => ({
            ...pre,
            detailPoints: pre.detailPoints.filter((_, i) => i !== index)
        }));
    };

    const handleSizeClicked = (clicked) => {
        setFormData((pre) => {
            const isAvailable = pre.size.includes(clicked)
            if (isAvailable) {
                return {
                    ...pre,
                    size: pre.size.filter((s) => s !== clicked)
                }
            } else {
                return {
                    ...pre,
                    size: [...pre.size, clicked]
                }
            }
        })
        if (errors.size) setErrors({ ...errors, size: null });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        
        const data = new FormData();
        data.append("title", formData.title)
        data.append("price", formData.price)
        data.append("description", formData.description)
        data.append("stock", formData.stock)
        data.append("category", formData.category === 'others' && additionalCat ? additionalCat : formData.category)
        data.append("isWearable", formData.isWearable)
        data.append("replacementDays", formData.replacementDays)
        data.append("warranty", formData.warranty)
        data.append("freeDelivery", formData.freeDelivery)
        data.append("payOnDelivery", formData.payOnDelivery)

        formData.detailPoints.forEach((point) => {
            if (point) data.append("detailPoints", point);
        });

        formData.size.forEach((sz) => {
            if (sz) data.append("size", sz);
        });

        data.append("productId", product._id)

        formData.images.forEach((img) => {
            if (img instanceof File) {
                data.append('images', img)
            } else if (typeof img === 'string' && img) {
                data.append('existingImg', img)
            }
        })
        
        try {
            setLoading(true)
            const res = await axios.patch(`${serverUrl}/product/edit-product`, data, { withCredentials: true })
            setLoading(false)
            navigate('/vendor/products')
            setTimeout(() => window.location.reload(), 100);
        } catch (error) {
            console.error(error)
            alert(error.response?.data?.message || "Failed to update product")
            setLoading(false)
        }
    };

    useEffect(() => {
        if (product) {
            const existImg = Array(4).fill(null)
            if (product.image && Array.isArray(product.image)) {
                product.image.forEach((img, index) => {
                    if (index < 4) {
                        existImg[index] = img;
                    }
                });
            }
            setFormData({
                title: product.title || "",
                price: product.price || "",
                description: product.description || "",
                stock: product.stock || "",
                category: product.category || "",
                isWearable: product.isWearable || false,
                replacementDays: product.replacementDays || "",
                warranty: product.warranty || "",
                freeDelivery: product.freeDelivery || false,
                payOnDelivery: product.payOnDelivery || false,
                images: existImg,
                detailPoints: product.detailPoints || [],
                size: product.size || []
            })
        }
    }, [product])

    if (!product) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
                <div className="text-center">
                    <p className="text-gray-400 text-lg">No product data available</p>
                    <button 
                        onClick={() => navigate('/vendor/products')}
                        className="mt-4 px-6 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className='min-h-screen w-full bg-gradient-to-br from-gray-900 via-gray-800 to-black py-8 px-4 overflow-y-auto'>
            <AnimatePresence>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className='max-w-4xl mx-auto'
                >
                    {/* Header */}
                    <div className="text-center mb-8">
                        <motion.h1 
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            className="text-4xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent"
                        >
                            Edit Product
                        </motion.h1>
                        <p className="text-gray-400 mt-2">Update your product information</p>
                    </div>

                    <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700 overflow-hidden">
                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* Basic Information Section */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 pb-2 border-b border-gray-700">
                                    <MdEdit className="text-yellow-400 text-xl" />
                                    <h2 className="text-xl font-semibold text-white">Basic Information</h2>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-gray-300 text-sm font-medium mb-2">
                                            Product Title <span className="text-red-400">*</span>
                                        </label>
                                        <input 
                                            type="text" 
                                            name='title' 
                                            value={formData.title} 
                                            onChange={handleInputChange} 
                                            placeholder='Enter product title...' 
                                            className={`w-full px-4 py-2 bg-gray-700/50 border ${errors.title ? 'border-red-500' : 'border-gray-600'} rounded-lg text-white focus:outline-none focus:border-yellow-500 transition-colors`}
                                        />
                                        {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title}</p>}
                                    </div>
                                    
                                    <div>
                                        <label className="block text-gray-300 text-sm font-medium mb-2">
                                            Price (₹) <span className="text-red-400">*</span>
                                        </label>
                                        <input 
                                            type="number" 
                                            name='price' 
                                            value={formData.price} 
                                            onChange={handleInputChange} 
                                            placeholder='Enter price...' 
                                            className={`w-full px-4 py-2 bg-gray-700/50 border ${errors.price ? 'border-red-500' : 'border-gray-600'} rounded-lg text-white focus:outline-none focus:border-yellow-500 transition-colors`}
                                        />
                                        {errors.price && <p className="text-red-400 text-xs mt-1">{errors.price}</p>}
                                    </div>
                                    
                                    <div>
                                        <label className="block text-gray-300 text-sm font-medium mb-2">
                                            Stock Quantity <span className="text-red-400">*</span>
                                        </label>
                                        <input 
                                            type="number" 
                                            name='stock' 
                                            value={formData.stock} 
                                            onChange={handleInputChange} 
                                            placeholder='Enter stock quantity...' 
                                            className={`w-full px-4 py-2 bg-gray-700/50 border ${errors.stock ? 'border-red-500' : 'border-gray-600'} rounded-lg text-white focus:outline-none focus:border-yellow-500 transition-colors`}
                                        />
                                        {errors.stock && <p className="text-red-400 text-xs mt-1">{errors.stock}</p>}
                                    </div>
                                    
                                    <div>
                                        <label className="block text-gray-300 text-sm font-medium mb-2">
                                            Category <span className="text-red-400">*</span>
                                        </label>
                                        <select 
                                            name="category" 
                                            value={formData.category} 
                                            onChange={handleInputChange} 
                                            className={`w-full px-4 py-2 bg-gray-700/50 border ${errors.category ? 'border-red-500' : 'border-gray-600'} rounded-lg text-white focus:outline-none focus:border-yellow-500 transition-colors`}
                                        >
                                            <option value="">Select Category</option>
                                            {categories.map((cat, ind) => {
                                                return <option key={ind} value={cat.value}>{cat.label}</option>
                                            })}
                                        </select>
                                        {errors.category && <p className="text-red-400 text-xs mt-1">{errors.category}</p>}
                                    </div>
                                </div>
                                
                                {formData.category === 'others' && (
                                    <motion.div 
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="flex gap-2"
                                    >
                                        <input 
                                            type="text" 
                                            onChange={(e) => setAdditionalCat(e.target.value)} 
                                            placeholder="Enter custom category name" 
                                            className="flex-1 px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                                        />
                                        <button 
                                            type="button"
                                            name="category" 
                                            value={additionalCat} 
                                            onClick={handleInputChange}
                                            className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg transition-colors"
                                        >
                                            Set Category
                                        </button>
                                    </motion.div>
                                )}
                                
                                <div>
                                    <label className="block text-gray-300 text-sm font-medium mb-2">
                                        Product Description <span className="text-red-400">*</span>
                                    </label>
                                    <textarea 
                                        name="description" 
                                        value={formData.description} 
                                        onChange={handleInputChange} 
                                        placeholder='Describe your product in detail...' 
                                        rows={4} 
                                        className={`w-full px-4 py-2 bg-gray-700/50 border ${errors.description ? 'border-red-500' : 'border-gray-600'} rounded-lg text-white focus:outline-none focus:border-yellow-500 transition-colors resize-none`}
                                    />
                                    {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description}</p>}
                                </div>
                            </div>

                            {/* Wearable Options */}
                            <div className="space-y-4">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input 
                                        type="checkbox" 
                                        name='isWearable' 
                                        checked={formData.isWearable} 
                                        onChange={handleInputChange} 
                                        className="w-5 h-5 rounded border-gray-600 text-yellow-600 focus:ring-yellow-500"
                                    />
                                    <div className="flex items-center gap-2">
                                        <FaTshirt className="text-yellow-400 text-xl" />
                                        <span className="text-gray-300 font-medium">This is a wearable / clothing product</span>
                                    </div>
                                </label>
                                
                                {formData.isWearable && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="ml-6 space-y-2"
                                    >
                                        <label className="block text-gray-300 text-sm font-medium mb-2">
                                            Available Sizes <span className="text-red-400">*</span>
                                        </label>
                                        <div className='flex flex-wrap gap-2'>
                                            {availableSize.map((size) => {
                                                const isSelected = formData.size?.includes(size)
                                                return (
                                                    <motion.button
                                                        key={size}
                                                        type="button"
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => handleSizeClicked(size)} 
                                                        className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                                                            isSelected 
                                                                ? 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white shadow-lg' 
                                                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                                        }`}
                                                    >
                                                        {size}
                                                    </motion.button>
                                                )
                                            })}
                                        </div>
                                        {errors.size && <p className="text-red-400 text-xs">{errors.size}</p>}
                                    </motion.div>
                                )}
                            </div>

                            {/* Shipping & Policies */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 pb-2 border-b border-gray-700">
                                    <MdLocalShipping className="text-green-400 text-xl" />
                                    <h2 className="text-xl font-semibold text-white">Shipping & Policies</h2>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-gray-300 text-sm font-medium mb-2">
                                            <FaExchangeAlt className="inline mr-2 text-blue-400" />
                                            Replacement Days
                                        </label>
                                        <input 
                                            type="number" 
                                            name='replacementDays' 
                                            value={formData.replacementDays} 
                                            onChange={handleInputChange} 
                                            placeholder='e.g., 7' 
                                            className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-yellow-500 transition-colors"
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-gray-300 text-sm font-medium mb-2">
                                            <FaShieldAlt className="inline mr-2 text-purple-400" />
                                            Warranty
                                        </label>
                                        <input 
                                            type="text" 
                                            name='warranty' 
                                            value={formData.warranty} 
                                            onChange={handleInputChange} 
                                            placeholder='e.g., 1 Year' 
                                            className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-yellow-500 transition-colors"
                                        />
                                    </div>
                                </div>
                                
                                <div className='flex gap-6'>
                                    <label className='flex items-center gap-2 cursor-pointer group'>
                                        <input 
                                            type="checkbox" 
                                            name='freeDelivery' 
                                            checked={formData.freeDelivery} 
                                            onChange={handleInputChange} 
                                            className="w-5 h-5 rounded border-gray-600 text-yellow-600 focus:ring-yellow-500"
                                        />
                                        <span className="text-gray-300">Free Delivery</span>
                                    </label>
                                    <label className='flex items-center gap-2 cursor-pointer group'>
                                        <input 
                                            type="checkbox" 
                                            name='payOnDelivery' 
                                            checked={formData.payOnDelivery} 
                                            onChange={handleInputChange} 
                                            className="w-5 h-5 rounded border-gray-600 text-yellow-600 focus:ring-yellow-500"
                                        />
                                        <span className="text-gray-300">Cash on Delivery Available</span>
                                    </label>
                                </div>
                            </div>

                            {/* Product Images */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 pb-2 border-b border-gray-700">
                                    <MdAddPhotoAlternate className="text-purple-400 text-xl" />
                                    <h2 className="text-xl font-semibold text-white">Product Images</h2>
                                </div>
                                <p className="text-gray-400 text-sm">Upload up to 4 images (Max 5MB each)</p>
                                
                                <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                                    {formData.images?.map((_, index) => (
                                        <div key={index} className="relative group">
                                            <label className='aspect-square bg-gray-700/50 rounded-xl border-2 border-dashed border-gray-600 hover:border-yellow-500 transition-all flex flex-col items-center justify-center cursor-pointer overflow-hidden'>
                                                <input 
                                                    type="file" 
                                                    accept='image/*' 
                                                    onChange={(e) => handleImageUpload(index, e)} 
                                                    className='hidden' 
                                                />
                                                {formData.images[index] ? (
                                                    <div className="relative w-full h-full">
                                                        <img 
                                                            src={formData.images[index] instanceof File ? URL.createObjectURL(formData.images[index]) : formData.images[index]} 
                                                            alt={`Product ${index + 1}`} 
                                                            className='w-full h-full object-cover'
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => removeImage(index)}
                                                            className="absolute top-2 right-2 p-1 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            <MdClose className="text-white" />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <MdAddPhotoAlternate className='w-12 h-12 text-gray-400 mb-2' />
                                                        <span className='text-gray-400 text-xs'>Image {index + 1}</span>
                                                    </>
                                                )}
                                            </label>
                                            {imageErrors[index] && (
                                                <p className="text-red-400 text-xs mt-1">{imageErrors[index]}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Product Details Points */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 pb-2 border-b border-gray-700">
                                    <MdVerified className="text-green-400 text-xl" />
                                    <h2 className="text-xl font-semibold text-white">Product Details</h2>
                                </div>
                                
                                <div className='flex flex-col sm:flex-row gap-2'>
                                    <input 
                                        type="text"
                                        placeholder={`Add key feature or specification...`} 
                                        value={detailPoint}
                                        onChange={(e) => setDetailPoint(e.target.value)} 
                                        className='flex-1 px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-yellow-500'
                                        onKeyPress={(e) => e.key === 'Enter' && addDetailPoint()}
                                    />
                                    <button 
                                        type='button' 
                                        onClick={addDetailPoint} 
                                        className='px-6 py-2 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-lg cursor-pointer hover:from-yellow-700 hover:to-orange-700 transition-all flex items-center gap-2 justify-center'
                                    >
                                        <MdAdd className="text-xl" />
                                        Add Point
                                    </button>
                                </div>
                                
                                <div className='max-h-48 overflow-y-auto space-y-2 custom-scrollbar'>
                                    {formData.detailPoints?.length === 0 ? (
                                        <p className="text-gray-500 text-center py-4">No details added yet. Click "Add Point" to add features.</p>
                                    ) : (
                                        formData.detailPoints?.map((point, index) => {
                                            return (
                                                <motion.div 
                                                    key={`details-point-${index}`}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    className='flex items-center gap-2 p-2 bg-gray-700/30 rounded-lg group hover:bg-gray-700/50 transition-colors'
                                                >
                                                    <MdCheckCircle className="text-green-400 flex-shrink-0" />
                                                    <p className='flex-1 text-gray-200'>{point}</p>
                                                    <button 
                                                        type='button' 
                                                        onClick={() => removeDetailPoint(index)} 
                                                        className='p-1 text-red-400 hover:text-red-300 transition-colors opacity-0 group-hover:opacity-100'
                                                    >
                                                        <MdDelete className="text-xl" />
                                                    </button>
                                                </motion.div>
                                            )
                                        })
                                    )}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 pt-4">
                                <button 
                                    type="button"
                                    onClick={() => setShowPreview(!showPreview)}
                                    className="flex-1 px-6 py-3 bg-gray-700 rounded-lg font-semibold hover:bg-gray-600 transition-all"
                                >
                                    {showPreview ? 'Hide Preview' : 'Show Preview'}
                                </button>
                                <button 
                                    type="button"
                                    onClick={() => navigate('/vendor/products')}
                                    className="flex-1 px-6 py-3 bg-red-600/20 border border-red-600 rounded-lg font-semibold hover:bg-red-600/30 transition-all"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type='submit' 
                                    disabled={loading}
                                    className='flex-1 px-6 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-lg font-semibold hover:from-yellow-700 hover:to-orange-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed'
                                >
                                    {loading ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Saving...
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center gap-2">
                                            <FaSave />
                                            Save Changes
                                        </div>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Preview Modal */}
                    <AnimatePresence>
                        {showPreview && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                                onClick={() => setShowPreview(false)}
                            >
                                <motion.div
                                    initial={{ scale: 0.9, y: 20 }}
                                    animate={{ scale: 1, y: 0 }}
                                    exit={{ scale: 0.9, y: 20 }}
                                    className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <div className="sticky top-0 bg-gray-800/95 backdrop-blur-sm p-4 border-b border-gray-700 flex justify-between items-center">
                                        <h3 className="text-xl font-bold text-white">Product Preview</h3>
                                        <button onClick={() => setShowPreview(false)} className="p-1 hover:bg-gray-700 rounded-lg transition-colors">
                                            <MdClose className="text-2xl" />
                                        </button>
                                    </div>
                                    <div className="p-6 space-y-4">
                                        {formData.images[0] && (
                                            <img 
                                                src={formData.images[0] instanceof File ? URL.createObjectURL(formData.images[0]) : formData.images[0]} 
                                                alt={formData.title}
                                                className="w-full h-64 object-cover rounded-xl"
                                            />
                                        )}
                                        <h4 className="text-2xl font-bold text-white">{formData.title || "Product Title"}</h4>
                                        <p className="text-3xl font-bold text-yellow-400">₹{formData.price || "0"}</p>
                                        <p className="text-gray-300">{formData.description || "Product description will appear here..."}</p>
                                        {formData.detailPoints?.length > 0 && (
                                            <div className="space-y-2">
                                                <h5 className="font-semibold text-white">Key Features:</h5>
                                                <ul className="space-y-1">
                                                    {formData.detailPoints.map((point, i) => (
                                                        <li key={i} className="flex items-center gap-2 text-gray-300">
                                                            <MdCheckCircle className="text-green-400" />
                                                            {point}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                        <div className="flex gap-2 pt-4">
                                            <button 
                                                onClick={() => setShowPreview(false)}
                                                className="flex-1 px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                                            >
                                                Close Preview
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </AnimatePresence>
        </div>
    )
}

export default EditProduct