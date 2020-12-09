import React, { useEffect, useState, useContext } from 'react'
import Profile from './subComponents/profile'
import userContext from './contexts/user-context'
import Question from './subComponents/qusetions'

const Private = () => {
    const {user} = useContext(userContext)
    const [questions, setQuestions] = useState(null)
    const [skip, setSkip] = useState(0)
    const [loadSts, setLoadSts] = useState('loading...')

    useEffect(() => {
        const qurl = '/api/questions/private?skip=' + skip
        fetch( qurl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ fbId: user.fbId, token: user.token })
        }).then(res => res.json())
        .then(data => {
            setQuestions(data)
            if(data.length === 0){
                setLoadSts('Nothing to show!')
            }else{
                setLoadSts(null)
            }
        }).catch(e => setLoadSts('Error Loading data!'))
    }, [skip])

    return (
        <div>
            <Profile />
            <div className="sectionTitle">Private</div>
            {!loadSts &&
            <div>
                {(questions !== null) && questions.map((q) => <Question key={q._id} data={q} />)}
            </div>}
            {!loadSts &&
            <div className="paginationWrapper">
                { skip > 0 && <button className="paginationButton" onClick={() => setSkip(skip-1)}>previous</button>}
                {(questions !== null && questions.length === 10) && <button className="paginationButton" onClick={() => setSkip(skip+1)}>Next</button>}
            </div>}
            {loadSts &&
            <div className="ProfileDenyMessage">
                <p>{loadSts}</p>
            </div>
            }
        </div>
    )
}

export default Private