import React, { useContext, useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import userContext from './contexts/user-context'
import Question from './subComponents/qusetions'

const User = () => {
    const {user} = useContext(userContext)
    let { id } = useParams()
    const [profile, setProfile] = useState({})
    const [quest, setQuest] = useState(null)
    const [skip, setSkip] = useState(0)
    const [loadSts, setLoadSts] = useState('loading...')
    const [follow, setFollow] = useState(0)

    useEffect(() => {
        const url = '/api/user/' + id
        fetch( url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token: user.token })
        }).then(res => res.json())
        .then(data => {
            setProfile(data)
            data.following.includes(user.fbId) ? setFollow(true) : setFollow(false)
        }).catch(e => setLoadSts('No user Found!'))
    }, [id,follow])

    useEffect(() => {
        Qfetch()
    },[profile,skip])



    const Qfetch = () => {
        const qurl = '/api/questions/profile?skip=' + skip
        fetch( qurl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ fbId: profile.fbId, token: user.token })
        }).then(res => res.json())
        .then(data => {
            setQuest(data)
            if(data.length>0){
                setLoadSts(null)
            }else{
                setLoadSts('nothing to show!')
            }
        }).catch(e => setLoadSts('Error loading data!'))
    }


    const handleFollow = () => {
        const qurl = '/api/follow/' + id
        fetch( qurl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token: user.token })
        }).then(res => res.json())
        .then(data => {
            setFollow(follow + 1)
        }).catch(e => {})
    }

    return (
        <div>
            <div className="Profile-Desc">
                <div className="ProfHolder">
                    <img className="Pro-Desc-Img" alt="User-Image" src={profile.avatar} height="50px" width="50px" />
                    <p>{profile.name}</p>
                    {profile.fbId && <p>{profile.followedBy.length < 2 ? profile.followedBy.length + ' follower' : profile.followedBy.length + ' followers' }</p>}
                </div>
                <div className="buttonHolder">
                    {(user.fbId !== id) && <Link to={`/ask/${profile.fbId}`} className="ButtonImage"><img alt="icon" className="iconImageButton" src="/icons/ask.png"/></Link>}
                    {(user.fbId !== id) && <button onClick={handleFollow} className={profile.fbId && profile.followedBy.includes(user.fbId) ? "activeButtonImage" : "ButtonImage"}><img className={profile.fbId && profile.followedBy.includes(user.fbId) ? "iconImageButtonActive" : "iconImageButton"} src="/icons/add.png"/></button>}
                    <Link to={`/ask/${profile.fbId}`} className="ButtonImage"><img className="iconImageButton" src="/icons/share.png"/></Link>
                </div>
            </div>
            <div className="sectionTitle">Public questions</div>
            {!loadSts && 
            <div>
                {
                    (quest !== null) && quest.map((q) => <Question key={q._id} data={q} />)
                }
            </div>}
            {!loadSts &&
            <div className="paginationWrapper">
                { skip > 0 && <button className="paginationButton" onClick={() => setSkip(skip-1)}>previous</button>}
                {(quest !== null && quest.length === 10) && <button className="paginationButton" onClick={() => setSkip(skip+1)}>Next</button>}
            </div>}
            {loadSts &&
            <div className="ProfileDenyMessage">
                <p>{loadSts}</p>
            </div>
            }
        </div>
    )
}

export default User