export function inputreducer(state = "",action){
    switch(action.type){
        case "CHANGEINPUT":
            return action.payload

        default:
            return state
    }

}
