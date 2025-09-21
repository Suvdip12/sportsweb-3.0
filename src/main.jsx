import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider,createBrowserRouter } from 'react-router-dom';
import App from './App.jsx'
import Database from './Pages/Database.jsx'
import Player from './Pages/Player.jsx'
import Watch from './Pages/Watch.jsx'

const router = createBrowserRouter([
  { path: '/', element: <App /> },
  {path: '/database', element: <Database />},
  {path: '/player', element: <Player />},
  {path: '/watch', element: <Watch />}
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
