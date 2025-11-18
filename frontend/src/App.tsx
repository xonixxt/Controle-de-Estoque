import React, { useEffect } from 'react'
import { Routes, Route, Link, useNavigate, useLocation, Navigate } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from './store/hooks'
import { clearToken } from './store'
import Login from './pages/Login'
import Produtos from './pages/Produtos'
import ProductDetail from './pages/ProductDetail'
import NewProduct from './pages/NewProduct'
import Home from './pages/Home'
import Registro from './pages/Registro'
import Usuarios from './pages/Usuarios'

export default function App() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const token = useAppSelector(s => s.auth.token)
  const location = useLocation()
  const onProdutosPage = location.pathname === '/produtos' || location.pathname.startsWith('/produtos/')

  useEffect(()=>{
    try{ const d = document.getElementById('diagnostic'); if (d) d.textContent = 'App montado'; }catch(e){}
  },[])

  const logout = ()=>{
    localStorage.removeItem('token')
    dispatch(clearToken())
    navigate('/login')
  }

  return (
    <div className="app">
      
      <main>
        <Routes>
          
          <Route path="/login" element={<Login />} />
          <Route path="/produtos" element={token ? <Produtos /> : <Navigate to="/login" replace />} />
          <Route path="/produtos/:id" element={token ? <ProductDetail /> : <Navigate to="/login" replace />} />
          <Route path="/cadastro" element={token ? <NewProduct /> : <Navigate to="/login" replace />} />
          <Route path="/usuarios" element={token ? <Usuarios /> : <Navigate to="/login" replace />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </main>
    </div>
  )
}
