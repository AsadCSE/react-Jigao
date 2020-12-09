import React, { useContext } from 'react'
import userContext from '../contexts/user-context'
import { Link } from 'react-router-dom'

const Profile = () => {
    const {user} = useContext(userContext)

    return (
        <div className="Profile-Desc">
            <div className="ProfHolder">
                <img className="Pro-Desc-Img" alt="User-Image" src={user.avatar} height="50px" width="50px" />
                <p>{user.name}</p>
            </div>
            <div className="buttonHolder">
                <Link to={`/ask/${user.fbId}`} className="ButtonImage"><img className="iconImageButton" src="/icons/share.png"/></Link>
            </div>
        </div>
    )
}

export default Profile