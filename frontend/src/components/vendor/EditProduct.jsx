import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { MdAddPhotoAlternate } from "react-icons/md";
import axios from 'axios';
import { userDataContext } from '../../context/UserContext'
import { useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const EditProduct = () => {
    let availableSize = ["XS", "S", "M", "L", "XL"]
    let categories = ['fashion-lifestyle', 'electronics-gadgets', 'home-living', 'beauty-personal-care', 'toys-kids-baby', 'food-grocery', 'sports-fitness', 'automotive-accessories', 'gifts-handicrafts', 'books-stationery', 'others']
    const [isAdditionalCat, setIsAdditionalCat] = useState(false)
    const [additionalCat, setAdditionalCat] = useState('')
    const [detailPoint, setDetailPoint] = useState("");
    const { serverUrl } = useContext(userDataContext);
    const [loading, setLoading] = useState(false);
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


    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name == 'isWearable' && !checked) {
            setFormData((pre) => ({
                ...pre,
                size: []
            }))
        }

        if (name == 'category' && value.toLowerCase() == 'others') {
            setIsAdditionalCat(true)
        }
        if (name == 'category' && value.toLowerCase() !== 'others') {
            setIsAdditionalCat(false)
        }
        setFormData(pre => ({
            ...pre,
            [name]: type === 'checkbox' ? checked : value
        }));
    };


    const handleImageUpload = (index, e) => {
        const file = e.target.files[0];
        if (file) {
            const newImages = [...formData.images];
            newImages[index] = file;
            setFormData(pre => ({ ...pre, images: newImages }));
        }
    };

    const addDetailPoint = () => {
        if (detailPoint.trim()) {
            setFormData((pre) => ({
                ...pre,
                detailPoints: [detailPoint, ...pre.detailPoints]

            }
            ))
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
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append("title", formData.title)
        data.append("price", formData.price)
        data.append("description", formData.description)
        data.append("stock", formData.stock)
        data.append("category", formData.category)
        data.append("isWearable", formData.isWearable)
        data.append("replacementDays", formData.replacementDays)
        data.append("warranty", formData.warranty)
        data.append("freeDelivery", formData.freeDelivery)
        data.append("payOnDelivery", formData.payOnDelivery)

        formData.detailPoints.forEach((point) => {
            console.log(point)
            if (point) data.append("detailPoints", point);
        });

        formData.size.forEach((sz) => {
            if (sz) data.append("size", sz);
        });

        data.append("productId", product._id)


        formData.images.forEach((img) => {
            if (img instanceof File) {
                data.append('images', img)
            } else if (typeof img == 'string') {
                console.log(img)
                data.append('existingImg', img)
            }
        })
        try {
            setLoading(true)
            const res = await axios.patch(`${serverUrl}/product/edit-product`, data, { withCredentials: true })
            setLoading(false)
            navigate('/')
            window.location.reload();
        } catch (error) {
            console.error(error)
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
                title: product.title,
                price: product.price,
                description: product.description,
                stock: product.stock,
                category: product.category,
                isWearable: product.isWearable,
                replacementDays: product.replacementDays,
                warranty: product.warranty,
                freeDelivery: product.freeDelivery,
                payOnDelivery: product.payOnDelivery,
                images: existImg,
                detailPoints: product.detailPoints,
                size: product.size

            })
        }
    }, [product])


    return (
        <div className='h-screen w-screen flex items-center justify-center bg-black/95'>
            <AnimatePresence >
                <motion.div
                    initial={{ opacity: 0, scale: 0, y: -400 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 2, type: "spring" }}
                    className='bg-gray-800/90 text-white p-3 px-6 rounded-4xl shadow-lg shadow-blue-600 hover:shadow-xl flex flex-col gap-3 text-sm font-semibold'>
                    <h1 className='text-2xl'>Add New Product</h1>
                    <form onSubmit={handleSubmit} className='w-80'>
                        <div className='grid grid-cols-2 gap-3'>
                            <input type="text" name='title' value={formData.title} onChange={handleInputChange} placeholder='Product Title' className='border-2 border-white p-1 rounded-lg' />
                            <input type="number" name='price' value={formData.price} onChange={handleInputChange} placeholder='Price' className='border-2 border-white p-1 rounded-lg' />
                            <input type="number" name='stock' value={formData.stock} onChange={handleInputChange} placeholder='Stock Quantity' className='border-2 border-white p-1 rounded-lg' />
                            <select name="category" name='category' value={formData.category} onChange={handleInputChange} className='border-2 border-white p-1 rounded-lg bg-gray-800'>
                                <option value="">{formData.category == '' ? 'Select Category' : formData.category}</option>
                                {categories?.map((cat, ind) => {
                                    return <option key={ind} value={cat}>{cat}</option>
                                })}
                            </select>
                            {formData.category.toLowerCase() == 'others' && <><input type="text" onChange={(e) => setAdditionalCat(e.target.value)} placeholder={formData.category} className='border-2 border-white p-1 rounded-lg bg-gray-800' /><button name="category" value={additionalCat} onClick={handleInputChange}>Add</button></>}
                        </div>
                        <textarea name="description" name='description' value={formData.description} onChange={handleInputChange} placeholder='Product Description' rows={2} className='border-2 rounded-2xl p-1 mt-2 w-full' ></textarea>
                        <label className='flex items-center gap-2 text-gray-300 text-sm cursor-pointer my-1'>
                            <input type="checkbox" name='isWearable' checked={formData.isWearable} onChange={handleInputChange} />
                            This is Wearable / clothing Product
                        </label>
                        {formData.isWearable && <div className='mb-2 flex justify-around'>
                            {availableSize?.map((size) => {
                                const isSelected = formData.size.includes(size)
                                return <div key={size} onClick={() => handleSizeClicked(size)} className={`px-2 py-1 w-8 text-center font-semibold text-black ${isSelected ? 'bg-blue-700' : 'bg-gray-200'} cursor-pointer transition`}>
                                    {size}
                                </div>
                            })}
                        </div>}
                        <div className='grid grid-cols-2 gap-3'>
                            <input type="text" name='replacementDays' value={formData.replacementDays} onChange={handleInputChange} placeholder='Replacement Days (e.g. 7)' className='border-2 border-white p-1 rounded-lg' />
                            <input type="text" name='warranty' value={formData.warranty} onChange={handleInputChange} placeholder='Warranty (e.g. 1 Year)' className='border-2 border-white p-1 rounded-lg' />
                        </div>


                        <div className='flex gap-6 mt-1'>
                            <label className='flex items-center gap-2 text-gray-300 text-sm cursor-pointer'>
                                <input type="checkbox" name='freeDelivery' checked={formData.freeDelivery} onChange={handleInputChange} />
                                Free Delivery
                            </label>
                            <label className='flex items-center gap-2 text-gray-300 text-sm cursor-pointer'>
                                <input type="checkbox" name='payOnDelivery' checked={formData.payOnDelivery} onChange={handleInputChange} />
                                Cash on Delivery
                            </label>
                        </div>

                        <div>
                            <p>Upload 4 Images</p>
                            <div className='mt-1 flex justify-around'>
                                {formData.images?.map((_, index) => (
                                    <label key={index} className='aspect-square bg-[#2a2a2a] rounded border border-[#333] flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition h-20 w-20'>
                                        <input type="file" accept='image/*' onChange={(e) => handleImageUpload(index, e)} className='hidden' />
                                        {
                                            formData.images[index] ? (
                                                <img src={formData.images[index] instanceof File ? URL.createObjectURL(formData.images[index]) : formData.images[index]} className='w-full h-full object-cover rounded' />
                                            ) : (
                                                <>
                                                    <MdAddPhotoAlternate className='w-10 h-10 text-gray-200 mb-1' />
                                                    <span className='text-gray-200 text-xs'>image {index + 1}</span>
                                                </>
                                            )
                                        }
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className='mt-2'>
                            <p>Product Details Points</p>
                            <div className=' flex justify-between text-lg p-1'>
                                <input type="text"
                                    value={detailPoint}
                                    placeholder={`Point ${formData.detailPoints ? formData.detailPoints.length + 1 : '1'}`}
                                    onChange={(e) => setDetailPoint(e.target.value)} className='border-none outline-none w-[95%] bg-gray-900 px-4' />
                                <button type='button' onClick={addDetailPoint} className='bg-blue-700 p-1 px-10 rounded-lg cursor-pointer hover:scale-110 active:scale-95 transition'>Add</button>

                            </div>
                            <div className='flex flex-col gap-1 border-white border-2 h-24 overflow-y-scroll [&::-webkit-scrollbar]:w-0 overflow-x-hidden'>
                                {
                                    formData.detailPoints?.map((point, index) => {
                                        return <div key={`details-point-${index}`} className='w-full flex'>
                                            <p className='text-lg w-[70%] bg-gray-900 px-4'>{index + 1 + ". " + point}</p>
                                            <button type='button' onClick={() => removeDetailPoint(index)} className='bg-blue-700 px-13 rounded-lg cursor-pointer hover:scale-110 active:scale-90 transition'> X </button>
                                        </div>
                                    })
                                }
                            </div>


                        </div>
                        <button type='submit' className='bg-blue-700 p-2 rounded-lg w-full mt-2 cursor-pointer hover:scale-110 active:scale-95 transition'>{loading ? "Editing" : "Edit Product"}</button>
                    </form>
                </motion.div>
            </AnimatePresence>
        </div>
    )
}

export default EditProduct
