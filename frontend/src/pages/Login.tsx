import React, { useState } from 'react'
import api from '../api'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from '../store/hooks'
import { setToken } from '../store'

export default function Login() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const dispatch = useAppDispatch()

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await api.post('/api/auth/login', { email, password: senha })
      const token = res.data.token
      localStorage.setItem('token', token)
      dispatch(setToken(token))
      const user = res.data.user
      if (user && user.role === 'admin') navigate('/usuarios')
      else navigate('/produtos')
    } catch (err:any) {
      const msg = err?.response?.data?.message || err?.message || 'Erro ao fazer login'
      setError(String(msg))
    } finally {
      setLoading(false)
    }
  }

  const loginAsAdmin = async () => {
    const ADMIN_EMAIL = 'admin@example.com'
    const ADMIN_PASSWORD = 'SenhaForte123'
    setError(null)
    setLoading(true)
    try {
      const res = await api.post('/api/auth/login', { email: ADMIN_EMAIL, password: ADMIN_PASSWORD })
      const token = res.data.token
      localStorage.setItem('token', token)
      dispatch(setToken(token))
      const user = res.data.user
      if (user && user.role === 'admin') navigate('/usuarios')
      else navigate('/produtos')
    } catch (err:any) {
      const msg = err?.response?.data?.message || err?.message || 'Erro ao fazer login como admin'
      setError(String(msg))
    } finally {
      setLoading(false)
    }
  }


  return (
    <div className="login page-center">
      <div className="login-card">
        <div className="login-brand">
          <div className="logo">MS</div>
          <h1>Entrar</h1>
          <p className="sub">Entre com sua conta</p>
        </div>
        <form className="login-form" onSubmit={submit}>
          {error && <div className="form-error">{error}</div>}
          <label>Endereço de email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="seu@exemplo.com" required />
          <label>Senha</label>
          <input type="password" value={senha} onChange={e => setSenha(e.target.value)} placeholder="Senha" required />
          <button className="primary" type="submit" disabled={loading}>{loading ? 'Entrando...' : 'Entrar'}</button>
        </form>
        <div className="login-footer">
          Não tem conta? <a href="/registro">Crie sua conta</a>
          <div style={{ marginTop: 8 }}>
            <span className="link-small">Entrar como admin — informe email e senha no formulário acima</span>
          </div>
        </div>
      </div>
    </div>
  )
}
