import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { userDataContext } from '../../context/UserContext';
import { motion, AnimatePresence } from 'motion/react'
import logo from '../../assets/logo.jpeg'
import { MdAddPhotoAlternate, MdStore, MdLocationOn, MdGppGood, MdEmail, MdPhone, MdPerson, MdLock, MdSave, MdLogout, MdArrowBack, MdVerified } from "react-icons/md";
import { FaEye, FaEyeSlash, FaStore, FaBuilding, FaUserEdit, FaSave, FaSignOutAlt } from "react-icons/fa";
import { IoArrowBackSharp } from "react-icons/io5";
import { TbPlayerTrackNextFilled } from "react-icons/tb";
import { Avatar } from '../../context/UserContext';

const UpdateVendorDetails = () => {
    const { serverUrl, userdata, setUserData } = React.useContext(userDataContext)
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [loading, setLoading] = useState(false)
    const [avatarFile, setAvatarFile] = useState(null)
    const [avatarPreview, setAvatarPreview] = useState(null)
    const [formData, setFormData] = useState({
        loginKey: "",
        phone: "",
        password: "",
        fullName: "",
        shopName: "",
        shopAddress: "",
        gstNumber: "",
    })
    const navigate = useNavigate()

    const handleChange = (e) => {
        setError("")
        setSuccess("")
        const { name, value } = e.target;
        setFormData(pre => ({
            ...pre,
            [name]: value
        }))
    }

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setError("Avatar size should be less than 5MB");
                return;
            }
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    }

    const uploadAvatar = async () => {
        if (!avatarFile) return;
        
        const avatarData = new FormData();
        avatarData.append('avatar', avatarFile);
        
        try {
            const result = await axios.patch(`${serverUrl}/users/update-avatar`, avatarData, { withCredentials: true });
            setUserData(result.data);
            setSuccess("Avatar updated successfully!");
            setTimeout(() => setSuccess(""), 3000);
        } catch (error) {
            console.error(error);
            setError("Failed to update avatar");
        }
    }

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const result = await axios.patch(`${serverUrl}/users/update-user`, formData, { withCredentials: true })
            setUserData(result.data)
            setSuccess("Profile updated successfully!");
            setTimeout(() => setSuccess(""), 3000);
            setTimeout(() => navigate('/'), 1500);
        } catch (error) {
            console.error(error.message)
            setError(error.response?.data?.message || "Failed to update profile")
        } finally {
            setLoading(false)
        }
    }

    const handleLogOut = async () => {
        try {
            await axios.get(`${serverUrl}/users/signout`, { withCredentials: true })
            setUserData(null)
            navigate("/login")
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        if (userdata) {
            setFormData(pre => ({
                ...pre,
                loginKey: userdata.username || userdata.email || "",
                phone: userdata.phone || "",
                fullName: userdata.fullName || "",
                shopName: userdata.shopName || "",
                shopAddress: userdata.shopAddress || "",
                gstNumber: userdata.gstNumber || "",
            }))
        }
    }, [userdata])

    return (
        <div className='min-h-screen w-full bg-gradient-to-br from-gray-900 via-blue-900 to-black flex items-center justify-center p-4 relative overflow-y-auto'>
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, type: "spring" }}
                className='w-full max-w-md bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700 overflow-hidden'
            >
                {/* Back Button */}
                <div className='px-6 pt-4'>
                    <button
                        onClick={() => navigate('/')}
                        className='flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-colors'
                    >
                        <IoArrowBackSharp className='text-xl' />
                        <span className='text-sm'>Back to Dashboard</span>
                    </button>
                </div>

                {/* Header */}
                {/* <div className='text-center pt-2 pb-4'>
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring" }}
                        className='inline-block'
                    >
                        <div className='w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg'>
                            <FaUserEdit className='text-3xl text-white' />
                        </div>
                    </motion.div>
                    <h1 className='text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent'>
                        Edit Profile
                    </h1>
                    <p className='text-gray-400 text-sm mt-1'>Update your vendor information</p>
                </div> */}

                <div className='px-6 pb-8'>
                    {/* Avatar Section */}
                    <div className='flex flex-col items-center mb-6'>
                        <div className='relative group'>
                            <Avatar 
                                name={userdata?.fullName} 
                                src={avatarPreview || userdata?.avatar} 
                                size={80}
                            />
                            <label 
                                htmlFor="avatar-upload"
                                className='absolute bottom-0 right-0 p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full cursor-pointer hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg'
                            >
                                <MdAddPhotoAlternate className='text-white text-lg' />
                            </label>
                            <input
                                id="avatar-upload"
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarChange}
                                className='hidden'
                            />
                        </div>
                        {avatarFile && (
                            <button
                                onClick={uploadAvatar}
                                className='mt-2 px-4 py-1 bg-green-600 rounded-lg text-sm hover:bg-green-700 transition-colors cursor-pointer'
                            >
                                Save Avatar
                            </button>
                        )}
                    </div>

                    {/* Messages */}
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className='mb-4 bg-red-500/10 border border-red-500/50 rounded-lg p-3'
                            >
                                <p className='text-red-400 text-sm text-center'>{error}</p>
                            </motion.div>
                        )}
                        {success && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className='mb-4 bg-green-500/10 border border-green-500/50 rounded-lg p-3'
                            >
                                <p className='text-green-400 text-sm text-center flex items-center justify-center gap-2'>
                                    <MdVerified />
                                    {success}
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form onSubmit={handleUpdate} className='space-y-4'>
                        <div className='max-h-96 overflow-y-auto custom-scrollbar pr-2 space-y-4'>
                            {/* Username/Email (Disabled) */}
                            <div>
                                <label className='text-gray-300 text-sm font-medium flex items-center gap-2 mb-2'>
                                    <MdEmail className='text-blue-400' />
                                    Username / Email
                                </label>
                                <input 
                                    disabled 
                                    type="text" 
                                    value={formData.loginKey} 
                                    name='loginKey' 
                                    onChange={handleChange} 
                                    className='w-full px-4 py-2 bg-gray-700/30 border border-gray-600 rounded-lg text-gray-400 cursor-not-allowed'
                                />
                                <p className='text-gray-500 text-xs mt-1'>Username cannot be changed</p>
                            </div>

                            {/* Full Name */}
                            <div>
                                <label className='text-gray-300 text-sm font-medium flex items-center gap-2 mb-2'>
                                    <MdPerson className='text-blue-400' />
                                    Full Name
                                </label>
                                <input 
                                    required 
                                    type="text" 
                                    name='fullName' 
                                    value={formData.fullName} 
                                    onChange={handleChange} 
                                    placeholder='Enter your full name' 
                                    className='w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-all'
                                />
                            </div>

                            {/* Phone Number */}
                            <div>
                                <label className='text-gray-300 text-sm font-medium flex items-center gap-2 mb-2'>
                                    <MdPhone className='text-blue-400' />
                                    Phone Number
                                </label>
                                <input 
                                    required 
                                    type="tel" 
                                    name='phone' 
                                    value={formData.phone} 
                                    onChange={handleChange} 
                                    placeholder='Enter your phone number' 
                                    className='w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-all'
                                />
                            </div>

                            {/* Shop Name */}
                            <div>
                                <label className='text-gray-300 text-sm font-medium flex items-center gap-2 mb-2'>
                                    <FaStore className='text-purple-400' />
                                    Shop Name
                                </label>
                                <input 
                                    required 
                                    type="text" 
                                    name='shopName' 
                                    value={formData.shopName} 
                                    onChange={handleChange} 
                                    placeholder='Enter your shop name' 
                                    className='w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-all'
                                />
                            </div>

                            {/* Shop Address */}
                            <div>
                                <label className='text-gray-300 text-sm font-medium flex items-center gap-2 mb-2'>
                                    <MdLocationOn className='text-purple-400' />
                                    Shop Address
                                </label>
                                <textarea 
                                    required 
                                    name='shopAddress' 
                                    value={formData.shopAddress} 
                                    onChange={handleChange} 
                                    rows={2}
                                    placeholder='Enter your shop address' 
                                    className='w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-all resize-none'
                                />
                            </div>

                            {/* GST Number */}
                            <div>
                                <label className='text-gray-300 text-sm font-medium flex items-center gap-2 mb-2'>
                                    <MdGppGood className='text-purple-400' />
                                    GST Number
                                </label>
                                <input 
                                    required 
                                    type="text" 
                                    name='gstNumber' 
                                    value={formData.gstNumber} 
                                    onChange={handleChange} 
                                    placeholder='Enter your GST number' 
                                    className='w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-all'
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <label className='text-gray-300 text-sm font-medium flex items-center gap-2 mb-2'>
                                    <MdLock className='text-blue-400' />
                                    Password
                                </label>
                                <div className='relative'>
                                    <input 
                                        required 
                                        type={showPassword ? 'text' : 'password'} 
                                        name='password' 
                                        onChange={handleChange} 
                                        placeholder='Enter your password to confirm changes' 
                                        className='w-full px-4 py-2 pr-12 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-all'
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-400 transition-colors cursor-pointer'
                                    >
                                        {!showPassword ? <FaEye /> : <FaEyeSlash />}
                                    </button>
                                </div>
                                <p className='text-gray-500 text-xs mt-1'>Enter your password to save changes</p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className='flex gap-3 pt-4'>
                            <button
                                type='submit'
                                disabled={loading}
                                className='flex-1 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg font-semibold text-white hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer'
                            >
                                {loading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <FaSave />
                                        Save Changes
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Logout Button */}
                    <button
                        onClick={handleLogOut}
                        className='w-full mt-4 py-2.5 bg-red-600/20 border border-red-600 rounded-lg font-semibold text-red-400 hover:bg-red-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer'
                    >
                        <FaSignOutAlt />
                        Logout
                    </button>

                    {/* Account Info */}
                    <div className='mt-6 pt-4 border-t border-gray-700 text-center'>
                        <p className='text-gray-500 text-xs'>
                            Member since {new Date(userdata?.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

const Button = ({ text, onClick, css = '' }) => {
    return (
        <button 
            className={`${css} bg-gray-500 p-1 px-3 rounded-full cursor-pointer hover:bg-gray-800 shadow-sm hover:shadow-blue-700 transition-all duration-500`} 
            onClick={onClick}
        >
            {text}
        </button>
    )
}

export default UpdateVendorDetails