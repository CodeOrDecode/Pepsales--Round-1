import { legacy_createStore } from "redux";
import { combineReducers } from "redux";
import { todoreducer } from "./todorecucer";
import { inputreducer } from "./inputreducer";
import { statusreducer } from "./statusreducer";

const rootreducer = combineReducers({
    todo:todoreducer,
    status:statusreducer,
    inputval:inputreducer
})

export const store = legacy_createStore(rootreducer)