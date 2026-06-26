import React, { useContext, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { userDataContext } from '../../context/UserContext'
import { StarRating } from '../../context/UserContext'
import ProductCard from './ProductCard'
import axios from 'axios'
import logo from '../../assets/logo.jpeg'
import { useNavigate } from 'react-router-dom'
import { 
    MdFilterList, 
    MdGridOn, 
    MdViewList, 
    MdClose, 
    MdCategory,
    MdPriceChange,
    MdSort,
    MdClear,
    MdTrendingUp,
    MdNewReleases,
    MdStar
} from 'react-icons/md'
import { FaSpinner, FaChevronLeft, FaChevronRight } from 'react-icons/fa'

const ProductSection = () => {
    const { serverUrl, products, setProducts, userdata, setUserData } = useContext(userDataContext)
    const [loading, setLoading] = useState(true)
    const [viewMode, setViewMode] = useState('grid')
    const [filterOpen, setFilterOpen] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [sortBy, setSortBy] = useState('latest')
    const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 })
    const [filteredProducts, setFilteredProducts] = useState([])
    const [showAllCategories, setShowAllCategories] = useState(false)

    const categories = [
        { value: 'all', label: 'All Products', icon: '🛍️' },
        { value: 'fashion-lifestyle', label: 'Fashion & Lifestyle', icon: '👗' },
        { value: 'electronics-gadgets', label: 'Electronics', icon: '📱' },
        { value: 'home-living', label: 'Home & Living', icon: '🏠' },
        { value: 'beauty-personal-care', label: 'Beauty', icon: '💄' },
        { value: 'toys-kids-baby', label: 'Toys & Kids', icon: '🧸' },
        { value: 'sports-fitness', label: 'Sports & Fitness', icon: '🏀' },
        { value: 'automotive', label: 'Automotive', icon: '🚗' },
        { value: 'books-stationery', label: 'Books & Stationery', icon: '📚' },
        { value: 'gifts-handcrafts', label: 'Gifts & Handcrafts', icon: '🎁' },
    ]

    const sortOptions = [
        { value: 'latest', label: 'Latest Arrivals', icon: <MdNewReleases /> },
        { value: 'price-low', label: 'Price: Low to High', icon: <MdPriceChange /> },
        { value: 'price-high', label: 'Price: High to Low', icon: <MdPriceChange /> },
        { value: 'popular', label: 'Most Popular', icon: <MdTrendingUp /> },
        { value: 'rating', label: 'Top Rated', icon: <MdStar /> }
    ]

    const visibleCategories = showAllCategories ? categories : categories.slice(0, 6)

    const getUserProducts = async () => {
        try {
            setLoading(true)
            const result = await axios.get(`${serverUrl}/product/get-user-product`)
            const productData = result.data.data || []
            setProducts(productData)
            setFilteredProducts(productData)
        } catch (error) {
            console.error(error)
            setProducts([])
            setFilteredProducts([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getUserProducts();
    }, [])

    useEffect(() => {
        const productArray = products || []
        let filtered = [...productArray]
        
        if (selectedCategory !== 'all') {
            filtered = filtered.filter(p => p?.category === selectedCategory)
        }
        
        filtered = filtered.filter(p => (p?.price || 0) >= priceRange.min && (p?.price || 0) <= priceRange.max)
        
        if (sortBy === 'latest') {
            filtered.sort((a, b) => new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0))
        } else if (sortBy === 'price-low') {
            filtered.sort((a, b) => (a?.price || 0) - (b?.price || 0))
        } else if (sortBy === 'price-high') {
            filtered.sort((a, b) => (b?.price || 0) - (a?.price || 0))
        } else if (sortBy === 'popular') {
            filtered.sort((a, b) => (b?.soldCount || 0) - (a?.soldCount || 0))
        } else if (sortBy === 'rating') {
            filtered.sort((a, b) => ((b?.reviews?.rating / b?.reviews?.length) || 0) - ((a?.reviews?.rating / a?.reviews?.length) || 0))
        }
        
        setFilteredProducts(filtered)
    }, [selectedCategory, sortBy, priceRange, products])

    const clearAllFilters = () => {
        setSelectedCategory('all')
        setSortBy('latest')
        setPriceRange({ min: 0, max: 100000 })
    }

    const hasActiveFilters = selectedCategory !== 'all' || sortBy !== 'latest' || priceRange.min > 0 || priceRange.max < 100000

    if (loading) {
        return (
            <div className='flex flex-col items-center justify-center py-32'>
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                    <FaSpinner className='text-5xl text-blue-500' />
                </motion.div>
                <p className='text-gray-400 mt-4'>Loading amazing products...</p>
            </div>
        )
    }

    return (
        <div className='bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 py-12 md:py-16'>
            <div className='container mx-auto px-4'>
                {/* Section Header */}
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className='text-center mb-10 md:mb-12'
                >
                    <span className='inline-block px-4 py-1 rounded-full text-xs font-semibold bg-linear-to-r from-blue-500/20 to-purple-500/20 text-blue-400 border border-blue-500/30 mb-4'>
                        FEATURED COLLECTION
                    </span>
                    <h2 className='text-3xl md:text-5xl font-bold bg-linear-to-r from-white via-blue-400 to-purple-400 bg-clip-text text-transparent'>
                        Best Selling Products
                    </h2>
                    <p className='text-gray-400 text-base md:text-lg mt-4 max-w-2xl mx-auto'>
                        Discover our handpicked collection of premium products
                    </p>
                </motion.div>

                {/* Filters Bar */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className='flex flex-col gap-4 mb-6'
                >
                    {/* Category Filters - Scrollable */}
                    <div className='relative'>
                        <div className='flex flex-wrap gap-2 justify-center'>
                            {visibleCategories.map((cat) => (
                                <motion.button
                                    key={cat.value}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setSelectedCategory(cat.value)}
                                    className={`cursor-pointer px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                                        selectedCategory === cat.value
                                            ? 'bg-linear-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30'
                                            : 'bg-gray-800/80 text-gray-300 hover:bg-gray-700 border border-gray-700'
                                    }`}
                                >
                                    <span>{cat.icon}</span>
                                    <span className='hidden sm:inline'>{cat.label}</span>
                                    <span className='sm:hidden'>{cat.label.split(' ')[0]}</span>
                                </motion.button>
                            ))}
                            {categories.length > 6 && (
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setShowAllCategories(!showAllCategories)}
                                    className='px-4 py-2 rounded-full text-sm font-medium bg-gray-800/80 text-gray-300 border border-gray-700 hover:bg-gray-700 transition-all duration-300'
                                >
                                    {showAllCategories ? 'Show Less' : `+${categories.length - 6} More`}
                                </motion.button>
                            )}
                        </div>
                    </div>

                    {/* Sort and Controls */}
                    <div className='flex flex-wrap items-center justify-between gap-3'>
                        {/* Active Filters */}
                        <div className='flex flex-wrap gap-2'>
                            {hasActiveFilters && (
                                <button
                                    onClick={clearAllFilters}
                                    className='flex items-center gap-1 px-3 py-1.5 bg-red-500/20 text-red-400 rounded-full text-xs border border-red-500/30 hover:bg-red-500/30 transition-all duration-300'
                                >
                                    <MdClear />
                                    Clear All
                                </button>
                            )}
                            {selectedCategory !== 'all' && (
                                <span className='px-3 py-1.5 bg-blue-500/20 text-blue-400 rounded-full text-xs border border-blue-500/30 flex items-center gap-1'>
                                    {categories.find(c => c.value === selectedCategory)?.icon}
                                    {categories.find(c => c.value === selectedCategory)?.label}
                                </span>
                            )}
                            {(priceRange.min > 0 || priceRange.max < 100000) && (
                                <span className='px-3 py-1.5 bg-green-500/20 text-green-400 rounded-full text-xs border border-green-500/30'>
                                    ${priceRange.min} - ${priceRange.max}
                                </span>
                            )}
                        </div>

                        <div className='flex gap-2 flex-wrap'>
                            {/* Sort Dropdown */}
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className='px-4 py-2 bg-gray-800/80 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500 transition-all cursor-pointer hover:bg-gray-700'
                            >
                                {sortOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>

                            {/* View Toggle */}
                            <div className='hidden md:flex gap-1 bg-gray-800/80 rounded-xl border border-gray-700 p-1'>
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`cursor-pointer p-2 rounded-lg transition-all duration-300 ${
                                        viewMode === 'grid' 
                                            ? 'bg-linear-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                                            : 'text-gray-400 hover:text-white hover:bg-gray-700'
                                    }`}
                                >
                                    <MdGridOn className='text-xl' />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`cursor-pointer p-2 rounded-lg transition-all duration-300 ${
                                        viewMode === 'list' 
                                            ? 'bg-linear-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                                            : 'text-gray-400 hover:text-white hover:bg-gray-700'
                                    }`}
                                >
                                    <MdViewList className='text-xl' />
                                </button>
                            </div>

                            {/* Mobile Filter Toggle */}
                            <button
                                onClick={() => setFilterOpen(!filterOpen)}
                                className='md:hidden p-2 bg-gray-800/80 rounded-xl border border-gray-700 text-white hover:bg-gray-700 transition-all duration-300'
                            >
                                <MdFilterList className='text-xl' />
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Mobile Filters Panel */}
                <AnimatePresence>
                    {filterOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className='md:hidden overflow-hidden mb-6'
                        >
                            <div className='bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-700 p-4'>
                                <div className='space-y-4'>
                                    {/* Price Range */}
                                    <div>
                                        <label className='block text-gray-400 text-sm font-medium mb-2'>
                                            Price Range
                                        </label>
                                        <div className='flex gap-2'>
                                            <input
                                                type="number"
                                                placeholder="Min"
                                                value={priceRange.min || ''}
                                                onChange={(e) => setPriceRange({...priceRange, min: Number(e.target.value) || 0})}
                                                className="w-1/2 px-3 py-2 bg-gray-900/80 rounded-xl border border-gray-700 text-white focus:border-blue-500/50 focus:outline-none transition-all duration-300 placeholder:text-gray-600 text-sm"
                                            />
                                            <input
                                                type="number"
                                                placeholder="Max"
                                                value={priceRange.max || ''}
                                                onChange={(e) => setPriceRange({...priceRange, max: Number(e.target.value) || 100000})}
                                                className="w-1/2 px-3 py-2 bg-gray-900/80 rounded-xl border border-gray-700 text-white focus:border-blue-500/50 focus:outline-none transition-all duration-300 placeholder:text-gray-600 text-sm"
                                            />
                                        </div>
                                    </div>

                                    {/* Category Quick Select */}
                                    <div>
                                        <label className='block text-gray-400 text-sm font-medium mb-2'>
                                            Category
                                        </label>
                                        <div className='flex flex-wrap gap-2'>
                                            {categories.map((cat) => (
                                                <button
                                                    key={cat.value}
                                                    onClick={() => {
                                                        setSelectedCategory(cat.value)
                                                        setFilterOpen(false)
                                                    }}
                                                    className={`px-3 py-1.5 rounded-full text-xs transition-all duration-300 ${
                                                        selectedCategory === cat.value
                                                            ? 'bg-linear-to-r from-blue-600 to-purple-600 text-white'
                                                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                                    }`}
                                                >
                                                    {cat.icon} {cat.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Close Button */}
                                    <button
                                        onClick={() => setFilterOpen(false)}
                                        className='w-full py-2 bg-gray-700 rounded-xl text-white text-sm font-medium hover:bg-gray-600 transition-all duration-300'
                                    >
                                        Apply Filters
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Products Grid/List View */}
                {filteredProducts.length === 0 ? (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className='text-center py-20 bg-gray-800/30 rounded-3xl border border-gray-700'
                    >
                        <div className='text-6xl mb-4'>🛒</div>
                        <h3 className='text-xl font-semibold text-white mb-2'>No Products Found</h3>
                        <p className='text-gray-400'>Try adjusting your filters or check back later</p>
                        <button
                            onClick={clearAllFilters}
                            className='mt-4 px-6 py-2 bg-linear-to-r from-blue-600 to-purple-600 rounded-full text-white font-medium hover:shadow-lg transition-all duration-300'
                        >
                            Clear Filters
                        </button>
                    </motion.div>
                ) : (
                    <div className={`${
                        viewMode === 'grid' 
                            ? 'grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-5' 
                            : 'space-y-4'
                    }`}>
                        {filteredProducts.map((pro, index) => (
                            <motion.div
                                key={pro?._id || index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: Math.min(index * 0.03, 0.5), duration: 0.4 }}
                            >
                                <ProductCard pro={pro} viewMode={viewMode} />
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Load More Button */}
                {filteredProducts.length >= 20 && filteredProducts.length < (products || []).length && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className='text-center mt-12'
                    >
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className='px-8 py-3 bg-linear-to-r from-blue-600 to-purple-600 rounded-full font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 mx-auto'
                        >
                            Load More Products
                            <FaChevronRight className='text-sm' />
                        </motion.button>
                    </motion.div>
                )}

                {/* Stats Bar */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className='mt-12 pt-8 border-t border-gray-700 flex flex-wrap justify-between items-center text-sm text-gray-400 gap-3'
                >
                    <span>Showing <span className='text-white font-semibold'>{filteredProducts.length}</span> of <span className='text-white font-semibold'>{(products || []).length}</span> products</span>
                    <span className='flex items-center gap-1'>
                        <span className='text-green-400'>●</span> 
                        {(products || []).filter(p => p?.stock > 0).length} items in stock
                    </span>
                    <span className='flex items-center gap-1'>
                        <span className='text-yellow-400'>⭐</span> 
                        Top rated products available
                    </span>
                </motion.div>
            </div>
        </div>
    )
}

export default ProductSection