import React, { useState } from 'react'
import { motion, AnimatePresence } from "motion/react"
import { TbPlayerTrackNextFilled } from "react-icons/tb";
import { MdEmail, MdLock, MdPerson, MdStore, MdLocationOn, MdGppGood, MdVerified, MdArrowBack, MdCheckCircle } from "react-icons/md";
import { FaEye, FaEyeSlash, FaUser, FaStore, FaBuilding, FaGoogle, FaFacebook, FaApple } from "react-icons/fa";
import Button from '../components/Button';
import Rolebox from '../components/Rolebox';
import logo from '../assets/logo.jpeg'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { userDataContext } from '../context/UserContext';

const Signup = () => {
    const navigate = useNavigate();
    const { userdata, setUserData, serverUrl } = React.useContext(userDataContext)
    const [confirmRole, setConfirmRole] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [otpSending, setOtpSending] = useState(false)
    const [sentOtp, setSentOtp] = useState(false)
    const [otpAttempt, setOtpAttempt] = useState(0)
    const [verifyingOtp, setVerifyingOtp] = useState(false)

    const [formData, setFormData] = useState({
        username: "",
        otp: "",
        email: "",
        password: "",
        fullName: "",
        role: "",
        shopName: "",
        shopAddress: "",
        gstNumber: "",
    })

    const handleChange = (e) => {
        setError("");
        setSuccess("");
        let { name, value } = e.target;
        if (name === 'email' || name === "username") value = value.toLowerCase();
        setFormData({
            ...formData,
            [name]: value
        })
    }

    const handleSendOtp = async (e) => {
        e.preventDefault();
        if (!formData.email) {
            setError("Please enter your email address first");
            return;
        }

        setOtpSending(true)
        try {
            await axios.post(`${serverUrl}/users/send-otp`, { email: formData.email }, { withCredentials: true })
            setOtpAttempt(prev => prev + 1)
            setSentOtp(true);
            setSuccess("OTP sent successfully! Check your email.");
            setTimeout(() => setSuccess(""), 3000);
        } catch (error) {
            setError(error.response?.data?.message || "Failed to send OTP. Please try again.");
            console.error(error)
        } finally {
            setOtpSending(false)
        }
    }

    const handleVerifyOtp = async () => {
        if (!formData.otp) {
            setError("Please enter the OTP");
            return;
        }

        setVerifyingOtp(true);
        try {
            await axios.post(`${serverUrl}/users/verify-otp`, { email: formData.email, otp: formData.otp }, { withCredentials: true });
            setSuccess("OTP verified successfully!");
            setTimeout(() => setSuccess(""), 2000);
            return true;
        } catch (error) {
            setError(error.response?.data?.message || "Invalid OTP. Please try again.");
            return false;
        } finally {
            setVerifyingOtp(false);
        }
    }

    const handleSignup = async (e) => {
        e.preventDefault();

        if (!formData.otp) {
            setError("Please verify your email with OTP");
            return;
        }

        setLoading(true)
        try {
            const result = await axios.post(`${serverUrl}/users/signup`, formData, { withCredentials: true })
            setUserData(result.data);
            navigate("/")
            window.location.reload();
        } catch (error) {
            setUserData(null)
            console.error(error)
            setError(error.response?.data?.message || "Registration failed. Please try again.")
            setLoading(false)
        }
    }

    const handleBackToRole = () => {
        setConfirmRole(false);
        setFormData({
            username: "",
            otp: "",
            email: "",
            password: "",
            fullName: "",
            role: "",
            shopName: "",
            shopAddress: "",
            gstNumber: "",
        });
        setSentOtp(false);
        setOtpAttempt(0);
    }

    return (
        <div className='min-h-screen w-full bg-gradient-to-br from-gray-900 via-blue-900 to-black flex items-center justify-center p-4 relative overflow-y-auto'>
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
            </div>

            {/* Mobile Header */}
            <div className='lg:hidden fixed top-0 left-0 right-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-between px-4 py-2'>
                <img className='w-12 h-12 rounded-full object-cover' src={logo} alt="Logo" />
                <div className='text-center'>
                    <p className='text-sm text-gray-200 font-semibold'>Welcome To</p>
                    <p className='text-lg text-blue-400 font-semibold'>My Cart</p>
                </div>
                <Button
                    text='Login'
                    bgColor='bg-gradient-to-r from-blue-600 to-indigo-600 text-sm font-semibold px-4 py-1'
                    onClick={() => navigate("/login")}
                />
            </div>

            <div className='w-full max-w-2xl'>
                <AnimatePresence mode="wait">
                    {!confirmRole ? (
                        <motion.div
                            key="role-selection"
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: -20 }}
                            transition={{ duration: 0.5, type: "spring" }}
                            className='bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700 overflow-hidden'
                        >
                            <div className='text-center pt-8 pb-4'>
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.2, type: "spring" }}
                                    className='inline-block'
                                >
                                    <div className='w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg'>
                                        <span className='text-3xl font-bold text-white'>MC</span>
                                    </div>
                                </motion.div>
                                <motion.h1
                                    initial={{ y: -20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    className='text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent'
                                >
                                    Choose Your Role
                                </motion.h1>
                                <p className='text-gray-400 text-sm mt-2'>Select how you want to use MyCart</p>
                            </div>

                            <div className='px-6 pb-8'>
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className='mb-4 bg-red-500/10 border border-red-500/50 rounded-lg p-3'
                                    >
                                        <p className='text-red-400 text-sm text-center'>{error}</p>
                                    </motion.div>
                                )}

                                <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
                                    <Rolebox
                                        text='User'
                                        isSelected={formData.role === "User"}
                                        img='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGWm7kgMH1PEsycRwkyqPcPB1b2NITpD8j2g&s'
                                        onClick={() => {
                                            setFormData({ ...formData, role: "User" });
                                            setError("");
                                        }}
                                    />
                                    <Rolebox
                                        text='Vendor'
                                        isSelected={formData.role === "Vendor"}
                                        img='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkR0f_N-QMbb0JNreYa_vuG5EcprlYRshSOw&s'
                                        onClick={() => {
                                            setFormData({ ...formData, role: "Vendor" });
                                            setError("");
                                        }}
                                    />
                                    <Rolebox
                                        text='Admin'
                                        isSelected={formData.role === "Admin"}
                                        img='https://img.freepik.com/free-vector/business-user-cog_78370-7040.jpg?semt=ais_hybrid&w=740&q=80'
                                        onClick={() => {
                                            setFormData({ ...formData, role: "Admin" });
                                            setError("");
                                        }}
                                    />
                                </div>

                                <Button
                                    text={<span className='flex items-center justify-center gap-2'>Next <TbPlayerTrackNextFilled /></span>}
                                    bgColor="bg-gradient-to-r from-blue-600 to-indigo-600 w-full"
                                    onClick={() => {
                                        if (formData.role) {
                                            setConfirmRole(true);
                                            setError("");
                                        } else {
                                            setError("Please select a role to continue!");
                                        }
                                    }}
                                />

                                <div className='text-center mt-6'>
                                    <button onClick={() => navigate("/login")} className='text-gray-400 text-sm'>
                                        Already have an account?{' '}
                                        <span

                                            className='text-blue-400 font-semibold hover:underline'
                                        >
                                            Login
                                        </span>
                                    </button>
                                </div>

                                {/* Social Signup Options */}
                                {/* <div className='mt-6'>
                                    <div className='relative my-4'>
                                        <div className='absolute inset-0 flex items-center'>
                                            <div className='w-full border-t border-gray-700'></div>
                                        </div>
                                        <div className='relative flex justify-center text-sm'>
                                            <span className='px-3 bg-gray-800/90 text-gray-400'>Or sign up with</span>
                                        </div>
                                    </div>
                                    <div className='grid grid-cols-3 gap-3'>
                                        <button className='py-2 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center gap-2'>
                                            <FaGoogle className='text-red-400' />
                                            <span className='text-sm hidden sm:inline'>Google</span>
                                        </button>
                                        <button className='py-2 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center gap-2'>
                                            <FaFacebook className='text-blue-400' />
                                            <span className='text-sm hidden sm:inline'>Facebook</span>
                                        </button>
                                        <button className='py-2 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center gap-2'>
                                            <FaApple className='text-white' />
                                            <span className='text-sm hidden sm:inline'>Apple</span>
                                        </button>
                                    </div>
                                </div> */}
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="registration-form"
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: -20 }}
                            transition={{ duration: 0.5, type: "spring" }}
                            className='bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700 overflow-hidden'
                        >
                            {/* Back Button */}
                            <div className='px-6 pt-4'>
                                <button
                                    onClick={handleBackToRole}
                                    className='flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-colors cursor-pointer'
                                >
                                    <MdArrowBack className='text-xl' />
                                    <span className='text-sm'>Back to role selection</span>
                                </button>
                            </div>

                            <div className='text-center pt-4 pb-2'>
                                <h1 className='text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent'>
                                    Create Account
                                </h1>
                                <p className='text-gray-400 text-sm'>Join as a {formData.role}</p>
                            </div>

                            <div className='px-6 pb-8'>
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
                                                <MdCheckCircle />
                                                {success}
                                            </p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <form onSubmit={handleSignup} className='space-y-4'>
                                    <div className='max-h-96 overflow-y-auto custom-scrollbar pr-2 space-y-4'>
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

                                        {/* Username */}
                                        <div>
                                            <label className='text-gray-300 text-sm font-medium flex items-center gap-2 mb-2'>
                                                <FaUser className='text-blue-400' />
                                                Username
                                            </label>
                                            <input
                                                required
                                                type="text"
                                                name='username'
                                                value={formData.username}
                                                onChange={handleChange}
                                                placeholder='Choose a username'
                                                className='w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-all'
                                            />
                                        </div>

                                        {/* Email with OTP */}
                                        <div>
                                            <label className='text-gray-300 text-sm font-medium flex items-center gap-2 mb-2'>
                                                <MdEmail className='text-blue-400' />
                                                Email Address
                                            </label>
                                            <div className='flex gap-2'>
                                                <input
                                                    required
                                                    type="email"
                                                    name='email'
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    placeholder='Enter your email'
                                                    className='flex-1 px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-all'
                                                    disabled={sentOtp}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={handleSendOtp}
                                                    disabled={otpSending || !formData.email}
                                                    className='px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg text-white font-medium hover:from-green-700 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap cursor-pointer'
                                                >
                                                    {otpSending ? 'Sending...' : (otpAttempt > 0 ? 'Resend OTP' : 'Send OTP')}
                                                </button>
                                            </div>
                                        </div>

                                        {/* OTP Verification */}
                                        {sentOtp && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                className='space-y-2'
                                            >
                                                <label className='text-gray-300 text-sm font-medium flex items-center gap-2 mb-2'>
                                                    <MdVerified className='text-green-400' />
                                                    Verification Code
                                                </label>
                                                <div className='flex gap-2'>
                                                    <input
                                                        required
                                                        type="text"
                                                        name='otp'
                                                        value={formData.otp}
                                                        onChange={handleChange}
                                                        placeholder='Enter 6-digit OTP'
                                                        className='flex-1 px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-all'
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={handleVerifyOtp}
                                                        disabled={verifyingOtp || !formData.otp}
                                                        className='px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg text-white font-medium hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50'
                                                    >
                                                        {verifyingOtp ? 'Verifying...' : 'Verify'}
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}

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
                                                    value={formData.password}
                                                    onChange={handleChange}
                                                    placeholder='Create a strong password'
                                                    className='w-full px-4 py-2 pr-12 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-all'
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-400'
                                                >
                                                    {!showPassword ? <FaEye /> : <FaEyeSlash />}
                                                </button>
                                            </div>
                                            <p className='text-gray-500 text-xs mt-1'>Minimum 8 characters with letters and numbers</p>
                                        </div>

                                        {/* Vendor Specific Fields */}
                                        {formData.role === 'Vendor' && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                className='space-y-4 border-t border-gray-700 pt-4'
                                            >
                                                <h3 className='text-md font-semibold text-white flex items-center gap-2'>
                                                    <FaStore className='text-purple-400' />
                                                    Business Information
                                                </h3>

                                                <div>
                                                    <label className='text-gray-300 text-sm font-medium flex items-center gap-2 mb-2'>
                                                        <MdStore className='text-purple-400' />
                                                        Shop Name
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name='shopName'
                                                        value={formData.shopName}
                                                        onChange={handleChange}
                                                        placeholder='Enter your shop/business name'
                                                        className='w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-all'
                                                    />
                                                </div>

                                                <div>
                                                    <label className='text-gray-300 text-sm font-medium flex items-center gap-2 mb-2'>
                                                        <MdLocationOn className='text-purple-400' />
                                                        Shop Address
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name='shopAddress'
                                                        value={formData.shopAddress}
                                                        onChange={handleChange}
                                                        placeholder='Enter your shop address'
                                                        className='w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-all'
                                                    />
                                                </div>

                                                <div>
                                                    <label className='text-gray-300 text-sm font-medium flex items-center gap-2 mb-2'>
                                                        <MdGppGood className='text-purple-400' />
                                                        GST Number (Optional)
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name='gstNumber'
                                                        value={formData.gstNumber}
                                                        onChange={handleChange}
                                                        placeholder='Enter GST number'
                                                        className='w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-all'
                                                    />
                                                </div>
                                            </motion.div>
                                        )}
                                    </div>

                                    {/* Submit Button */}
                                    <Button
                                        type='submit'
                                        text={loading ? "Creating Account..." : <span className='flex items-center justify-center gap-2'>Create Account <TbPlayerTrackNextFilled /></span>}
                                        bgColor="bg-gradient-to-r from-blue-600 to-indigo-600 w-full"
                                        disable={loading || (sentOtp && !formData.otp)}
                                    />
                                </form>

                                <div className='text-center mt-6'>
                                    <button onClick={() => navigate("/login")} className='text-gray-400 text-sm cursor-pointer'>
                                        Already have an account?{' '}
                                        <span

                                            className='text-blue-400 font-semibold hover:underline'
                                        >
                                            Login
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}

export default Signup