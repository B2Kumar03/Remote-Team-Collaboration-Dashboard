import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from '../components/pages/Home'
import SignUp from "../components/form/SignUp"
import Login from '../components/form/Login'

const AllRoutes = () => {
  return (
    <>
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/signup' element={<SignUp/>}/>
      <Route path='/login' element={<Login/>}/>
    </Routes>
    </>
  )
}

export default AllRoutes