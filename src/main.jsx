import React from 'react';
import ReactDOM from 'react-dom/client';
import AppRouter from './Router';
import './index.css';
import 'react-quill/dist/quill.snow.css'; // ✅ Importação do CSS do editor

// 🔧 Força cor de fundo ANTES da renderização (elimina flash azul)
document.documentElement.style.backgroundColor = '#f7f7f7';
document.body.style.backgroundColor = '#f7f7f7';
document.getElementById('root').style.backgroundColor = '#f7f7f7';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppRouter />
  </React.StrictMode>
);
