const sellerByRefIdReducer = (state = [], action) => {
    switch (action.type) {
        case "SET_SELLER_BY_REFID":
            return action.payload
        default:
            return state
    }
}

export default sellerByRefIdReducer;