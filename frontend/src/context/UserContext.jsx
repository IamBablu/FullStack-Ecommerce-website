import axios from 'axios';
import React, { createContext, useContext, useEffect, useState } from 'react'

export const userDataContext = React.createContext();

export const UserContext = ({children}) => {
  const serverUrl = 'http://127.0.0.1:8000/api/v1';
  const [userdata, setUserData] = useState(null)
  const [vendors, setVendors] = useState(null)
  const [products, setProducts] = useState(null)
  const [cart, setCart] = useState([])
  const [loading, setLoading] = useState(false)

  const getCurrentUser = async () =>{
    try {
      setLoading(true)
      const result = await axios.get(`${serverUrl}/users/current-user`,{ withCredentials: true });
      setUserData(result.data);
    } catch (error) {
      console.error(error);
      setUserData(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(()=>{
    getCurrentUser();
  }, [])

  // Global handler optimized
  const editToCartGlobal = async (product, action = 'add', navigate) => {
    if (!userdata) {
      navigate('/login');
      return;
    }
    try {
      setLoading(true);
      console.log(action)
      const result = await axios.patch(
        `${serverUrl}/users/add-to-cart`, 
        { productId: product._id, action }, 
        { withCredentials: true }
      );
      
      const newCartArray = result.data?.data; 
      if(Array.isArray(newCartArray)){
        setCart(newCartArray)
      }
      
    } catch (error) {
      console.error("Global Cart Error:", error);
    } finally {
      setLoading(false); // 💡 FIXED: Safely close loading state here
    }

  };

  const Data = {
    serverUrl,
    userdata,
    setUserData,
    vendors,
    setVendors,
    products,
    setProducts,
    cart,
    setCart,
    editToCartGlobal,
    loading,
    setLoading
  }

  return (
    <div>
      <userDataContext.Provider value={Data}>
        {children}
      </userDataContext.Provider>
    </div>
  )
}

// Global Helper Functions (Kept intact)
function getInitials(name){
  if(!name) return "?";
  const parts = name.trim().split(/\s+/)
  if(parts.length === 1) return parts[0].slice(0,2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

function getColorFromName(name){
  const colors = ["#f44336", "#e91e63", "#3f51b5", "#2196f3", "#009688", "#4caf50", "#ff9800", "#795548"];
  if(!name) return "gray"
  const hash = name.split("").reduce((acc, c)=> acc + c.charCodeAt(0), 0)
  return colors[hash % colors.length];
}

export function Avatar({ name, src, size= 48, style={}}){
  const [imgError, setImgError] = useState(false)
  const showImage = src && !imgError;
  const initials = getInitials(name);
  const bgColor = getColorFromName(name);

  return showImage? (
    <img src={src} alt={name} onError={()=>setImgError(true)} style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover", ...style }} />
  ):(
    <div style={{ width: size, height: size, borderRadius: "50%", backgroundColor: bgColor, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600, fontSize: size * 0.4, userSelect: 'none', ...style }}>
      {initials}
    </div>
  )
}

import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
export function StarRating({ count = 4.6, css='' }) {
  const rating = Math.round(count * 2) / 2;
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) stars.push(<FaStar key={i} color="#FFB400" />);
    else if (rating >= i - 0.5) stars.push(<FaStarHalfAlt key={i} color="#FFB400" />);
    else stars.push(<FaRegStar key={i} color="#DDD" />);
  }
  return (
    <div className={`flex justify-start gap-1 items-center ${css}`}>
        {stars.map((star, i) => <p key={i}>{star}</p>)}
      <span style={{color: '#007185'}}>{count.toLocaleString()}</span>
    </div>
  );
}

export const ScrollContext = createContext(null)
export const useScrollToTop = () => useContext(ScrollContext);