import { useState } from "react"
import { useNavigate } from "react-router-dom"

import '../styles/addPost.css'

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

                const data = await res.json()

                if (!res.ok) {
                    setError(data.error || "Something went wrong.")
                    return 
                }

                navigate('/')
            } else {
                setError("You must be logged in.")
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
                placeholder="Post title here."
                required
            />
            <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)} 
                placeholder="Post content here."
                required
            />
            <button type="submit" >Post(unpublished)</button>
        </form>
    </div>
  )
}

export default AddPost