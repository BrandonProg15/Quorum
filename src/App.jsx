import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SignUp from './SignUp.jsx'
import Inicio from './Inicio.jsx'
import LogIn from './LogIn.jsx'
import Configuracion from './Configuracion.jsx'
import InicioGrupo from './InicioGrupo.jsx'
import ProponerJuntada from './ProponerJuntada.jsx'
import DetallePerfil from './detallePerfil.jsx'

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
        <Route path="/grupo/:id" element={<InicioGrupo />} />
        <Route path="/proponer-juntada/:id" element={<ProponerJuntada />} />
        <Route path="/configuracion/:id" element={<DetallePerfil />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App