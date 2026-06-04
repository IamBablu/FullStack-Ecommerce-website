import React, { useContext, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { userDataContext } from '../../context/UserContext'
import { StarRating } from '../../context/UserContext'
import ProductCard from './ProductCard'
import axios from 'axios'
import logo from '../../assets/logo.jpeg'
import { useNavigate } from 'react-router-dom'
import { MdFilterList, MdGridOn, MdViewList, MdClose } from 'react-icons/md'
import { FaSpinner } from 'react-icons/fa'

const ProductSection = () => {
    const { serverUrl, products, setProducts, userdata, setUserData } = useContext(userDataContext)
    const [loading, setLoading] = useState(true)
    const [viewMode, setViewMode] = useState('grid')
    const [filterOpen, setFilterOpen] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [sortBy, setSortBy] = useState('latest')
    const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 })
    const [filteredProducts, setFilteredProducts] = useState([])

    const categories = [
        { value: 'all', label: 'All Products' },
        { value: 'fashion-lifestyle', label: 'Fashion' },
        { value: 'electronics-gadgets', label: 'Electronics' },
        { value: 'home-living', label: 'Home & Living' },
        { value: 'beauty-personal-care', label: 'Beauty' },
        { value: 'toys-kids-baby', label: 'Toys' },
    ]

    const getUserProducts = async () => {
        try {
            setLoading(true)
            const result = await axios.get(`${serverUrl}/product/get-user-product`)
            const productData = result.data.data || [] // ✅ Fix: Ensure array
            setProducts(productData)
            setFilteredProducts(productData)
        } catch (error) {
            console.error(error)
            setProducts([]) // ✅ Fix: Set empty array on error
            setFilteredProducts([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getUserProducts();
    }, [])

    useEffect(() => {
        // ✅ Fix: Ensure products is an array before processing
        const productArray = products || []
        let filtered = [...productArray]
        
        // Filter by category
        if (selectedCategory !== 'all') {
            filtered = filtered.filter(p => p?.category === selectedCategory)
        }
        
        // Filter by price
        filtered = filtered.filter(p => (p?.price || 0) >= priceRange.min && (p?.price || 0) <= priceRange.max)
        
        // Sort products
        if (sortBy === 'latest') {
            filtered.sort((a, b) => new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0))
        } else if (sortBy === 'price-low') {
            filtered.sort((a, b) => (a?.price || 0) - (b?.price || 0))
        } else if (sortBy === 'price-high') {
            filtered.sort((a, b) => (b?.price || 0) - (a?.price || 0))
        } else if (sortBy === 'popular') {
            filtered.sort((a, b) => (b?.soldCount || 0) - (a?.soldCount || 0))
        }
        
        setFilteredProducts(filtered)
    }, [selectedCategory, sortBy, priceRange, products])

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
        <div className='bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12 md:py-16'>
            <div className='container mx-auto px-4'>
                {/* Section Header */}
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className='text-center mb-10 md:mb-12'
                >
                    <span className='inline-block px-4 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-400 border border-blue-500/30 mb-4'>
                        FEATURED COLLECTION
                    </span>
                    <h2 className='text-3xl md:text-5xl font-bold bg-gradient-to-r from-white via-blue-400 to-purple-400 bg-clip-text text-transparent'>
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
                    className='flex flex-col md:flex-row justify-between items-center gap-4 mb-8 pb-4 border-b border-gray-700'
                >
                    {/* Category Filters */}
                    <div className='flex flex-wrap gap-2 justify-center'>
                        {categories.map((cat) => (
                            <motion.button
                                key={cat.value}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setSelectedCategory(cat.value)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                                    selectedCategory === cat.value
                                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                }`}
                            >
                                {cat.label}
                            </motion.button>
                        ))}
                    </div>

                    {/* Sort and View Options */}
                    <div className='flex gap-3'>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className='px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500 transition-all cursor-pointer'
                        >
                            <option value="latest">Latest Arrivals</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                            <option value="popular">Most Popular</option>
                        </select>

                        <div className='hidden md:flex gap-2'>
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
                            >
                                <MdGridOn className='text-xl' />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
                            >
                                <MdViewList className='text-xl' />
                            </button>
                        </div>

                        <button
                            onClick={() => setFilterOpen(!filterOpen)}
                            className='md:hidden p-2 bg-gray-800 rounded-lg text-white'
                        >
                            <MdFilterList className='text-xl' />
                        </button>
                    </div>
                </motion.div>

                {/* Products Grid/List View - Removed AnimatePresence to fix warning */}
                {filteredProducts.length === 0 ? (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className='text-center py-20'
                    >
                        <div className='text-6xl mb-4'>🛒</div>
                        <h3 className='text-xl font-semibold text-white mb-2'>No Products Found</h3>
                        <p className='text-gray-400'>Try adjusting your filters or check back later</p>
                    </motion.div>
                ) : (
                    <div className={`${
                        viewMode === 'grid' 
                            ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6' 
                            : 'space-y-4'
                    }`}>
                        {filteredProducts.map((pro, index) => (
                            <motion.div
                                key={pro?._id || index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: Math.min(index * 0.05, 1), duration: 0.4 }}
                            >
                                <ProductCard pro={pro} viewMode={viewMode} />
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Load More Button */}
                {filteredProducts.length >= 20 && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className='text-center mt-12'
                    >
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className='px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300'
                        >
                            Load More Products
                        </motion.button>
                    </motion.div>
                )}

                {/* Stats Bar */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className='mt-12 pt-8 border-t border-gray-700 flex justify-between items-center text-sm text-gray-400 flex-wrap gap-2'
                >
                    <span>Showing {filteredProducts.length} of {(products || []).length} products</span>
                    <span>🔥 {(products || []).filter(p => p?.stock > 0).length} items in stock</span>
                </motion.div>
            </div>
        </div>
    )
}

export default ProductSection