import React, { useContext, useEffect, useState } from 'react'
import userContext from './contexts/user-context'
import Modal from 'react-modal'
import { Link,Redirect } from 'react-router-dom'
import ProfileImage from './HeaderComponents/ProfileImageComponent'

const Header = () => {
    const {user} = useContext(userContext)
    
    return (
        <div className='Header'>
            <div className='HeaderBranding'>
                <Link to='/' className='StyleLink'><h2 className='HeaderBrandingText'>jigao</h2></Link>
            </div>
            <SearchBar />
            <ProfileImage />
        </div>
    )
}

const SearchBar = () => {
    const [modal, setModal] = useState(false)
    const [search, setSearch] = useState('')
    const [searchResult, setSearchResult] = useState([])

    useEffect(() => {
        if(search.length > 1){
            const url = '/api/search'
            fetch( url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ search: search })
            }).then(res => res.json())
            .then(data => {
                setSearchResult(data)
            }).catch(e => {})
        }else{
            setSearchResult([])
        }
    },[search])

    const clearSearch = () => {
        setModal(false)
        setSearch('')
    }

    return (
        <div className='HeaderSearch'>
            <Modal 
                isOpen = {modal}
                className="searchModal"
                overlayClassName="UserModalOverlay"
                ariaHideApp={false}
            >
                <div className="searchModalWrapper">
                    <div className="searchModalTool">
                        <input onChange={(e) => setSearch(e.target.value)} value={search} className="searchModalInput" placeholder="start typing name"/>
                        <button className="bigButton" onClick={() => setModal(false)}>close</button>
                    </div>
                    <div className="searchResultWrapper">
                        {
                            searchResult.length > 0 && searchResult.map(result => <Result handleClear={clearSearch} key={result} data={result} />)
                        }
                    </div>
                </div>
            </Modal>
            <button onClick={() => setModal(true)} className='HeaderSearchButton'><img className="searchButtonIcon" src='/icons/search.png'/></button>
        </div>
    )
}

const Result = ({data, handleClear}) => {

    return (
        <Link onClick={handleClear} to={'/user/' + data.fbId} className="searchedProfileWrapper">
            <div className="searchImageContainer">
                <img className="searchProfileImage" src={data.avatar} />
            </div>
            <div className="searchProfileName">
                <p>{data.name}</p>
            </div>
        </Link>
    )
}

export default Header