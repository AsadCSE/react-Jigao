import React, { useReducer, useEffect } from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import UserContext from '../contexts/user-context'
import userReducer from '../reducers/userReducer'
import FbAuth from '../fbAuth/FBAuth'
import Home from '../Home'
import Header from '../Header'
import User from '../User'
import Ask from '../Ask'
import Requests from '../Requests'
import Queries from '../Queries'
import Question from '../Question'
import Private from '../Private'
import Privacy from '../Privacy'

const App = () => {
    const [user, dispatch] = useReducer(userReducer,{fbId: '', name: '', email: '', avatar: '', token: ''})

    useEffect(() => {
        try{
            const userData = JSON.parse(localStorage.getItem('askbook'))
            fetch(`https://graph.facebook.com/v2.8/me?access_token=${userData.token}`).then((response) => response.json())
                .then(data => {
                    if(data.id === userData.fbId){
                        dispatch({
                            type: 'POPULATE_USER',
                            user: userData
                        })
                    }
                })
        }catch(e){}
    },[])

    if(user.token){
        localStorage.setItem('askbook', JSON.stringify(user))
        return (
            <UserContext.Provider value={{user,dispatch}}>
                    <BrowserRouter>
                        <Header />
                        <div className='container'>
                            <Switch>
                                <Route path='/' component={Home} exact />
                                <Route path='/user/:id' component={User} />
                                <Route path='/ask/:id' component={Ask} />
                                <Route path="/requests" component={Requests} />
                                <Route path='/queries' component={Queries} />
                                <Route path='/question/:id' component={Question} />
                                <Route path='/private' component={Private} />
                            </Switch>
                        </div>
                    </BrowserRouter>
            </UserContext.Provider>
        )
    }else{
        return (
            <UserContext.Provider value={{user,dispatch}}>
                <FbAuth />
            </UserContext.Provider>
        )
    }
}


export default App