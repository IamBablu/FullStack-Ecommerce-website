import axios from 'axios';
import React, { useEffect, useState } from 'react'

export const userDataContext = React.createContext();

const UserContext = ({children}) => {
  const serverUrl = 'http://127.0.0.1:8000/api/v1';
  const [userdata, setUserData] = useState(null)

  const getCurrentUser = async () =>{
    try {
      const result = await axios.get(`${serverUrl}/users/current-user`,{ withCredentials: true });
      console.log(result.data.user)
      setUserData(result.data.user);

    } catch (error) {
      console.log(error);
    }
  }

  useEffect(()=>{
    getCurrentUser();
  }, [])

  const Data = {
    serverUrl,
    userdata,
    setUserData,
  }
  return (
    <div>
      <userDataContext.Provider value={Data}>
        {children}
      </userDataContext.Provider>
    </div>
  )
}

export default UserContext
