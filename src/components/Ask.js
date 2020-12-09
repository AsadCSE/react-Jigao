import React, {useState, useEffect, useContext} from 'react'
import { useParams } from 'react-router-dom'
import userContext from './contexts/user-context'

const Ask = () => {
    
    const {user, dispatch} = useContext(userContext)
    let {id} = useParams()
    const [profile, setProfile] = useState({})
    const [Question, setQuestion] = useState('')
    const [successMessage, setSuccessMessage] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [loadSts, setLoadSts] = useState('loading...')

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
            if(data.fbId === user.fbId){
                setLoadSts('Can\'t ask yourself!')
            }else if(data.fbId !== user.fbId){
                setLoadSts('')
            }
        }).catch(e => {setLoadSts('user not found')})
    }, [id])

    useEffect(() => {
        setTimeout(() => {
            setSuccessMessage('')
            setErrorMessage('')
        },2000)
    },[successMessage, errorMessage])

    const QuestionSubmit = (e) => {
        e.preventDefault()
        if(e.target.elements.question.value.length < 10){
            setSuccessMessage('')
            return setErrorMessage('at least 10 characters')
        }
        const QuestionAsked = {
            question: e.target.elements.question.value,
            askedBy: user.fbId,
            askedAs: e.target.elements.askedAs.checked,
            isPrivate: e.target.elements.isPrivate.checked,
            askedTo: profile.fbId,
            token: user.token
        }
        
        fetch('/api/ask', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(QuestionAsked)
        }).then((response) => response.json()).then((data) => {
            if(data.Success){
                setSuccessMessage(data.Success);
                setErrorMessage('')
            }else{
                setSuccessMessage('')
                setErrorMessage(data.Error)
            }
        }).catch(e => {
            setSuccessMessage('')
            setErrorMessage('unknown Error')
        })
        
        setQuestion('')
        e.target.elements.isPrivate.checked = false
        e.target.elements.askedAs.checked = false
    }

    const chkQLength = (e) => {
        e.target.value.length <= 160 && setQuestion(e.target.value)
    }

    return (
        <div>
            {
                !loadSts &&
                <div className="AskProfileBadge">
                    <div className="profileBadge">
                        <img className="AskPageImage" src={profile.avatar} height="65px" width="65px" alt={profile.name}/>
                        <p className="askProfileName">Ask {profile.name}</p>
                    </div>
                    {
                        successMessage && <div className="successMessage">{successMessage}</div>
                    }
                    {
                        errorMessage && <div className="errorMessage">{errorMessage}</div>
                    }
                    <div className="AskBox">
                        <div className="chatCount">
                            <p className="TextCount">{Question.length}/160</p>
                        </div>
                        <form onSubmit={QuestionSubmit}>
                            <textarea placeholder="type your answer here..." name="question" value={Question} onChange={chkQLength} className="AskBoxInputText"/>
                            <div className="AskSettingPannel">
                                <div className="askOptions">
                                    <div>
                                        <input name="askedAs" type="checkbox" id="askedAs"/>
                                        <label htmlFor="askedAs"> Ask as Anonymous</label>
                                    </div>
                                    <div>
                                        <input name="isPrivate" type="checkbox" id="isPrivate"/>
                                        <label htmlFor="isPrivate"> Ask in private</label> 
                                    </div>
                                </div>
                                <button className="bigButton">Ask {profile.name.split(' ')[0]}</button>
                            </div>
                        </form>
                    </div>
                </div>
            }
            {
                loadSts &&
                <div className="ProfileDenyMessage">
                    <p>{loadSts}</p>
                </div>
            }
        </div>
    )
}

export default Ask