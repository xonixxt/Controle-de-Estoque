import React, { useEffect, useState } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import api from '../api'
import { useAppDispatch } from '../store/hooks'
import { clearToken } from '../store'

type Produto = {
  _id: string
  name: string
  price?: number
  quantity: number
}

export default function Produtos(){
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { hash } = useLocation()
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [erro, setErro] = useState<string | null>(null)
  const [activeStock, setActiveStock] = useState<{ id: string, type: 'entrada'|'saida', qty: number | '' } | null>(null)

  const load = async ()=>{
    try{
      // permitir filtro por owner via query string (ex: /produtos?owner=<id>)
      const params = new URLSearchParams(window.location.search)
      const owner = params.get('owner')
      const url = owner ? `/api/products?owner=${owner}` : '/api/products'
      const res = await api.get(url)
      if (Array.isArray(res.data)) {
        setProdutos(res.data)
        setErro(null)
      } else {
        setProdutos([])
        setErro('Resposta inesperada do servidor')
      }
    }catch(e:any){
      setErro(e?.message || 'Erro de rede')
      setProdutos([])
    }
  }

  useEffect(()=>{ load() },[])

  useEffect(()=>{
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
    }
  },[navigate])

  useEffect(()=>{
    if (!hash) return
    const id = hash.replace('#','')
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  },[hash])

  const handleLogout = () => {
    localStorage.removeItem('token')
    dispatch(clearToken())
    navigate('/')
  }

  const submitStock = async (productId: string, type: 'entrada'|'saida') =>{
    if (!activeStock || activeStock.id !== productId) return
    const q = Number(activeStock.qty || 0)
    if (!(q>0)) return alert('Quantidade inválida')
    try{
      await api.post('/api/stock', { product: productId, type, quantity: q })
      setActiveStock(null)
      await load()
    }catch(e){ alert('Erro ao registrar movimentação') }
  }

  return (
    <div className="produtos container">
      <div className="topbar">
        <h2>Produtos</h2>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Link to="/cadastro" className="cta" style={{ textDecoration: 'none' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>Cadastrar Produtos</span>
          </Link>
          <button className="logout" onClick={handleLogout}>Sair</button>
        </div>
      </div>
      <table>
        <thead><tr><th>Nome</th><th>Preço</th><th>Qtd</th><th>Ações</th></tr></thead>
        <tbody>
          {erro && (
            <tr><td colSpan={4} className="error">{erro}</td></tr>
          )}
          {produtos.length === 0 ? (
            <tr><td colSpan={4}>Nenhum produto encontrado</td></tr>
          ) : (
            produtos.map(p => (
              <tr key={p._id} id={`prod-${p._id}`}>
                <td>
                  <div className="name">{p.name}</div>
                </td>
                <td>
                  <div className="price">{typeof p.price === 'number' ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(p.price) : '-'}</div>
                </td>
                <td>{p.quantity}</td>
                <td className="actions">
                  {activeStock && activeStock.id === p._id ? (
                    <div className="stock-inline">
                      <input type="number" min={1} value={activeStock.qty as any} onChange={e=>setActiveStock({ id: p._id, type: activeStock.type, qty: e.target.value === '' ? '' : Number(e.target.value) })} />
                      <button onClick={()=>submitStock(p._id, activeStock.type)}>Confirmar</button>
                      <button onClick={()=>setActiveStock(null)}>Cancelar</button>
                    </div>
                  ) : (
                    <>
                      <button onClick={()=>setActiveStock({ id: p._id, type: 'entrada', qty: '' })}>Entrada</button>
                      <button onClick={()=>setActiveStock({ id: p._id, type: 'saida', qty: '' })}>Saída</button>
                    </>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
