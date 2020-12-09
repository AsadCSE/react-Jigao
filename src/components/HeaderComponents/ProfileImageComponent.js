import React, { useContext, useState } from 'react'
import Modal from 'react-modal'
import userContext from '../contexts/user-context'
import { Link } from 'react-router-dom'

const ProfileImage = () => {
    const {user,dispatch} = useContext(userContext)
    const [modal, setModal] = useState(false)
    const profileLink = `/user/${user.fbId}`
    return (
        <div className='HeaderProfile'>
            <img onClick={() => setModal(true)} className='HeaderProfileImage' alt='profile' src={user.avatar} height='35px' width='35px' />
            <Modal 
                isOpen = {modal}
                className="UserModal"
                overlayClassName="UserModalOverlay"
                ariaHideApp={false}
            >
                <div className='ModalMenuWrapper'>
                    <Link to={profileLink} className='ModalMenuOptions StyleLink' onClick={() => setModal(false)}>
                        <div className='ModalMenuIcon'>
                            <img alt='profile' src='/icons/profile.png' width='20px' height='20px' />
                        </div>
                        <div className='ModalMenuText'>
                            <p>Profile</p>
                        </div>
                    </Link>
                    <Link to='/requests' className='ModalMenuOptions StyleLink' onClick={() => setModal(false)}>
                        <div className='ModalMenuIcon'>
                            <img alt='requests' src='/icons/requests.png' width='20px' height='20px' />
                        </div>
                        <div className='ModalMenuText'>
                            <p>Requests</p>
                        </div>
                    </Link>
                    <Link to='/queries' className='ModalMenuOptions StyleLink' onClick={() => setModal(false)}>
                        <div className='ModalMenuIcon'>
                            <img alt='queries' src='/icons/queries.png' width='20px' height='20px' />
                        </div>
                        <div className='ModalMenuText'>
                            <p>Queries</p>
                        </div>
                    </Link>
                    <Link to='/private' className='ModalMenuOptions StyleLink' onClick={() => setModal(false)}>
                        <div className='ModalMenuIcon'>
                            <img alt='private' src='/icons/private.png' width='20px' height='20px'/>
                        </div>
                        <div className='ModalMenuText'>
                            <p>Private</p>
                        </div>
                    </Link>
                    <Link className='ModalMenuOptions StyleLink' onClick={() => {
                        setModal(false)
                        dispatch({
                            type: 'REMOVE_USER'
                        })
                    }}>
                        <div className='ModalMenuIcon'>
                            <img alt='logout' src='/icons/logout.png' height='20px' width='20px' />
                        </div>
                        <div className='ModalMenuText'>
                            <p>Logout</p>
                        </div>
                    </Link>
                    <div className='ModalMenuOptions' onClick={() => setModal(false)}>
                        <div className='ModalMenuIcon'>
                            <img alt='cancel' src='/icons/cancel.png' height='20px' width='20px' />
                        </div>
                        <div className='ModalMenuText'>
                            <p>Cancel</p>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default ProfileImage