import React from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { userDataContext } from '../context/UserContext'

const Home = () => {
  const navigate = useNavigate()
  const {serverUrl, userdata, setUserData} = React.useContext(userDataContext)

  const handleClick = async () => {
    console.log("logout clicked....")
    await axios.get('http://127.0.0.1:8000/api/v1/users/signout',{withCredentials: true})
    console.log("logout clicked222....")
    setUserData(null)
    navigate("/login")
  }
  return (
    <div onClick={handleClick}>
      This is Home Page
    </div>
  )
}

export default Home
