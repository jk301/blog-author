import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

import '../styles/home.css'

function Home({ logged }) {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('all')

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
        return <div className="status-msg"><p>No posts yet.</p></div>
    }

    const filPosts = posts.filter( post => {
        if (filter === 'unpub') return !post.isPub 
        if (filter === 'pub') return post.isPub
        return true
    })

  return (
    <div className="post-container">
        {!logged && <h1>Sign up & login to create/see/edit your posts! </h1>}
        {logged 
            && <div>
                <div className="post-select">
                    <h3 
                        onClick={() => setFilter('all')} 
                        className={filter === 'all' ? 'active-tab' : ''}
                    >All posts</h3>
                    <h3 
                        onClick={() => setFilter('unpub')} 
                        className={filter === 'unpub' ? 'active-tab' : ''}
                    >Unpublished</h3>

                    <h3 
                        onClick={() => setFilter('pub')} 
                        className={filter === 'pub' ? 'active-tab' : ''}
                    >Published</h3>
                </div>
                { filPosts.map( post => (
                    <div key={post.id} className="post-div" >
                        <Link to={`/posts/${post.id}`}>
                            <h2>{ post.title }</h2>
                        </Link>
                    </div>
                ))}
            </div> 
        }      
    </div>
  )
}

export default Home
