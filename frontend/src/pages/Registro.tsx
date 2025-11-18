import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'
import { useAppDispatch } from '../store/hooks'
import { setToken } from '../store'

export default function Registro(){
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const submit = async (e?: React.FormEvent) =>{
    if (e) e.preventDefault()
    setErro(null)
    if (!nome || !email || !senha) return setErro('Preencha todos os campos')
    if (senha.length < 6) return setErro('Senha deve ter pelo menos 6 caracteres')
    if (senha !== confirm) return setErro('As senhas não conferem')
    setLoading(true)
    try{
      await api.post('/api/auth/register', { name: nome, email, password: senha })
      
      alert('Cadastro realizado com sucesso. Faça login para continuar.')
      navigate('/login')
    }catch(err:any){
      const msg = err?.response?.data?.message || err?.response?.data || err?.message || 'Erro ao registrar'
      setErro(String(msg))
    }finally{ setLoading(false) }
  }

  return (
    <div className="login page-center">
      <div className="login-card">
        <div className="login-brand">
          <div className="logo">CS</div>
          <h1>Registrar</h1>
          <p className="sub">Crie sua conta para gerenciar o estoque</p>
        </div>
        <form className="login-form" onSubmit={submit}>
          {erro && <div className="form-error">{erro}</div>}
          <label>Nome completo</label>
          <input value={nome} onChange={e=>setNome(e.target.value)} placeholder="Seu nome" required />
          <label>Email</label>
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="seu@exemplo.com" required />
          <label>Senha</label>
          <input type="password" value={senha} onChange={e=>setSenha(e.target.value)} placeholder="Senha (min 6 chars)" required />
          <label>Confirmar senha</label>
          <input type="password" value={confirm} onChange={e=>setConfirm(e.target.value)} placeholder="Repita a senha" required />
          <button className="primary" type="submit" disabled={loading}>{loading ? 'Registrando...' : 'Registrar'}</button>
        </form>
        <div className="login-footer">Já tem conta? <a href="/login">Entrar</a></div>
      </div>
    </div>
  )
}
