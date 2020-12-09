import React, {useContext, useEffect, useState} from 'react'
import {Link} from 'react-router-dom'
import userContext from './contexts/user-context'

const Home = () => {
    const {user} = useContext(userContext)
    const [fbFriends, setFbFriends] = useState([])
    const [skip, setSkip] = useState(0)
    const [homePosts, setHomePosts] = useState([])
    const [modal, setModal] = useState(false)

    useEffect(() => {
        const qurl = '/api/fbfriends'
        fetch( qurl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({token: user.token })
        }).then(res => res.json())
        .then(data => {
            setFbFriends(data)
        }).catch(e => {})
    },[])
    
    useEffect(() => {
        let url = `/api/homeposts?skip=${skip}`
        fetch( url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token: user.token })
        }).then(res => res.json())
        .then(data => {
            setHomePosts(data)
        }).catch(e => {})
    },[skip])

    return (
        <div>
            <div className="fbFriendText">
                <p className="fbFriendInnerText">friends from facebook</p>
            </div>
            <div className="fbFriends">
               {
                   fbFriends.length > 0 ? fbFriends.map(fbfriend => <FBFriend key={fbfriend.fbId} friend={fbfriend}/>) : <p className="noFBFriends">Nothing to show</p>
               }
            </div>
            <div className="HomePosts">
                {
                    homePosts.length > 0 ? homePosts.map(post => <Post key={post._id} data={post}/>) : <p className="NoHomePostsText">Follow people to see their posts</p>
                }
            </div>
            <div className="paginationWrapper">
                { skip > 0 && <button className="paginationButton" onClick={() => setSkip(skip-1)}>previous</button>}
                {(homePosts !== null && homePosts.length === 10) && <button className="paginationButton" onClick={() => setSkip(skip+1)}>Next</button>}
            </div>
        </div>
    )
}

const Post = ({data}) => {
    return (
        <Link className="HomePostWrapper" to={'/question/' + data._id}>
            <div className="HomePostProfileWrapper">
                <img className="HomePostProPic" src={data.askedToAvatar}/>
                <img className="HomePostProPic" src={data.askedByAvatar ? data.askedByAvatar : '/icons/anonymous.png'}/>
            </div>
            <div className="HomePostContents">
                <div className="homePostsQuestion">
                    <p className="HomePostsContentsHeader">
                        {data.askedToName.split(' ')[0]} answered {data.askedByName? data.askedByName.split(' ')[0] : 'Anonymous' } &nbsp;
                        {new Date(data.answeredAt).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })} &nbsp;
                        {new Date(data.answeredAt).toLocaleDateString('en-GB', {day: 'numeric', month: 'short'}).replace(/, /g, '-')} 
                    </p>
                    <p>{data.question}</p>
                </div>
                                <div className="HomePostLikeComment">
                    <p className="HomePoststat">{data.likes <2 ? data.likes + ' like' : data.likes + ' likes'}</p>
                    <p className="HomePoststat">{data.comments <2 ? data.comments + ' comment' : data.comments + ' comments'}</p>
                </div>
            </div>
        </Link>
    )
}

const FBFriend = ({friend}) => {
    return (
        <Link className="FbFriendsWrapper" to={'/user/' + friend.fbId}>
            <img className="fbFriendsProfile" src={friend.avatar} />
            <p>{friend.name.split(' ')[0]}</p>
        </Link>
    )
}

export default Home