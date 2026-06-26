import React, { useState, useEffect, useContext } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { 
  FaFilter, 
  FaTimes, 
  FaChevronLeft, 
  FaChevronRight,
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaShoppingCart,
  FaHeart,
  FaRegHeart,
  FaSlidersH,
  FaThLarge,
  FaThList
} from 'react-icons/fa'
import { MdCategory, MdPriceChange, MdSort, MdClear } from 'react-icons/md'
import { userDataContext } from '../../context/UserContext'
import axios from 'axios'
import Navbar from './Navbar'

const Category = () => {
  const { setActivePage } = useContext(userDataContext)
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'

  // Filter States
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    rating: '',
    sortBy: 'popularity'
  })

  // Categories for filter
  const categories = [
    { id: 'electronics', label: 'Electronics', icon: '📱' },
    { id: 'fashion', label: 'Fashion', icon: '👗' },
    { id: 'home', label: 'Home & Living', icon: '🏠' },
    { id: 'beauty', label: 'Beauty', icon: '💄' },
    { id: 'toys', label: 'Toys & Kids', icon: '🧸' },
    { id: 'groceries', label: 'Groceries', icon: '🛒' },
    { id: 'sports', label: 'Sports', icon: '🏀' },
    { id: 'automotive', label: 'Automotive', icon: '🚗' },
    { id: 'books', label: 'Books', icon: '📚' },
    { id: 'gifts', label: 'Gifts', icon: '🎁' }
  ]

  // Sort options
  const sortOptions = [
    { value: 'popularity', label: 'Popularity' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Top Rated' },
    { value: 'newest', label: 'Newest First' }
  ]

  // Rating options
  const ratingOptions = [
    { value: '4', label: '4★ & above' },
    { value: '3', label: '3★ & above' },
    { value: '2', label: '2★ & above' },
    { value: '1', label: '1★ & above' }
  ]

  useEffect(() => {
    setActivePage('Category')
    fetchProducts()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [products, filters])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      // Replace with your actual API endpoint
      const response = await axios.get('/api/v1/product/get-user-product', {
        withCredentials: true
      })
      // Mock data for demonstration - remove this in production
      const mockProducts = Array.from({ length: 20 }, (_, i) => ({
        id: i + 1,
        name: `Product ${i + 1}`,
        category: categories[i % categories.length].id,
        price: Math.floor(Math.random() * 1000) + 50,
        rating: (Math.random() * 2 + 3).toFixed(1),
        reviews: Math.floor(Math.random() * 200),
        image: `https://picsum.photos/seed/${i + 1}/400/400`,
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        inStock: Math.random() > 0.2,
        isNew: Math.random() > 0.7,
        discount: Math.random() > 0.6 ? Math.floor(Math.random() * 30) + 10 : 0
      }))
      setProducts(mockProducts)
      setFilteredProducts(mockProducts)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching products:', error)
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let result = [...products]

    // Category filter
    if (filters.category) {
      result = result.filter(p => p.category === filters.category)
    }

    // Price range filter
    if (filters.minPrice) {
      result = result.filter(p => p.price >= Number(filters.minPrice))
    }
    if (filters.maxPrice) {
      result = result.filter(p => p.price <= Number(filters.maxPrice))
    }

    // Rating filter
    if (filters.rating) {
      result = result.filter(p => p.rating >= Number(filters.rating))
    }

    // Sorting
    switch (filters.sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        result.sort((a, b) => b.price - a.price)
        break
      case 'rating':
        result.sort((a, b) => b.rating - a.rating)
        break
      case 'newest':
        result.sort((a, b) => b.id - a.id)
        break
      default: // popularity
        result.sort((a, b) => b.reviews - a.reviews)
    }

    setFilteredProducts(result)
  }

  const clearFilters = () => {
    setFilters({
      category: '',
      minPrice: '',
      maxPrice: '',
      rating: '',
      sortBy: 'popularity'
    })
  }


  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating)
    const halfStar = rating % 1 >= 0.5
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0)
    
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(fullStars)].map((_, i) => (
          <FaStar key={`full-${i}`} className="text-yellow-400 text-sm" />
        ))}
        {halfStar && <FaStarHalfAlt className="text-yellow-400 text-sm" />}
        {[...Array(emptyStars)].map((_, i) => (
          <FaRegStar key={`empty-${i}`} className="text-yellow-400 text-sm" />
        ))}
        <span className="ml-2 text-gray-400 text-sm">{rating}</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-900 to-black">
        <Navbar />
      {/* Hero Header */}
      <div className="relative bg-linear-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 border-b border-gray-800">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-linear-to-r from-white via-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
              Explore Our Collection
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Discover amazing products curated just for you
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2.5 bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-700 hover:border-blue-500/50 transition-all duration-300 text-white"
            >
              <FaFilter className="text-blue-400" />
              <span>Filters</span>
              {Object.values(filters).some(v => v && v !== 'popularity') && (
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              )}
            </motion.button>

            {/* Active Filters */}
            <div className="flex flex-wrap gap-2">
              {filters.category && (
                <span className="px-3 py-1.5 bg-blue-500/20 text-blue-400 rounded-full text-sm border border-blue-500/30 flex items-center gap-2">
                  {categories.find(c => c.id === filters.category)?.label}
                  <button onClick={() => setFilters({...filters, category: ''})}>
                    <FaTimes className="text-xs" />
                  </button>
                </span>
              )}
              {(filters.minPrice || filters.maxPrice) && (
                <span className="px-3 py-1.5 bg-green-500/20 text-green-400 rounded-full text-sm border border-green-500/30 flex items-center gap-2">
                  ${filters.minPrice || '0'} - ${filters.maxPrice || '∞'}
                  <button onClick={() => setFilters({...filters, minPrice: '', maxPrice: ''})}>
                    <FaTimes className="text-xs" />
                  </button>
                </span>
              )}
              {filters.rating && (
                <span className="px-3 py-1.5 bg-yellow-500/20 text-yellow-400 rounded-full text-sm border border-yellow-500/30 flex items-center gap-2">
                  {filters.rating}★ & above
                  <button onClick={() => setFilters({...filters, rating: ''})}>
                    <FaTimes className="text-xs" />
                  </button>
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* View Toggle */}
            <div className="flex bg-gray-800/80 rounded-xl border border-gray-700 p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  viewMode === 'grid' 
                    ? 'bg-blue-500/20 text-blue-400' 
                    : 'text-gray-500 hover:text-white'
                }`}
              >
                <FaThLarge />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  viewMode === 'list' 
                    ? 'bg-blue-500/20 text-blue-400' 
                    : 'text-gray-500 hover:text-white'
                }`}
              >
                <FaThList />
              </button>
            </div>

            {/* Sort Dropdown */}
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
              className="px-4 py-2.5 bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-700 text-white focus:border-blue-500/50 focus:outline-none transition-all duration-300"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden mb-6"
            >
              <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-700 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Category Filter */}
                  <div>
                    <label className="block text-gray-400 text-sm font-medium mb-2">
                      <MdCategory className="inline mr-2" />
                      Category
                    </label>
                    <select
                      value={filters.category}
                      onChange={(e) => setFilters({...filters, category: e.target.value})}
                      className="w-full px-4 py-2.5 bg-gray-900/80 rounded-xl border border-gray-700 text-white focus:border-blue-500/50 focus:outline-none transition-all duration-300"
                    >
                      <option value="">All Categories</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>
                          {cat.icon} {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Price Range */}
                  <div>
                    <label className="block text-gray-400 text-sm font-medium mb-2">
                      <MdPriceChange className="inline mr-2" />
                      Price Range
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={filters.minPrice}
                        onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
                        className="w-1/2 px-4 py-2.5 bg-gray-900/80 rounded-xl border border-gray-700 text-white focus:border-blue-500/50 focus:outline-none transition-all duration-300 placeholder:text-gray-600"
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={filters.maxPrice}
                        onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                        className="w-1/2 px-4 py-2.5 bg-gray-900/80 rounded-xl border border-gray-700 text-white focus:border-blue-500/50 focus:outline-none transition-all duration-300 placeholder:text-gray-600"
                      />
                    </div>
                  </div>

                  {/* Rating Filter */}
                  <div>
                    <label className="block text-gray-400 text-sm font-medium mb-2">
                      <FaStar className="inline mr-2 text-yellow-400" />
                      Minimum Rating
                    </label>
                    <select
                      value={filters.rating}
                      onChange={(e) => setFilters({...filters, rating: e.target.value})}
                      className="w-full px-4 py-2.5 bg-gray-900/80 rounded-xl border border-gray-700 text-white focus:border-blue-500/50 focus:outline-none transition-all duration-300"
                    >
                      <option value="">Any Rating</option>
                      {ratingOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Clear Filters */}
                  <div className="flex items-end">
                    <button
                      onClick={clearFilters}
                      className="w-full px-4 py-2.5 bg-red-500/20 text-red-400 rounded-xl border border-red-500/30 hover:bg-red-500/30 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <MdClear />
                      Clear All Filters
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Count */}
        <div className="flex justify-between items-center mb-6">
          <span className="text-gray-400 text-sm">
            Showing <span className="text-white font-semibold">{filteredProducts.length}</span> products
          </span>
        </div>

        {/* Products Grid/List */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-white mb-2">No Products Found</h3>
            <p className="text-gray-400">Try adjusting your filters</p>
          </div>
        ) : (
          <motion.div
            layout
            className={`grid ${
              viewMode === 'grid' 
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
                : 'grid-cols-1 gap-4'
            }`}
          >
            <AnimatePresence>
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  className={`group bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-700 hover:border-blue-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 ${
                    viewMode === 'list' ? 'flex' : ''
                  } overflow-hidden`}
                >
                  {/* Product Image */}
                  <div className={`relative ${viewMode === 'list' ? 'w-48 flex-shrink-0' : 'w-full'}`}>
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className={`object-cover ${viewMode === 'list' ? 'h-48' : 'h-64'} w-full group-hover:scale-105 transition-transform duration-500`}
                    />
                    {product.discount > 0 && (
                      <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                        -{product.discount}%
                      </span>
                    )}
                    {product.isNew && (
                      <span className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                        NEW
                      </span>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className={`p-4 flex-1 flex flex-col ${viewMode === 'list' ? 'justify-center' : ''}`}>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-white font-semibold text-lg group-hover:text-blue-400 transition-colors duration-300">
                          {product.name}
                        </h3>
                        <p className="text-gray-400 text-sm">
                          {categories.find(c => c.id === product.category)?.label || product.category}
                        </p>
                      </div>
                      {product.inStock ? (
                        <span className="text-green-400 text-xs font-medium px-2 py-1 bg-green-500/20 rounded-full">
                          In Stock
                        </span>
                      ) : (
                        <span className="text-red-400 text-xs font-medium px-2 py-1 bg-red-500/20 rounded-full">
                          Out of Stock
                        </span>
                      )}
                    </div>

                    {viewMode === 'list' && (
                      <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                        {product.description}
                      </p>
                    )}

                    <div className="flex items-center gap-2 mb-2">
                      {renderStars(product.rating)}
                      <span className="text-gray-500 text-sm">({product.reviews})</span>
                    </div>

                    <div className="flex items-center justify-between mt-auto">
                      <div>
                        <span className="text-2xl font-bold text-white">
                          {formatPrice(product.price)}
                        </span>
                        {product.discount > 0 && (
                          <span className="ml-2 text-gray-500 text-sm line-through">
                            {formatPrice(product.price / (1 - product.discount / 100))}
                          </span>
                        )}
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2.5 bg-blue-500/20 text-blue-400 rounded-xl hover:bg-blue-500/30 transition-all duration-300"
                      >
                        <FaShoppingCart />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Load More */}
        {filteredProducts.length > 0 && filteredProducts.length < products.length && (
          <div className="text-center mt-12">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-3 bg-linear-to-r from-blue-600 to-purple-600 rounded-xl text-white font-semibold hover:shadow-xl transition-all duration-300"
            >
              Load More Products
            </motion.button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Category