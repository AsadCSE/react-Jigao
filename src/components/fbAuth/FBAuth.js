import React, { useContext } from 'react';
import FacebookAuth from 'react-facebook-auth';
import userContext from '../contexts/user-context'
 
const MyFacebookButton = ({ onClick }) => (
  <button className='fbAuthButton' onClick={onClick}>
    Login with facebook
  </button>
);

const FbAuth = () => {
    const {user, dispatch} = useContext(userContext)

    const authenticate = (response) => {
        const userData ={
            fbId: response.id,
            name: response.name,
            email: response.email,
            avatar: response.picture.data.url,
            token: response.accessToken
        }

        fetch('/api/auth', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        }).then((response) => response.json()).then((data) => {
            dispatch({
                type: 'POPULATE_USER',
                user: data
            })
        })
    }

    return (
        <div className='loginPage'>
            <img src='/logo/askbook.png' alt='logo' height='150px' width='150px' />
            <FacebookAuth
            appId="3315552048670569"
            scope="email,public_profile,user_friends"
            callback={authenticate}
            component={MyFacebookButton}
            />
        </div>
    )
}

export default FbAuth;