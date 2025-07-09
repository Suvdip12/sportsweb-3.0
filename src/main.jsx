import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider,createBrowserRouter } from 'react-router-dom';
import App from './App.jsx'
import Database from './Pages/Database.jsx'

const router = createBrowserRouter([
  { path: '/', element: <App /> },
  {path: '/database', element: <Database />},
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
