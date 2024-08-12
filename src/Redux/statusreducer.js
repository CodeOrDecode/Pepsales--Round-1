export function statusreducer(state = "all",action){
    switch(action.type){
        case "CHANGESTATUS":
            return action.payload

        default:
            return state
    }

}
