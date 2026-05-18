import React, { useEffect, useState} from 'react'
import image1 from '../../assets/image1.jpg'
import image2 from '../../assets/image2.webp'
import image3 from '../../assets/image3.webp'
import { motion, AnimatePresence } from 'motion/react'


const Dashboard = () => {
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
    },
    {
      image: image2,
      title: "TIMELESS ELEGANCE",
      subtitle: "LUXURY COLLECTION",
      description: "Handcrafted Diamond Necklace for Special Evenings",
      button: "EXPLORE",
    },
    {
      image: image3,
      title: "TAILORED TO PERFECTION",
      subtitle: "MENS FORMAL WEAR",
      description: "Premium Black Suits, Crafted for Every Occasion",
      button: "SHOP NOW",
    }
  ]

  const categories = [
    { label: "Fashion & Lifestyle", icon: "👗" },
    { label: "Electronics & Gadgets", icon: "📱" },
    { label: "Home & Living", icon: "🏠" },
    { label: "Beauty & Personal Care", icon: "💄" },
    { label: "Toys, Kids & Baby", icon: "🧸" },
    { label: "Food & Grocery", icon: "🛒" },
    { label: "Sports & Fitness", icon: "🏀" },
    { label: "Automotive Accessories", icon: "🚗" },
    { label: "Gifts & Handcrafts", icon: "🎁" },
    { label: "Books & Stationery", icon: "📚" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(pre => pre === slides.length - 1 ? 0 : pre + 1)
      setCurrentCategoryIndex(pre => pre === 0 ? 5 : 0)
      setCurrentCategoryIndexSm(pre => (pre +3) % 9)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const currentSlide = slides[currentIndex]
  const currentCategory = categories.slice(currenCategoryIndex,currenCategoryIndex + 5)
  const currentCategorySm = categories.slice(currenCategoryIndexSm,currenCategoryIndexSm + 3)



  return (
    <div className='h-screen w-screen text-white pt-20'>
      <AnimatePresence mode="popLayout">
        <motion.div key={currentIndex} 
        initial={{ opacity: 0, x: '100%' }} 
        animate={{ opacity: 1, x: 0 }}
        exit={{opacity: 0, x: '-100%'}}
        transition={{ type: "spring", stiffness: 200, damping: 28}} 
        className='md:h-full h-80 w-full relative overflow-hidden'>

        <img src={currentSlide.image} alt="sides" className='object-cover h-full w-full'/>

        <div className='bg-gray-700/60 w-[90%] h-[70%] md:w-250 md:h-100 absolute top-10 left-5 md:left-40 rounded-4xl p-5 flex flex-col gap-1 md:gap-4 items-start justify-center shadow-xl hover:shadow-blue-600'>
          <h1 className='text-sm md:text-2xl '>{currentSlide.title}</h1>
          <h1 className='text-lg md:text-4xl '>{currentSlide.description}</h1>
          <h1 className='text-sm md:text-lg '>{currentSlide.subtitle}</h1>
          <button className='bg-blue-800 p-3 px-5 rounded-full shadow-lg hover:shadow-blue-600 hover:border-2 hover:border-white cursor-pointer'>{currentSlide.button}</button>
        </div>

        </motion.div>

        <motion.div key={currenCategoryIndex+5}
        initial={{ opacity: 0, x: '100%' }} 
        animate={{ opacity: 1, x: 0 }}
        exit={{opacity: 0, x: '-100%'}}
        transition={{ type: "spring", stiffness: 200, damping: 28}}
         className=' h-100 w-screen flex justify-center gap-3 md:gap-6 '>
          { currentCategory.map((item, index) =>
          <button key={index} className='hidden md:block bg-gray-800 h-40 w-60 border-3 hover:border-4 border-blue-500 hover:border-blue-700 cursor-pointer rounded-3xl shadow-xl hover:shadow-blue-600'>
            <p className='text-5xl'>{item.icon}</p>
            <p>{item.label}</p>
          </button>
          )}
          { currentCategorySm.map((item, index) =>
          <button key={index} className='md:hidden bg-gray-800 h-30 w-40 border-3 hover:border-4 border-blue-500 hover:border-blue-700 cursor-pointer rounded-3xl shadow-xl hover:shadow-blue-600'>
            <p className='text-4xl'>{item.icon}</p>
            <p>{item.label}</p>
          </button>
          )}

          
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default Dashboard
