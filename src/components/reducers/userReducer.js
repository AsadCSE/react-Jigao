const userReducer = (state, action) => {
    switch(action.type){
        case 'POPULATE_USER':
            return action.user
        case 'REMOVE_USER':
            localStorage.removeItem('askbook')
            return {}
        default:
            return state
    }
}

export default userReducer