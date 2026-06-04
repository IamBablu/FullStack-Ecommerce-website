import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import { FaEye, FaEyeSlash, FaGoogle, FaFacebook, FaApple, FaEnvelope, FaLock, FaUser } from "react-icons/fa";
import { TbPlayerTrackNextFilled } from "react-icons/tb";
import { MdEmail, MdPassword, MdLogin, MdVerified } from "react-icons/md";
import logo from '../assets/logo.jpeg'
import { motion, AnimatePresence } from "motion/react"
import axios from 'axios';
import { userDataContext } from '../context/UserContext';

const Login = () => {
    const { userdata, setUserData, serverUrl } = React.useContext(userDataContext)
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [rememberMe, setRememberMe] = useState(false)
    const [formData, setFormData] = useState({
        loginKey: "",
        password: ""
    })

    const navigate = useNavigate();
    
    const handleChange = (e) => {
        setError("")
        let { name, value } = e.target;
        if (name === 'loginKey') value = value.toLowerCase();
        setFormData({
            ...formData,
            [name]: value
        })
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!formData.loginKey || !formData.password) {
            setError("Please fill in all fields");
            return;
        }
        
        setLoading(true)
        try {
            const result = await axios.post(`${serverUrl}/users/signin`, formData, { withCredentials: true })
            setUserData(result.data)
            
            // Store remember me preference
            if (rememberMe && formData.loginKey) {
                localStorage.setItem('rememberedEmail', formData.loginKey);
            } else {
                localStorage.removeItem('rememberedEmail');
            }
            
            navigate('/')
            setLoading(false)
            window.location.reload();
        } catch (error) {
            setUserData(null)
            console.error(error)
            setError(error.response?.data?.message || "Invalid credentials. Please try again.")
            setLoading(false)
        }
    }

    // Load remembered email on component mount
    React.useEffect(() => {
        const rememberedEmail = localStorage.getItem('rememberedEmail');
        if (rememberedEmail) {
            setFormData(prev => ({ ...prev, loginKey: rememberedEmail }));
            setRememberMe(true);
        }
    }, []);

    return (
        <div className='min-h-screen w-full bg-gradient-to-br from-gray-900 via-blue-900 to-black flex items-center justify-center p-4 relative overflow-hidden'>
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
                    text='Signup' 
                    bgColor='bg-gradient-to-r from-blue-600 to-indigo-600 text-sm font-semibold px-4 py-1' 
                    onClick={() => navigate("/signup")} 
                />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
                className='w-full max-w-md'
            >
                <div className='bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700 overflow-hidden'>
                    {/* Logo and Title Section */}
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
                            transition={{ delay: 0.3 }}
                            className='text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent'
                        >
                            Welcome Back
                        </motion.h1>
                        <motion.p 
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className='text-gray-400 text-sm mt-2'
                        >
                            Sign in to continue to MyCart
                        </motion.p>
                    </div>

                    {/* Form Section */}
                    <div className='px-6 pb-8'>
                        <form onSubmit={handleLogin} className='space-y-5'>
                            {/* Error Message */}
                            <AnimatePresence>
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className='bg-red-500/10 border border-red-500/50 rounded-lg p-3 flex items-center gap-2'
                                    >
                                        <div className='w-1 h-8 bg-red-500 rounded-full'></div>
                                        <p className='text-red-400 text-sm flex-1'>{error}</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Email/Username Field */}
                            <div className='space-y-2'>
                                <label className='text-gray-300 text-sm font-medium flex items-center gap-2'>
                                    <MdEmail className='text-blue-400' />
                                    Email or Username
                                </label>
                                <div className='relative group'>
                                    <div className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-400 transition-colors'>
                                        <FaUser />
                                    </div>
                                    <input 
                                        type="text" 
                                        name='loginKey' 
                                        value={formData.loginKey} 
                                        onChange={handleChange} 
                                        placeholder='Enter your email or username' 
                                        className='w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-all duration-300'
                                    />
                                </div>
                            </div>

                            {/* Password Field */}
                            <div className='space-y-2'>
                                <label className='text-gray-300 text-sm font-medium flex items-center gap-2'>
                                    <FaLock className='text-blue-400' />
                                    Password
                                </label>
                                <div className='relative group'>
                                    <div className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-400 transition-colors'>
                                        <MdPassword />
                                    </div>
                                    <input 
                                        type={showPassword ? 'text' : 'password'} 
                                        name='password' 
                                        value={formData.password} 
                                        onChange={handleChange} 
                                        placeholder='Enter your password' 
                                        className='w-full pl-10 pr-12 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-all duration-300'
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-400 transition-colors'
                                    >
                                        {!showPassword ? <FaEye className='text-xl' /> : <FaEyeSlash className='text-xl' />}
                                    </button>
                                </div>
                            </div>

                            {/* Remember Me & Forgot Password */}
                            <div className='flex items-center justify-between'>
                                <label className='flex items-center gap-2 cursor-pointer'>
                                    <input 
                                        type="checkbox" 
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        className='w-4 h-4 rounded border-gray-600 text-blue-600 focus:ring-blue-500'
                                    />
                                    <span className='text-gray-400 text-sm'>Remember me</span>
                                </label>
                                <button 
                                    type="button"
                                    onClick={() => navigate("/forgot-password")}
                                    className='text-blue-400 text-sm hover:underline transition-colors'
                                >
                                    Forgot Password?
                                </button>
                            </div>

                            {/* Login Button */}
                            <motion.button
                                type='submit'
                                disabled={loading}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className='w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl font-semibold text-white hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed'
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span>Logging in...</span>
                                    </div>
                                ) : (
                                    <span className='flex items-center justify-center gap-2 cursor-pointer'>
                                        Login <MdLogin className='text-xl' />
                                    </span>
                                )}
                            </motion.button>

                            {/* Sign Up Link */}
                            <div className='text-center pt-3'>
                                <button type="button"
                                        onClick={() => navigate("/signup")}
                                 className='text-gray-400 text-sm cursor-pointer'>
                                    Don't have an account?{' '}
                                    <span 
                                        
                                        className='text-blue-400 font-semibold hover:underline transition-colors'
                                    >
                                        Sign up
                                    </span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Footer Note */}
                <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className='text-center text-gray-500 text-xs mt-6'
                >
                    By continuing, you agree to our Terms of Service and Privacy Policy
                </motion.p>
            </motion.div>
        </div>
    )
}

export default Login