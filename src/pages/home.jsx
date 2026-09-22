import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

import '../styles/home.css'

function Home({ logged }) {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchPosts() {
            try {
                if (logged) {
                    console.log('fetching ')
                    const token = localStorage.getItem("token")
                    const res = await fetch('http://localhost:3000/author/posts', {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}` 
                        }
                    })
                    const data = await res.json()
                    setPosts(data.posts || [])
                }
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        }

        fetchPosts()
    }, [logged])

    if (loading) return <div className="status-msg"><p>Fetching posts..</p></div>
    if (!loading && posts.length === 0) {
         return <div className="status-msg"><p>No posts available</p></div>
    }

  return (
    <div className="post-container">
        {!logged && <h1>Sign up & login to see/edit your posts! </h1>}
        { posts.map( post => (
            <div key={post.id} className="post-div" >
                <Link to={`/posts/${post.id}`}>
                    <h2>{ post.title }</h2>
                </Link>
            </div>
        ))}
    </div>
  )
}

export default Home
