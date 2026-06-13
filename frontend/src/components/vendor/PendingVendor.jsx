import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { MdPending, MdAccessTime, MdEmail, MdSupportAgent, MdVerified, MdCheckCircle, MdWarning } from "react-icons/md";
import { FaSpinner, FaClock, FaUserCheck, FaEnvelope, FaHeadset } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

const PendingVendor = () => {
  const [timeElapsed, setTimeElapsed] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Timer to show how long they've been waiting
    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  const formatTime = (minutes) => {
    if (minutes < 60) {
      return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours} hour${hours !== 1 ? 's' : ''}${mins > 0 ? ` ${mins} minute${mins !== 1 ? 's' : ''}` : ''}`;
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className='min-h-screen mt-20 w-full bg-linear-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4'>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
          className='max-w-md w-full'
        >
          {/* Main Card */}
          <div className='bg-linear-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700 overflow-hidden'>
            {/* Animated Header */}
            <div className='relative bg-linear-to-r from-blue-600 to-indigo-600 px-6 py-8 text-center overflow-hidden'>
              <motion.div
                animate={{ 
                  rotate: 360,
                  scale: [1, 1.2, 1]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "loop"
                }}
                className='absolute top-0 right-0 opacity-10'
              >
                <MdPending className='text-8xl text-white' />
              </motion.div>
              
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className='relative z-10'
              >
                <div className='w-24 h-24 mx-auto bg-white/10 rounded-full flex items-center justify-center mb-4'>
                  <FaSpinner className='text-5xl text-white animate-spin' />
                </div>
                <h1 className='text-2xl font-bold text-white mb-2'>
                  Verification Pending
                </h1>
                <p className='text-blue-200 text-sm'>
                  Your application is being reviewed
                </p>
              </motion.div>
            </div>

            {/* Content Section */}
            <div className='p-6 space-y-6'>
              {/* Status Message */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className='text-center'
              >
                <p className='text-gray-300 mb-3'>
                  You can access vendor dashboard only after admin verification
                </p>
                <div className='inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/10 rounded-full border border-yellow-500/30'>
                  <MdWarning className='text-yellow-400' />
                  <span className='text-yellow-400 font-medium'>Verification Status: PENDING</span>
                </div>
              </motion.div>

              {/* Info Cards */}
              <div className='grid grid-cols-2 gap-3'>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className='bg-gray-700/30 rounded-xl p-3 text-center'
                >
                  <div className='flex justify-center mb-2'>
                    <div className='p-2 bg-blue-500/20 rounded-lg'>
                      <FaClock className='text-blue-400 text-xl' />
                    </div>
                  </div>
                  <p className='text-gray-400 text-xs'>Estimated Time</p>
                  <p className='text-white font-semibold text-sm'>2-3 hours</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className='bg-gray-700/30 rounded-xl p-3 text-center'
                >
                  <div className='flex justify-center mb-2'>
                    <div className='p-2 bg-green-500/20 rounded-lg'>
                      <MdAccessTime className='text-green-400 text-xl' />
                    </div>
                  </div>
                  <p className='text-gray-400 text-xs'>Waiting Time</p>
                  <p className='text-white font-semibold text-sm'>
                    {timeElapsed === 0 ? 'Just started' : formatTime(timeElapsed)}
                  </p>
                </motion.div>
              </div>

              {/* Progress Indicator */}
              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className='space-y-2'
              >
                <div className='flex justify-between text-xs text-gray-400'>
                  <span>Application Received</span>
                  <span>Under Review</span>
                  <span>Approval</span>
                </div>
                <div className='relative'>
                  <div className='w-full bg-gray-700 rounded-full h-2'>
                    <motion.div
                      initial={{ width: "33%" }}
                      animate={{ width: "33%" }}
                      className='h-2 rounded-full bg-linear-to-r from-blue-500 to-indigo-500'
                    />
                  </div>
                  <motion.div
                    animate={{
                      x: ["0%", "33%", "0%"],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse",
                    }}
                    className='absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-blue-400 rounded-full shadow-lg'
                    style={{ left: "33%" }}
                  />
                </div>
              </motion.div>

              {/* Action Buttons */}
              <div className='space-y-3 pt-2'>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleRefresh}
                  className='w-full cursor-pointer px-4 py-2.5 bg-linear-to-r from-blue-600 to-indigo-600 rounded-lg font-semibold text-white hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center justify-center gap-2'
                >
                  <FaSpinner className={`animate-spin ${timeElapsed > 0 ? 'opacity-100' : 'opacity-0'}`} />
                  Check Status Again
                </motion.button>
              </div>

              {/* Help Text */}
              <div className='text-center pt-2'>
                <p className='text-xs text-gray-500'>
                  Need urgent access? Contact our support team for assistance
                </p>
              </div>
            </div>
          </div>

          {/* Additional Information Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className='mt-4 grid grid-cols-1 md:grid-cols-2 gap-3'
          >
            <div className='bg-gray-800/50 rounded-xl p-3 border border-gray-700'>
              <div className='flex items-center gap-2 mb-2'>
                <MdCheckCircle className='text-green-400' />
                <h3 className='text-sm font-semibold text-white'>What happens next?</h3>
              </div>
              <ul className='space-y-1 text-xs text-gray-400'>
                <li>• Admin reviews your application</li>
                <li>• Verification typically takes 2-3 hours</li>
                <li>• You'll receive an email confirmation</li>
                <li>• Access granted to vendor dashboard</li>
              </ul>
            </div>

            <div className='bg-gray-800/50 rounded-xl p-3 border border-gray-700'>
              <div className='flex items-center gap-2 mb-2'>
                <MdSupportAgent className='text-blue-400' />
                <h3 className='text-sm font-semibold text-white'>Need help?</h3>
              </div>
              <ul className='space-y-1 text-xs text-gray-400'>
                <li>• Email: support@example.com</li>
                <li>• Response within 24 hours</li>
                <li>• Check spam folder for updates</li>
                <li>• Live chat available 9AM-6PM</li>
              </ul>
            </div>
          </motion.div>

          {/* Loading Animation Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className='mt-6 text-center'
          >
            <div className='inline-flex items-center gap-2 text-gray-500 text-xs'>
              <div className='flex gap-1'>
                <div className='w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce' style={{ animationDelay: '0s' }}></div>
                <div className='w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce' style={{ animationDelay: '0.2s' }}></div>
                <div className='w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce' style={{ animationDelay: '0.4s' }}></div>
              </div>
              <span>Processing your application...</span>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default PendingVendor