import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'

export default function NewProduct(){
  const navigate = useNavigate()
  const [nome, setNome] = useState('')
  
  const [preco, setPreco] = useState<number | ''>('')
  const [quantidade, setQuantidade] = useState<number | ''>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const criarProduto = async (e?: React.FormEvent) =>{
    if (e) e.preventDefault()
    setError(null)
    setSuccess(null)
    const token = localStorage.getItem('token')
    if (!token) {
      setError('Você precisa entrar para adicionar um produto.')
      navigate('/login')
      return
    }
    if (!nome) return setError('Informe o nome do produto')
    setLoading(true)
    try{
      const payload = {
        name: nome,
        price: preco === '' ? 0 : Number(preco),
        quantity: quantidade === '' ? 0 : Number(quantidade),
      }
      await api.post('/api/products', payload)
      setNome(''); setPreco(''); setQuantidade('')
      setSuccess('Produto criado com sucesso')
    }catch(err:any){
      const msg = err?.response?.data?.message || err?.message || 'Erro ao criar produto'
      setError(String(msg))
    }finally{
      setLoading(false)
    }
  }

  return (
    <div className="novo-produto page-center">
      <div className="novo-card">
        <header className="novo-card-header">
          <h2>Novo Produto</h2>
          <p className="sub">Cadastre um novo item no estoque</p>
        </header>

        <form className="novo-form" onSubmit={criarProduto}>
          {error && <div className="form-error">{error}</div>}
          {success && <div className="form-success">{success}</div>}

          <div className="row">
            <label>Nome</label>
            <input placeholder="Nome do produto" value={nome} onChange={e=>setNome(e.target.value)} />
          </div>

          

          <div className="row grid-2">
            <div>
              <label>Preço (R$)</label>
              <input placeholder="0.00" type="number" step="0.01" inputMode="decimal" value={preco as any} onChange={e=>{
                const v = e.target.value
                if (v === '') return setPreco('')
                const parsed = Number(v.toString().replace(',', '.'))
                setPreco(Number.isNaN(parsed) ? '' : parsed)
              }} />
            </div>

            <div>
              <label>Quantidade</label>
              <input placeholder="0" type="number" step="1" value={quantidade as any} onChange={e=>setQuantidade(e.target.value === '' ? '' : Number(e.target.value))} />
            </div>
          </div>

          <div className="actions">
            <button className="primary" type="submit" disabled={loading}>{loading ? 'Aguarde...' : 'Adicionar Produto'}</button>
            <button type="button" className="outline" onClick={()=>{ setNome(''); setPreco(''); setQuantidade('') }}>Limpar</button>
            <button type="button" className="outline" onClick={()=>navigate('/produtos')}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  )
}
