import { useState } from "react"
import { useNavigate } from "react-router-dom"

import '../styles/login.css'

function AddPost({ logged }) {
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [error, setError] = useState('')

    const navigate = useNavigate()

    async function handleAddPost (e) {
        e.preventDefault()
        setError('') 

        try {
            if (logged) {
                const token = localStorage.getItem("token")
                const res = await fetch('http://localhost:3000/author/posts', {
                    method: 'POST', 
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}` 
                    }, 
                    body: JSON.stringify({ title, content })
                })

                // if (res.status === 401) {
                //     setError('Invalid email or password.')
                //     return
                // }

                const data = await res.json()

                if (!res.ok) {
                    setError(data.error || "Something went wrong.")
                    return 
                }

                navigate('/')
            }

        } catch (err) {
            console.log(err)
            setError("Network error, try again.")
        }
    }

  return (
    <div className="add-post">
        <h1>Create post</h1>
        {error && <p>{error}</p>}
        <form onSubmit={handleAddPost}>
            <label htmlFor="title">title</label>
            <input 
                type="text" 
                id="title"
                value={title}
                onChange={(e) => {setTitle(e.target.value)}} 
                required
            />
            <textarea
                id="content" 
                value={content} 
                onChange={(e) => {setContent(e.target.value)}} 
                required
            />
            <button type="submit" >Post(unpublished)</button>
        </form>
    </div>
  )
}

export default AddPost
