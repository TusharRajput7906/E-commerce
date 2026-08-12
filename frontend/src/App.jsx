import React from 'react'
import Navbar from './components/Navbar'
import { Routes, Route } from 'react-router-dom'

const App = () => {
  return (
    <div>
      <Navbar/>
      <Routes>
          <Route path="/" element={<h1 className="text-center mt-10">Home Page</h1>}/>
      </Routes>
    </div>
  )
}

export default App
