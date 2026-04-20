import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SignUp from './SignUp.jsx'
import { useState } from 'react'
import Inicio from './Inicio.jsx'
import LogIn from './LogIn.jsx'
import Configuracion from './Configuracion.jsx'

import Index from './index.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/" element={<Index />} />
        <Route path="/inicio" element={<Inicio />} />
        <Route path="/log-in" element={<LogIn />} />
        <Route path="/configuracion" element={<Configuracion />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App