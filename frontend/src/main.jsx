import React from 'react'
import './style.css'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { RouterProvider , createBrowserRouter , createRoutesFromElements , Route } from 'react-router-dom'
import Chat from './Chat.jsx';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<App />} />
      <Route path="/chat" element={<Chat />} />
    </>
  )
);


createRoot(document.getElementById('root')).render(
    <RouterProvider router={router}  />
)
