export function showtodo(val) {
    return { type: "TODOSHOW", payload: val }
}

export function statuschange(val) {
    return { type: "CHANGESTATUS", payload: val }
}

export function changeinput(val) {
    return { type: "CHANGEINPUT", payload: val }
}