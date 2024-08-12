export function todoreducer(state = [],action){
    switch(action.type){
        case "TODOSHOW":
            return action.payload

        default:
            return state
    }

}
