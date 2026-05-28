import axios from 'axios';
import React, { useEffect, useState } from 'react'

export const userDataContext = React.createContext();

export const UserContext = ({children}) => {
  const serverUrl = 'http://127.0.0.1:8000/api/v1';
  const [userdata, setUserData] = useState(null)
  const [vendors, setVendors] = useState(null)
  const [products, setProducts] = useState(null)
  const [cart, setCart] = useState(null)

   const getCurrentUser = async () =>{
      try {
        const result = await axios.get(`${serverUrl}/users/current-user`,{ withCredentials: true });
        setUserData(result.data);
  
      } catch (error) {
        console.error(error);
        setUserData(null)
      }
    }


  useEffect(()=>{
    getCurrentUser();
  }, [])

  const Data = {
    serverUrl,
    userdata,
    setUserData,
    vendors,
    setVendors,
    products,
    setProducts,
    cart,
    setCart
  }
  return (
    <div>
      <userDataContext.Provider value={Data}>
        {children}
      </userDataContext.Provider>
    </div>
  )
}




function getInitials(name){
  if(!name) return "?";
  const parts = name.trim().split(/\s+/)
  if(parts.length === 1) return parts[0].slice(0,2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

function getColorFromName(name){
  const colors = [
    "#f44336", "#e91e63", "#3f51b5", "#2196f3", "#009688", "#4caf50", "#ff9800", "#795548"
  ];
  if(!name) return "#gray"
  const hash = name.split("").reduce((acc, c)=> acc + c.charCodeAt(0), 0)
  return colors[hash % colors.length];
}

export function Avatar({ name, src, size= 48, style={}}){
  const [imgError, setImgError] = useState(false)
  const showImage = src && !imgError;
  const initials = getInitials(name);
  const bgColor = getColorFromName(name);

  return showImage? (
    <img
        src={src}
        alt={name}
        onError={()=>setImgError(true)}
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          objectFit: "cover",
          ...style
        }}
        />
  ):(
    <div 
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          backgroundColor: bgColor,
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyItems: "center",
          fontWeight: 600,
          fontSize: size * 0.4,
          userSelect: 'none',
          paddingLeft: `${size/3.5}px`,
          ...style
        }}
        >
          {initials}
        </div>
  )
}


import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

export function StarRating({ count = 4.6 }) {
  const rating = Math.round(count * 2) / 2;
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) stars.push(<FaStar key={i} color="#FFB400" />);
    else if (rating >= i - 0.5) stars.push(<FaStarHalfAlt key={i} color="#FFB400" />);
    else stars.push(<FaRegStar key={i} color="#DDD" />);
  }
  
  return (
    <div className='flex justify-start mx-6 gap-1 items-center'>
        {stars.map((star, i) => (
          <p key={i}>{star}</p>
          ))}
      <span style={{color: '#007185'}}>{count.toLocaleString()}</span>
    </div>
  );
}