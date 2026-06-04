import React, { useContext, useEffect, useState } from 'react'
import image1 from '../../assets/image1.jpg'
import image2 from '../../assets/image2.webp'
import image3 from '../../assets/image3.webp'
import { motion, AnimatePresence } from 'motion/react'
import { IoCaretBack, IoCaretForwardOutline } from "react-icons/io5";
import { FaChevronLeft, FaChevronRight, FaArrowRight } from "react-icons/fa";
import { MdExplore, MdTrendingUp, MdNewReleases, MdVerified } from "react-icons/md";
import ProductSection from './ProductSection'
import { userDataContext } from '../../context/UserContext'

const Dashboard = () => {
  const { setActivePage } = useContext(userDataContext)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [currenCategoryIndex, setCurrentCategoryIndex] = useState(0)
  const [currenCategoryIndexSm, setCurrentCategoryIndexSm] = useState(0)

  const slides = [
    {
      image: image1,
      title: 'NEXT GEN INNOVATION',
      subtitle: 'SMARTPHONES',
      description: "Sleek Design. Powerful Performance. All in One.",
      button: "DISCOVER",
      gradient: "from-blue-600 to-indigo-600",
      lightColor: "blue"
    },
    {
      image: image2,
      title: "TIMELESS ELEGANCE",
      subtitle: "LUXURY COLLECTION",
      description: "Handcrafted Diamond Necklace for Special Evenings",
      button: "EXPLORE",
      gradient: "from-pink-600 to-rose-600",
      lightColor: "pink"
    },
    {
      image: image3,
      title: "TAILORED TO PERFECTION",
      subtitle: "MENS FORMAL WEAR",
      description: "Premium Black Suits, Crafted for Every Occasion",
      button: "SHOP NOW",
      gradient: "from-emerald-600 to-teal-600",
      lightColor: "emerald"
    }
  ]

  const categories = [
    { label: "Fashion & Lifestyle", icon: "👗", color: "from-pink-500 to-rose-500", bg: "bg-pink-500/10", border: "border-pink-500/30" },
    { label: "Electronics & Gadgets", icon: "📱", color: "from-blue-500 to-cyan-500", bg: "bg-blue-500/10", border: "border-blue-500/30" },
    { label: "Home & Living", icon: "🏠", color: "from-orange-500 to-amber-500", bg: "bg-orange-500/10", border: "border-orange-500/30" },
    { label: "Beauty & Personal Care", icon: "💄", color: "from-purple-500 to-fuchsia-500", bg: "bg-purple-500/10", border: "border-purple-500/30" },
    { label: "Toys, Kids & Baby", icon: "🧸", color: "from-green-500 to-emerald-500", bg: "bg-green-500/10", border: "border-green-500/30" },
    { label: "Food & Grocery", icon: "🛒", color: "from-red-500 to-orange-500", bg: "bg-red-500/10", border: "border-red-500/30" },
    { label: "Sports & Fitness", icon: "🏀", color: "from-indigo-500 to-blue-500", bg: "bg-indigo-500/10", border: "border-indigo-500/30" },
    { label: "Automotive Accessories", icon: "🚗", color: "from-gray-500 to-slate-500", bg: "bg-gray-500/10", border: "border-gray-500/30" },
    { label: "Gifts & Handcrafts", icon: "🎁", color: "from-yellow-500 to-amber-500", bg: "bg-yellow-500/10", border: "border-yellow-500/30" },
    { label: "Books & Stationery", icon: "📚", color: "from-teal-500 to-cyan-500", bg: "bg-teal-500/10", border: "border-teal-500/30" },
  ];

  useEffect(() => {
    setActivePage("Home")
    const interval = setInterval(() => {
      setCurrentIndex(pre => pre === slides.length - 1 ? 0 : pre + 1)
      setCurrentCategoryIndex(pre => pre === 0 ? 5 : 0)
      setCurrentCategoryIndexSm(pre => (pre + 3) % 9)
    }, 6000)
    return () => clearInterval(interval)
  }, [])

  const currentSlide = slides[currentIndex]
  const currentCategory = categories.slice(currenCategoryIndex, currenCategoryIndex + 5)
  const currentCategorySm = categories.slice(currenCategoryIndexSm, currenCategoryIndexSm + 3)

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-black'>
      {/* Hero Slider Section */}
      <div className='relative'>
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className='relative h-[70vh] md:h-[90vh] w-full overflow-hidden'
          >
            {/* Background Image */}
            <motion.div 
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 8, ease: "easeOut" }}
              className='absolute inset-0'
            >
              <img 
                src={currentSlide.image} 
                alt="slide" 
                className='object-cover w-full h-full'
              />
              <div className='absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent'></div>
              <div className='absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent'></div>
            </motion.div>

            {/* Content */}
            <div className='relative h-full container mx-auto px-4 flex items-center'>
              <div className='max-w-2xl'>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className='mb-4'
                >
                  <span className={`inline-block px-4 py-1 rounded-full text-xs font-semibold bg-${currentSlide.lightColor}-500/20 text-${currentSlide.lightColor}-400 border border-${currentSlide.lightColor}-500/30 backdrop-blur-sm`}>
                    {currentSlide.title}
                  </span>
                </motion.div>
                
                <motion.h1 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className='text-4xl md:text-7xl lg:text-8xl font-bold text-white mb-4 leading-tight'
                >
                  {currentSlide.description}
                </motion.h1>
                
                <motion.p 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className='text-lg md:text-2xl text-gray-200 mb-8'
                >
                  {currentSlide.subtitle}
                </motion.p>
                
                <motion.button 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                  whileHover={{ scale: 1.05, x: 10 }}
                  whileTap={{ scale: 0.95 }}
                  className={`group relative overflow-hidden bg-gradient-to-r ${currentSlide.gradient} px-8 py-4 rounded-full font-semibold text-white shadow-2xl transition-all duration-300`}
                >
                  <span className='relative z-10 flex items-center gap-2'>
                    {currentSlide.button}
                    <FaArrowRight className='group-hover:translate-x-1 transition-transform duration-300' />
                  </span>
                  <div className='absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300'></div>
                </motion.button>
              </div>
            </div>

            {/* Slide Indicators */}
            <div className='absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20'>
              {slides.map((_, idx) => (
                <motion.button
                  key={idx}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setCurrentIndex(idx)}
                  className={`transition-all duration-300 ${currentIndex === idx ? 'w-12 bg-white' : 'w-3 bg-white/50'} h-3 rounded-full`}
                />
              ))}
            </div>

            {/* Navigation Buttons */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setCurrentIndex(prev => prev === 0 ? slides.length - 1 : prev - 1)}
              className='absolute left-4 md:left-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 z-20'
            >
              <FaChevronLeft className='text-white text-2xl' />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setCurrentIndex(prev => prev === slides.length - 1 ? 0 : prev + 1)}
              className='absolute right-4 md:right-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 z-20'
            >
              <FaChevronRight className='text-white text-2xl' />
            </motion.button>

            {/* Thumbnail Strip */}
            <div className='absolute bottom-20 right-8 flex gap-3 z-20'>
              {slides.map((slide, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.1, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentIndex(idx)}
                  className={`cursor-pointer transition-all duration-300 ${currentIndex === idx ? 'ring-4 ring-white shadow-2xl' : 'opacity-60 hover:opacity-100'}`}
                >
                  <img 
                    src={slide.image} 
                    alt={`thumb${idx + 1}`} 
                    className='h-16 w-24 md:h-24 md:w-32 object-cover rounded-xl'
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Categories Section */}
      <div className='relative py-16 md:py-24 overflow-hidden'>
        {/* Background Decoration */}
        <div className='absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent pointer-events-none'></div>
        
        <div className='container mx-auto px-4'>
          {/* Section Header */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className='text-center mb-12 md:mb-16'
          >
            <span className='inline-block px-4 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-400 border border-purple-500/30 mb-4'>
              EXPLORE COLLECTIONS
            </span>
            <h2 className='text-3xl md:text-5xl font-bold bg-gradient-to-r from-white via-purple-400 to-blue-400 bg-clip-text text-transparent'>
              Shop by Categories
            </h2>
            <p className='text-gray-400 text-base md:text-lg mt-4 max-w-2xl mx-auto'>
              Discover amazing products across our curated categories
            </p>
          </motion.div>

          {/* Desktop Categories */}
          <div className='hidden md:grid grid-cols-5 gap-6'>
            <AnimatePresence mode="wait">
              {currentCategory.map((item, index) => (
                <motion.button
                  key={`${currenCategoryIndex}-${index}`}
                  initial={{ opacity: 0, scale: 0.8, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: -30 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  whileHover={{ scale: 1.05, y: -8 }}
                  whileTap={{ scale: 0.95 }}
                  className={`group relative overflow-hidden bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-2xl p-6 border ${item.border} hover:shadow-2xl transition-all duration-300`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                  <div className='relative z-10'>
                    <div className='text-7xl mb-4 group-hover:scale-110 transition-transform duration-300'>
                      {item.icon}
                    </div>
                    <p className='font-semibold text-white text-sm'>
                      {item.label}
                    </p>
                    <div className='mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                      <span className='text-xs text-gray-400'>Shop Now →</span>
                    </div>
                  </div>
                </motion.button>
              ))}
            </AnimatePresence>
          </div>

          {/* Mobile Categories */}
          <div className='grid grid-cols-2 gap-4 md:hidden'>
            <AnimatePresence mode="wait">
              {currentCategorySm.map((item, index) => (
                <motion.button
                  key={`${currenCategoryIndexSm}-${index}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  className={`group bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-xl p-4 border ${item.border}`}
                >
                  <div className='text-4xl mb-2'>
                    {item.icon}
                  </div>
                  <p className='font-semibold text-white text-sm'>
                    {item.label}
                  </p>
                </motion.button>
              ))}
            </AnimatePresence>
          </div>

          {/* Navigation Arrows */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className='absolute top-1/2 -translate-y-1/2 left-2 md:-left-5 p-3 rounded-full bg-gray-800/80 backdrop-blur-sm border border-gray-700 shadow-xl hover:shadow-blue-500/30 transition-all duration-300 z-10'
            onClick={() => {
              setCurrentCategoryIndex(pre => pre === 0 ? 5 : 0);
              setCurrentCategoryIndexSm(pre => pre !== 0 ? ((pre - 3) % 9) : 6)
            }}
          >
            <FaChevronLeft className='text-white text-xl md:text-2xl' />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className='absolute top-1/2 -translate-y-1/2 right-2 md:-right-5 p-3 rounded-full bg-gray-800/80 backdrop-blur-sm border border-gray-700 shadow-xl hover:shadow-blue-500/30 transition-all duration-300 z-10'
            onClick={() => {
              setCurrentCategoryIndex(pre => pre === 0 ? 5 : 0);
              setCurrentCategoryIndexSm(pre => (pre + 3) % 9)
            }}
          >
            <FaChevronRight className='text-white text-xl md:text-2xl' />
          </motion.button>
        </div>
      </div>

      {/* Stats Section */}
      <div className='py-12 md:py-16 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10'>
        <div className='container mx-auto px-4'>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8'>
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className='text-center'
            >
              <div className='text-4xl md:text-5xl font-bold text-white mb-2'>10K+</div>
              <div className='text-gray-400 text-sm'>Happy Customers</div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className='text-center'
            >
              <div className='text-4xl md:text-5xl font-bold text-white mb-2'>500+</div>
              <div className='text-gray-400 text-sm'>Premium Brands</div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className='text-center'
            >
              <div className='text-4xl md:text-5xl font-bold text-white mb-2'>50K+</div>
              <div className='text-gray-400 text-sm'>Products Sold</div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className='text-center'
            >
              <div className='text-4xl md:text-5xl font-bold text-white mb-2'>24/7</div>
              <div className='text-gray-400 text-sm'>Customer Support</div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Product Section */}
      <ProductSection />
    </div>
  )
}

export default Dashboard