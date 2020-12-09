import React, { useEffect, useContext, useState } from 'react'
import { useParams } from 'react-router-dom'
import userContext from './contexts/user-context'
import { Link } from 'react-router-dom'
import Modal from 'react-modal'

const Question = () => {

    const {user} = useContext(userContext)
    const [question, setQuestion] = useState(null)
    const { id } = useParams()
    const [loadSts, setLoadSts] = useState('loading...')
    const [action, setAction] = useState(false)
    const [ans, setAns] = useState('')
    const [ansSubmit, setAnsSubmit] = useState (null)
    const [modal,setModal] = useState(false)
    const [likeSubmit, setLikeSubmit] = useState(null)
    const [comment, setComment] = useState('')
    const [comSubmit, setComSubmit] = useState(null)

    useEffect(() => {
        setComment('')
        const qurl = '/api/questions/one/' + id
        console.log(qurl)
        fetch( qurl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'token': user.token
            }
        }).then(res => res.json())
        .then(data => {
            setQuestion(data)
            console.log(data)
            if(data._id){
                setLoadSts(null)
            }else{
                setLoadSts('Nothing found!')
            }
        }).catch(e => setLoadSts('Data not Found!'))
    },[ansSubmit, likeSubmit, comSubmit])

    const populateAnswer = (e) => {
        e.target.value.length < 161 && setAns(e.target.value)
    }

    const handleDelete = () => {
        setModal(true)
    }

    const deleteQuestion = () => {
        const data = {
            isHidden: true,
            token : user.token
        }
        const url = '/api/questions/one/delete/' + id
        fetch( url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(feedback => feedback.json())
        .then(data => {
            if(data.Message === 'success'){
                setAnsSubmit('Deleted!')
            }
        }).catch(e => setAnsSubmit('Cannot delete!'))
        setModal(false)
    }

    const answerSubmit = (e) => {
        e.preventDefault()
        const data = {
            answer: ans,
            isPrivated: e.target.elements.isPrivated.checked,
            token : user.token
        }
        const url = '/api/questions/one/' + id
        fetch( url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(feedback => feedback.json())
        .then(data => {
            if(data.Message === 'success'){
                setAnsSubmit('success')
            }
        }).catch(e => setAnsSubmit('Cannot submit!'))
    }

    const likeSubmitHandler = () => {
        const data = {token: user.token}
        const url = '/api/questions/likes/' + id
        fetch( url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(feedback => feedback.json())
        .then(data => {
            if(data.Message === 'success'){
                setLikeSubmit('success')
            }
        }).catch(e => setLikeSubmit('cannot like'))
    }

    const commentSubmitHandler = (e) => {
        e.preventDefault()
        if(comment.length > 4){
            const data = {
                token: user.token, 
                comment: comment,
                name: user.name,
                avatar: user.avatar
            }
            const url = '/api/questions/comments/' + id
            fetch( url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            }).then(feedback => feedback.json())
            .then(data => {
                if(!!data.message){
                    setComSubmit(data.message)
                }
            }).catch(e => setComSubmit('cannot comment'))
        }
    }

    return (
        <div className="QMainWrapper">

            <Modal 
                isOpen = {modal}
                className="UserModal"
                overlayClassName="UserModalOverlay"
                ariaHideApp={false}
            >
                <div>
                    <p className="deleteMessage">Delete this question from {question !== null && (question.askedByName ? question.askedByName : 'Anonymous')}?</p>
                    <div className="deleteModalButtonWrapper">
                        <button className="deleteModalButton" onClick={deleteQuestion}>Yes</button>
                        <button className="deleteModalButton" onClick={() => setModal(false)}>No</button>
                    </div>
                </div>
            </Modal>


            {!loadSts &&
            <div className="QuestionWrapper">

                {(question.answered && question.askedToId === user.fbId) &&
                <div className="QuestionDeleteShare">
                    <button onClick={handleDelete} className="deleteModalButton">Delete</button>
                </div>
                }

                <div className="AskerPanel">
                    <Link to={() => question.askedById ? '/user/' + question.askedById : undefined}><img className="profileBadgeImage" height="50px" width="50px" src={question.askedByAvatar ? question.askedByAvatar : '/icons/anonymous.png'} /></Link>
                    <div className="AskerPanelQuestionBox">
                        <p className="AskerPanelQuestion">
                            {question.askedByName ? <span className="nameColor">{question.askedByName}</span> : <span className="nameColor">Anonymous</span>} {question.question}
                        </p>
                        <p className="AskerPanelTime">
                            {new Date(question.createdAt).toLocaleDateString('en-GB', {day: 'numeric', month: 'short', year: 'numeric' }).replace(/, /g, '-')} &nbsp;
                            {new Date(question.createdAt).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })} &nbsp;
                            {question.isPrivate ? 'Private' : 'Public'}
                        </p>
                    </div>
                </div>

                {(!question.answered && question.askedToId === user.fbId && !action) &&
                <div className="UnAnsweredButtonGroup">
                    <button onClick={() => setAction(true)} className="UnAnsweredGroupButton">Answer</button>
                    <button onClick={handleDelete} className="UnAnsweredGroupButton">Delete</button>
                </div>
                }

                {(!question.answered && question.askedToId === user.fbId && action) &&

                <div className="AnswerBoxWrapper">
                    {ansSubmit && <p className="answerSubmitMessage">{ansSubmit}</p>}
                    <p className="answerCount">{ans.length}/160</p>
                    <form onSubmit={answerSubmit} className="answerFormWrapper">
                        <textarea value={ans} onChange={populateAnswer} placeholder="type your question here..." name="question" className="answerBox"/>
                        <div className="AnswerSubmitPanel">
                            <div>
                                <input name="isPrivated" type="checkbox" id="isPrivated"/>
                                <label htmlFor="isPrivated"> Private answer</label>
                            </div>
                            <button className="bigButton">Answer</button>
                        </div>
                    </form>
                </div>
                }

                {question.answered &&
                <div>
                    <div className="AnswerPanel">
                        <div className="AnswerPanelQuestionBox">
                            <p className="AskerPanelQuestion">
                                {<span className="nameColor">{question.askedToName}</span>} {question.answer}
                            </p>
                            <p className="AskerPanelTime">
                                {new Date(question.answeredAt).toLocaleDateString('en-GB', {day: 'numeric', month: 'short', year: 'numeric' }).replace(/, /g, '-')} &nbsp;
                                {new Date(question.answeredAt).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })} &nbsp;
                                {question.isPrivate ? 'Private' : 'Public'}
                            </p>
                        </div>
                        <Link to={() => '/user/' + question.askedToId}><img className="profileBadgeImage" height="50px" width="50px" src={question.askedToAvatar} /></Link>
                    </div>
                </div>
                }

                {question.answered && 
                <div className="likeShareCommentSection">
                    <div className="likeShareSection">
                        {question.likes.includes(user.fbId) ? <button onClick={likeSubmitHandler} className="likeSharePanelButton">Liked ({question.likes.length})</button> : <button onClick={likeSubmitHandler} className="likeButtonUncheck">Like ({question.likes.length})</button>}
                        <button className="likeSharePanelButton">Share</button>
                    </div>
                    <div className="commentSection">
                        <div className="CommentTitle">Comments ({question.comments.length})</div>
                        <div className="commentHolder">
                            {
                                question.comments.map((comment, index) => <Comment key={index} comment={comment} />)
                            }
                        </div>
                        <div className="commentInputSection">
                            <form className="commentForm" onSubmit={commentSubmitHandler}>
                                <textarea placeholder="write here..." value={comment} onChange={(e) => (e.target.value.length < 161) && setComment(e.target.value)} className="commentInputBox"/>
                                <div className="ButtonHolder">
                                    <div className="commentCounterWrapper">
                                        <p className="commentCounter">{comment.length}/160</p>
                                    </div>
                                    <button disabled={comment.length > 4 ? false : true} className={comment.length > 4 ? "commentSubmitButton" : "commentSubmitButtonDeactive"}>Comment</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                }
            </div>
            }
            {loadSts &&
            <div className="ProfileDenyMessage">
                <p>{loadSts}</p>
            </div>
            }
        </div>
    )
}

const Comment = ({comment}) => {
    return (
        <div className="commentShowWrapper">
            <div className="commentProfileWrapper">
                <Link to={'/user/' + comment.fbId}><img className="commentProfilePic" src={comment.avatar} height="35px" width="35px"/></Link>
            </div>
            <div className="commentTextWrapper">
                <p><span className="commentProfileName">{comment.name}</span> <span className="commentCommentText">{comment.comment}</span></p>
                <p className="commentDateTime">
                    {new Date(comment.time).toLocaleDateString('en-GB', {day: 'numeric', month: 'short', year: 'numeric' }).replace(/, /g, '-')} &nbsp;
                    {new Date(comment.time).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}
                </p>
            </div>
        </div>
    )
}

export default Question