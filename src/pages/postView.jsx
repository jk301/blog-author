import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import dayjs from "dayjs";


import '../styles/postView.css'

function Postview () {
    const { postId } = useParams()
    const [post, setPost] = useState(null)
    const [comment, setComment] = useState('')
    const [comError, setComError] = useState('')
    const [editId, setEditId] = useState(null)
    const [editText, setEditText] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(true)

    // for user id
    const token = localStorage.getItem("token")
    let userId = null
    if (token) {
        userId = JSON.parse(atob(token.split('.')[1])).id
    }

    useEffect(() => {
        getPost()
    }, [postId])

    async function getPost () {
        try {
            const token = localStorage.getItem('token')
            const res = await fetch(`http://localhost:3000/author/posts/${postId}`, {
                headers: { Authorization: `Bearer ${token}` }
            })

            if (res.ok) {
                const data = await res.json()
                setPost(data.Post)
            } else if (res.status === 401) {
                setError("Want to see the post? sign up & log in.")
            } else {
                const data = await res.json()
                setError(data.error || "Could not load post :(")
            }

        } catch (error) {
            console.log(error)
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }


    async function handlePostComment(e) {
        e.preventDefault()

        try {
            const token = localStorage.getItem('token')
            const res = await fetch(`http://localhost:3000/main/posts/${postId}/comments`, {
                method: 'POST', 
                headers: { 
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}` 
                }, 
                body: JSON.stringify({ text: comment })
            })

            const data = await res.json()

            if (!res.ok) {
                setComError(data.error || "Could not post comment :(")
                return 
            }

            setComment('')

            getPost()

        } catch (error) {
            console.log(error)
            setError(error.message)
        }
    }

    async function handleComEdit(e, commentId) {
        e.preventDefault()

        try {
            const token = localStorage.getItem('token')
            const res = await fetch(
                `http://localhost:3000/main/posts/${postId}/comments/${commentId}/edit`, 
                {
                    method: 'PUT', 
                    headers: { 
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}` 
                    }, 
                    body: JSON.stringify({ text: editText })
                }
            )

            const data = await res.json()

            if (!res.ok) {
                setComError(data.error || "Could not edit comment :(")
                return 
            }

            setEditId(null)
            setEditText('')
            getPost()

        } catch (error) {
            console.log(error)
            setError(error.message)
        }
    }

    async function handleComDel (commentId) {
        try {
            const token = localStorage.getItem('token')
            const res = await fetch(
                `http://localhost:3000/main/posts/${postId}/comments/${commentId}/delete`, 
                {
                method: 'DELETE', 
                headers: { 
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}` 
                }}
            )

            const data = await res.json()

            if (!res.ok) {
                setComError(data.error || "Could not delete comment :(")
                return 
            }

            getPost()
        } catch (error) {
            console.log(error)
            setComError('Network error.')
        }
    }

    if (loading) return <div className="status-msg"><p>Loading post.</p></div>
    if (error) return <div className="status-msg"><p>{error}</p></div>
    if (!post) return <div className="status-msg"><p>Post not available.</p></div>

    return (
        <div className="post-view">
            <h2>{post.title}</h2>
            <p>{post.content}</p>
            <div className="comment-input">
                {comError && <p>{comError}</p>}
                <form onSubmit={handlePostComment}>
                    <textarea 
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Leave a comment!"
                        rows={4}
                    />
                    <button type="submit">Submit</button>
                </form>
            </div>
            <div className="post-comment">
                {post.comments.map(com => (
                    <div key={com.id} className="comment">
                        {com.id === editId 
                            ? <form onSubmit={(e) => {handleComEdit(e, editId)}}>
                                <textarea 
                                    value={editText} 
                                    onChange={(e) => {setEditText(e.target.value)}}
                                    required
                                /> 
                                <button type="submit">Submit changes</button>
                                <button 
                                    type="button" 
                                    onClick={() => {
                                        setEditId(null) 
                                        setEditText('')
                                    }}
                                >
                                    Cancel
                                </button>
                                </form>
                            : <div>
                                <p className="comment-author">@{com.name}</p>  
                                <p>{dayjs(com.createdAt).format('MMM D, YYYY h:mm A')}</p>
                                <h3>{com.content}</h3>
                                {com.userId === userId 
                                    && <button onClick={() => {
                                        setEditId(com.id)
                                        setEditText(com.content)
                                    }}>Edit comment</button> 
                                }
                                {com.userId === userId 
                                    && <button onClick={() => handleComDel(com.id)}>Delete comment</button> 
                                }
                            </div>
                        }
                        
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Postview