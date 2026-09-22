import { useEffect, useState, useCallback } from "react"
import { Link } from "react-router-dom"

import '../styles/home.css'

function Home({ logged }) {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('all')

    const fetchPosts = useCallback(async () => {
        try {
            if (logged) {
                console.log('fetching token')
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
    }, [logged]) 
    
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchPosts()
    }, [logged, fetchPosts])

    async function handlePub (status, postId) {
        try {
            if (!logged) return 
            const token = localStorage.getItem("token")
            const endpoint = status ? 'publish' : 'unpublish'
            await fetch(`http://localhost:3000/author/posts/${postId}/${endpoint}`, 
            { 
                method: "PATCH",
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}` 
                }
            })
            fetchPosts()
        } catch (error) {
            console.log(error)
        }
    }

    async function handleDelPost (postId) {
        try {
            if (!logged) return 
            const token = localStorage.getItem("token")
            const res = await fetch(`http://localhost:3000/author/posts/${postId}/delete`, 
            { 
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}` 
                }
            })

            if (!res.ok) {
                console.log('delete failed')
                return 
            }
            fetchPosts()
        } catch (error) {
            console.log(error)
        }
    }

    if (loading) return <div className="status-msg"><p>Fetching posts..</p></div>

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
                            <p>{ post.isPub ? '[Published]' : '[Unpublished]' }</p>
                        </Link>
                        <div className="post-but">
                            <button onClick={() => handlePub(!post.isPub, post.id)}>
                                { !post.isPub 
                                    ? 'Publish' 
                                    : 'Unpublish' 
                                }
                            </button>
                            {/* <button>Edit</button> */}
                            <button onClick={() => handleDelPost(post.id)}>Delete</button>
                        </div>
                    </div>
                ))}
            </div> 
        }      
    </div>
  )
}

export default Home
