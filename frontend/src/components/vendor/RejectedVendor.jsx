import React, { useState, useEffect } from 'react'
import { userDataContext } from '../../context/UserContext'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { MdCancel, MdWarning, MdFeedback, MdEdit, MdEmail, MdSupportAgent, MdCheckCircle, MdArrowForward } from "react-icons/md";
import { FaExclamationTriangle, FaRegSadTear, FaRegFrown, FaRegMeh, FaPaperPlane, FaRedo } from "react-icons/fa";
import { TbPlayerTrackNextFilled } from "react-icons/tb";

const RejectedVendor = () => {
    const { userdata } = React.useContext(userDataContext)
    const navigate = useNavigate()
    const [showHelp, setShowHelp] = useState(false)
    const [feedbackSent, setFeedbackSent] = useState(false)

    useEffect(() => {
        console.log(userdata)
    }, [userdata])

    const handleContactSupport = () => {
        window.location.href = 'mailto:support@example.com?subject=Vendor%20Verification%20Appeal&body=Hello%20Support%20Team,%0A%0AMy%20vendor%20application%20was%20rejected.%20I%20would%20like%20to%20appeal%20the%20decision.%0A%0AReason%20for%20rejection:%20' + encodeURIComponent(userdata?.rejectedReason || 'Not provided') + '%0A%0APlease%20review%20my%20application%20again.%0A%0AThank%20you.';
    }

    const handleFeedback = () => {
        setFeedbackSent(true)
        setTimeout(() => setFeedbackSent(false), 3000)
    }

    const getRejectionReasonIcon = () => {
        const reason = userdata?.rejectedReason?.toLowerCase() || ''
        if (reason.includes('document') || reason.includes('gst') || reason.includes('shop')) {
            return '📄'
        }
        if (reason.includes('address') || reason.includes('location')) {
            return '📍'
        }
        if (reason.includes('email') || reason.includes('phone')) {
            return '📞'
        }
        return '⚠️'
    }

    const getRejectionTips = () => {
        const reason = userdata?.rejectedReason?.toLowerCase() || ''
        if (reason.includes('document')) {
            return [
                'Ensure all documents are clear and readable',
                'Upload valid GST certificate',
                'Business registration proof must be current',
                'Documents should be in JPG or PDF format'
            ]
        }
        if (reason.includes('address')) {
            return [
                'Verify your shop address is correct',
                'Add complete address with PIN code',
                'Address should match business documents',
                'Include landmark for better verification'
            ]
        }
        if (reason.includes('email') || reason.includes('phone')) {
            return [
                'Check your contact information is correct',
                'Use active email address and phone number',
                'Ensure phone number is reachable',
                'Keep communication channels active'
            ]
        }
        return [
            'Review all submitted information carefully',
            'Ensure all fields are filled correctly',
            'Provide accurate business details',
            'Contact support for specific guidance'
        ]
    }

    return (
        <div className='min-h-screen mt-20 w-full bg-gradient-to-br from-gray-900 via-red-900 to-black flex items-center justify-center p-4 relative overflow-hidden'>
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, type: "spring" }}
                className='w-full max-w-lg'
            >
                <div className='bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700 overflow-hidden'>
                    {/* Animated Header */}
                    <div className='relative bg-gradient-to-r from-red-600 to-red-700 px-6 py-8 text-center overflow-hidden'>
                        <motion.div
                            animate={{ 
                                scale: [1, 1.2, 1],
                                rotate: [0, 5, -5, 0]
                            }}
                            transition={{ 
                                duration: 2,
                                repeat: Infinity,
                                repeatType: "loop"
                            }}
                            className='absolute top-0 right-0 opacity-10'
                        >
                            <MdCancel className='text-8xl text-white' />
                        </motion.div>
                        
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring" }}
                            className='relative z-10'
                        >
                            <div className='w-24 h-24 mx-auto bg-white/10 rounded-full flex items-center justify-center mb-4'>
                                <FaExclamationTriangle className='text-5xl text-white animate-pulse' />
                            </div>
                            <h1 className='text-2xl font-bold text-white mb-2'>
                                Verification Rejected
                            </h1>
                            <p className='text-red-200 text-sm'>
                                Your application needs revision
                            </p>
                        </motion.div>
                    </div>

                    {/* Content Section */}
                    <div className='p-6 space-y-5'>
                        {/* Status Message */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className='text-center'
                        >
                            <div className='inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 rounded-full border border-red-500/30 mb-3'>
                                <MdWarning className='text-red-400' />
                                <span className='text-red-400 font-medium'>Status: REJECTED</span>
                            </div>
                            <p className='text-gray-300'>
                                Your business verification was rejected by Admin
                            </p>
                        </motion.div>

                        {/* Rejection Reason Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className='bg-red-500/10 border border-red-500/30 rounded-xl p-4'
                        >
                            <div className='flex items-start gap-3'>
                                <div className='text-3xl'>{getRejectionReasonIcon()}</div>
                                <div className='flex-1'>
                                    <h3 className='text-white font-semibold mb-1 flex items-center gap-2'>
                                        Reason for Rejection
                                        <span className='text-xs text-red-400 font-normal'>⚠️</span>
                                    </h3>
                                    <p className='text-red-300 text-sm'>
                                        {userdata?.rejectedReason || 'No specific reason provided. Please contact support for more details.'}
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Tips for Reapplication */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className='bg-blue-500/10 border border-blue-500/30 rounded-xl p-4'
                        >
                            <h3 className='text-white font-semibold mb-3 flex items-center gap-2'>
                                <MdFeedback className='text-blue-400' />
                                Tips for Reapplication
                            </h3>
                            <ul className='space-y-2'>
                                {getRejectionTips().map((tip, index) => (
                                    <motion.li 
                                        key={index}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.6 + (index * 0.1) }}
                                        className='flex items-start gap-2 text-sm text-gray-300'
                                    >
                                        <MdCheckCircle className='text-green-400 mt-0.5 flex-shrink-0' />
                                        <span>{tip}</span>
                                    </motion.li>
                                ))}
                            </ul>
                        </motion.div>

                        {/* Action Buttons */}
                        <div className='space-y-3 pt-2'>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => navigate('/update-vendor-details')}
                                className='w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl font-semibold text-white hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center justify-center gap-2'
                            >
                                <FaRedo className='text-white' />
                                Verify Again
                                <TbPlayerTrackNextFilled />
                            </motion.button>

                            <div className='grid grid-cols-2 gap-3'>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setShowHelp(!showHelp)}
                                    className='px-4 py-2.5 bg-gray-700 rounded-lg font-semibold text-gray-300 hover:bg-gray-600 transition-all flex items-center justify-center gap-2'
                                >
                                    <MdSupportAgent />
                                    Need Help?
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleContactSupport}
                                    className='px-4 py-2.5 bg-gray-700 rounded-lg font-semibold text-gray-300 hover:bg-gray-600 transition-all flex items-center justify-center gap-2'
                                >
                                    <MdEmail />
                                    Contact Support
                                </motion.button>
                            </div>
                        </div>

                        {/* Help Section */}
                        <AnimatePresence>
                            {showHelp && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className='overflow-hidden'
                                >
                                    <div className='bg-gray-800/50 rounded-lg p-4 space-y-3 mt-2'>
                                        <h4 className='text-white font-semibold text-sm'>How to get help:</h4>
                                        <ul className='space-y-2 text-sm text-gray-300'>
                                            <li className='flex items-center gap-2'>
                                                <div className='w-1.5 h-1.5 bg-blue-400 rounded-full'></div>
                                                Email support team at support@example.com
                                            </li>
                                            <li className='flex items-center gap-2'>
                                                <div className='w-1.5 h-1.5 bg-blue-400 rounded-full'></div>
                                                Call us at +1 234 567 8900 (9AM-6PM)
                                            </li>
                                            <li className='flex items-center gap-2'>
                                                <div className='w-1.5 h-1.5 bg-blue-400 rounded-full'></div>
                                                Live chat available on our website
                                            </li>
                                            <li className='flex items-center gap-2'>
                                                <div className='w-1.5 h-1.5 bg-blue-400 rounded-full'></div>
                                                Response time: Within 24 hours
                                            </li>
                                        </ul>
                                        <button
                                            onClick={handleFeedback}
                                            className='mt-2 w-full py-2 bg-blue-600/20 border border-blue-600 rounded-lg text-blue-400 text-sm hover:bg-blue-600/30 transition-colors flex items-center justify-center gap-2'
                                        >
                                            <FaPaperPlane />
                                            Send Feedback
                                        </button>
                                        {feedbackSent && (
                                            <motion.p
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className='text-green-400 text-xs text-center'
                                            >
                                                Feedback sent! We'll get back to you soon.
                                            </motion.p>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Additional Info */}
                        <div className='text-center pt-2'>
                            <p className='text-gray-500 text-xs'>
                                Need immediate assistance? Contact our support team for priority help
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className='mt-4 grid grid-cols-3 gap-3'
                >
                    <div className='bg-gray-800/50 rounded-xl p-2 text-center'>
                        <p className='text-2xl font-bold text-white'>24/7</p>
                        <p className='text-xs text-gray-400'>Support</p>
                    </div>
                    <div className='bg-gray-800/50 rounded-xl p-2 text-center'>
                        <p className='text-2xl font-bold text-white'>2-3</p>
                        <p className='text-xs text-gray-400'>Hours Review</p>
                    </div>
                    <div className='bg-gray-800/50 rounded-xl p-2 text-center'>
                        <p className='text-2xl font-bold text-white'>100%</p>
                        <p className='text-xs text-gray-400'>Secure</p>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    )
}

export default RejectedVendor