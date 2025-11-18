import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import './styles/main.scss'

(async function mount(){
  const diag = () => document.getElementById('diagnostic')
  try{
    const rootEl = document.getElementById('root')
    if(!rootEl) throw new Error('Elemento #root não encontrado')

    
    const [{ default: App }, { default: store }] = await Promise.all([
      import('/src/App.tsx'),
      import('/src/store/index.ts'),
    ])

    createRoot(rootEl).render(
      <React.StrictMode>
        <Provider store={store}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </Provider>
      </React.StrictMode>
    )

    try{ const d = diag(); if(d) d.textContent = 'App render chamado'; }catch(e){}
  }catch(err:any){
    try{ const d = diag(); if(d) d.textContent = 'Erro no render: '+(err && err.message ? err.message : String(err)); }catch(e){}
    console.error('Erro ao montar app', err)
  }
})()
