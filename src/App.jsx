import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { useState } from 'react'
import Nav from './components/nav.jsx'
import Home from './pages/home.jsx'
import Register from './pages/register.jsx'
import Login from './pages/login'
import Postview from './pages/postView.jsx'
import AddPost from './pages/addPost.jsx'

function App() {
  const [logged, setLogged] = useState(!!localStorage.getItem('token'))

  return (
    <BrowserRouter>
    <Nav logged={logged} setLogged={setLogged}/>
      <Routes>
        <Route path='/' element={<Home logged={logged} />} />
        <Route path='/register' element={<Register logged={logged} />} />
        <Route path='/login' element={<Login logged={logged} setLogged={setLogged} />} /> 
        <Route path='/posts/:postId' element={<Postview />} /> 
        <Route path='/posts/add' element={<AddPost logged={logged} />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
