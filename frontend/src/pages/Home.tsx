import React from 'react'
import { Link } from 'react-router-dom'

export default function Home(){
  return (
    <div className="home">
      <div className="container hero-intro">
        <div className="hero-grid">
          <div className="hero-col hero-text">
            <h1>Controle de Estoque profissional</h1>
            <p className="lead">Organize seu inventário, registre entradas e saídas, e acompanhe o histórico de movimentações com segurança. Rápido, leve e focado na produtividade da sua operação.</p>
            <ul className="features">
              <li>Cadastro rápido de produtos</li>
              <li>Movimentações de entrada e saída</li>
              <li>Autenticação via JWT</li>
              <li>Interface responsiva e simples</li>
            </ul>
            <div className="hero-actions">
              <Link to="/login" className="primary large">Entrar</Link>
              <Link to="/registro" className="outline large">Registrar</Link>
            </div>
          </div>
          <div className="hero-col hero-illustration" aria-hidden>
            
            <svg width="320" height="220" viewBox="0 0 320 220" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="8" y="20" width="140" height="120" rx="8" fill="#E6F0FF" />
              <rect x="172" y="50" width="140" height="120" rx="8" fill="#FFF4E6" />
              <rect x="28" y="40" width="100" height="20" rx="4" fill="#0078D4" />
              <rect x="28" y="70" width="80" height="12" rx="4" fill="#8FB9FF" />
              <rect x="190" y="70" width="100" height="12" rx="4" fill="#FFB86B" />
              <circle cx="80" cy="150" r="18" fill="#0EA5A4" />
              <circle cx="240" cy="160" r="14" fill="#F97316" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}
