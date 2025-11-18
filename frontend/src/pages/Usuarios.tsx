import React, { useEffect, useState } from 'react'
import api from '../api'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from '../store/hooks'
import { clearToken } from '../store'

type UserRow = { id: string; name: string; email: string; role: string }
type ProductRow = { _id: string; name: string; price?: number; quantity?: number; owner?: string }

export default function Usuarios(){
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [users, setUsers] = useState<UserRow[]>([])
  const [productsByOwner, setProductsByOwner] = useState<Record<string, ProductRow[]>>({})
  const [error, setError] = useState<string | null>(null)

  const handleLogout = () => {
    localStorage.removeItem('token')
    dispatch(clearToken())
    navigate('/')
  }

  useEffect(()=>{
    const load = async ()=>{
      try{
        // Buscar usuários (contém dados básicos)
        const [uRes, pRes] = await Promise.all([
          api.get('/api/auth/users'),
          // Endpoint de products retorna todos os produtos quando o requester é admin
          api.get('/api/products')
        ])

        const usersData: UserRow[] = uRes.data
        const products: ProductRow[] = pRes.data || []

        // Agrupar produtos por owner (evita somar quantidades entre usuários)
        const map: Record<string, ProductRow[]> = {}
        products.forEach((p: any) => {
          const ownerId = p.owner ? p.owner.toString() : 'unknown'
          if (!map[ownerId]) map[ownerId] = []
          map[ownerId].push(p)
        })

        setUsers(usersData)
        setProductsByOwner(map)
      }catch(e:any){
        if (e?.response?.status === 401) return navigate('/login')
        if (e?.response?.status === 403) return setError('Acesso negado: contate o administrador')
        setError('Erro ao carregar dados')
      }
    }
    load()
  },[navigate])

  return (
    <div className="container usuarios">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Usuários</h2>
        <div>
          <button className="logout" onClick={handleLogout}>Sair</button>
        </div>
      </div>
      {error && <div className="error">{error}</div>}
      {users.map(u => {
        const prods = productsByOwner[u.id] || []
        const sectionId = `user-section-${u.id}`
        const handleAccess = () => {
          // Navegar para a página de produtos filtrando pelo owner deste usuário
          navigate(`/produtos?owner=${u.id}`)
        }
        const handleDelete = async () => {
          if (!confirm(`Confirma exclusão da conta de ${u.name} (${u.email})? Essa ação removerá os produtos deste usuário.`)) return
          try {
            await api.delete(`/api/auth/users/${u.id}`)
            // recarregar lista
            const [uRes, pRes] = await Promise.all([api.get('/api/auth/users'), api.get('/api/products')])
            setUsers(uRes.data)
            const products: ProductRow[] = pRes.data || []
            const map: Record<string, ProductRow[]> = {}
            products.forEach((p: any) => {
              const ownerId = p.owner ? p.owner.toString() : 'unknown'
              if (!map[ownerId]) map[ownerId] = []
              map[ownerId].push(p)
            })
            setProductsByOwner(map)
          } catch (err:any) {
            const msg = err?.response?.data?.message || err?.message || 'Erro ao excluir usuário'
            setError(String(msg))
          }
        }

        return (
          <div id={sectionId} key={u.id} style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <h3 style={{ margin: 0 }}>{u.name} <small style={{ marginLeft: 8, color: '#666' }}>({u.email})</small></h3>
              <div>
                {u.role !== 'admin' ? (
                  <>
                    <button onClick={handleAccess} style={{ marginRight: 8 }}>Acessar</button>
                    <button onClick={handleDelete} style={{ background: '#c33', color: '#fff' }}>Excluir conta</button>
                  </>
                ) : (
                  <span style={{ color: '#666' }}>Admin (apenas visualização)</span>
                )}
              </div>
            </div>

            <div style={{ marginBottom: 8 }}>Função: <strong>{u.role}</strong> — Produtos: <strong>{prods.length}</strong></div>

            {prods.length === 0 ? (
              <div>Nenhum produto cadastrado por este usuário.</div>
            ) : (
              <table>
                <thead>
                  <tr><th>Nome</th><th style={{ textAlign: 'right' }}>Quantidade</th><th style={{ textAlign: 'right' }}>Preço</th></tr>
                </thead>
                <tbody>
                  {prods.map(p => (
                    <tr key={p._id}>
                      <td>{p.name}</td>
                      <td style={{ textAlign: 'right' }}>{p.quantity ?? 0}</td>
                      <td style={{ textAlign: 'right' }}>{typeof p.price === 'number' ? p.price.toFixed(2) : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )
      })}
    </div>
  )
}
