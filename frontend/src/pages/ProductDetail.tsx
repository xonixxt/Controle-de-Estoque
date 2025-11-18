import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api'

type Produto = {
  _id: string
  name: string
  price?: number
  quantity: number
}

export default function ProductDetail(){
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [produto, setProduto] = useState<Produto | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(()=>{
    if (!id) return
    let mounted = true
    api.get(`/api/products/${id}`).then(r=>{
      if (!mounted) return
      setProduto(r.data)
    }).catch(e=>{
      setError('Produto não encontrado')
    })
    return ()=>{ mounted = false }
  },[id])

  if (error) return (
    <div className="produto-detalhe container">
      <button onClick={()=>navigate(-1)}>Voltar</button>
      <h2>Erro</h2>
      <p>{error}</p>
    </div>
  )

  if (!produto) return (
    <div className="produto-detalhe container">Carregando...</div>
  )

  return (
    <div className="produto-detalhe container">
      <button onClick={()=>navigate(-1)}>Voltar</button>
      <h2>{produto.name}</h2>
      
      <p><strong>Quantidade:</strong> {produto.quantity}</p>
      <p><strong>Preço:</strong> R$ {produto.price?.toFixed(2) ?? '0.00'}</p>
    </div>
  )
}
