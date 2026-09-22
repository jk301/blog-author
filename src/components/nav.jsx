import { NavLink, Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"

import '../styles/nav.css'

function Nav ({ logged, setLogged }) {
    const navigate = useNavigate()

    function handleLogout () {
        if (!logged) {
            console.log('Not logged in.')
            return 
        }
        localStorage.removeItem("token")
        console.log('Token removed.')
        setLogged(false)
        navigate('/')
    }

    function handlePost () {
        if (!logged) {
            console.log('Not logged in')
            return 
        } else if (logged) {
            navigate('/posts/add')
        }
    }

    return (
        <nav>
            <Link to='/'><h1>Bloggy-author</h1></Link>
            { logged 
                ? <div className="nav-but">
                    <div className="nav-but"><button onClick={handlePost}>Create a post</button></div>
                    <div className="nav-but"><button onClick={handleLogout} >Logout</button></div>
                    </div>
                : <div className="nav-but">
                    <NavLink to='/register'>Sign up</NavLink>
                    <NavLink to='/login'>Login</NavLink>
                </div>
            }
        </nav>
    )
}

export default Nav