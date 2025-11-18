import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api'

type Produto = { _id: string, name: string }

export default function ProductMenu(){
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [open, setOpen] = useState(false)

  useEffect(()=>{
    let mounted = true
    api.get('/api/products').then(r=>{
      if (!mounted) return
      if (Array.isArray(r.data)) setProdutos(r.data.map((p:any)=>({ _id: p._id, name: p.name })))
    }).catch(()=>{})
    return ()=>{ mounted = false }
  },[])

  return (
    <div className="product-menu" style={{ position: 'relative', display: 'inline-block' }}>
      <button onClick={()=>setOpen(s=>!s)} aria-haspopup="true">Produtos ▾</button>
      {open && (
        <div className="product-menu-list" style={{ position: 'absolute', right: 0, top: '100%', background: '#fff', border: '1px solid #ddd', boxShadow: '0 4px 8px rgba(0,0,0,0.06)', zIndex: 50, minWidth: 180 }}>
          {produtos.length === 0 ? (
            <div style={{ padding: 8 }}>Nenhum produto</div>
          ) : produtos.map(p=> (
            <div key={p._id} style={{ padding: 8, borderBottom: '1px solid #f0f0f0' }}>
              <Link to={`/produtos/${p._id}`} onClick={()=>setOpen(false)} style={{ color: '#333', textDecoration: 'none' }}>{p.name}</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
