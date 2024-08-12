import React, { useState, useEffect } from "react";
import { showtodo, statuschange, changeinput } from "../Redux/action";
import { useSelector, useDispatch } from "react-redux";
import style from "../Css/Todo.module.css";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const Todo = () => {
  const dispatch = useDispatch();
  const state = useSelector((state) => state);

  const [modalVisible, setModalVisible] = useState(false);
  const [movingItem, setMovingItem] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [blockHistory, setBlockHistory] = useState([]);

  async function getTodoData() {
    try {
      let res = await fetch("http://localhost:3000/todo");
      let data = await res.json();
      dispatch(showtodo(data));
    } catch (error) {
      console.log("Error fetching todo data:", error);
    }
  }

  async function handleFilterTodo(val) {
    try {
      let res = await fetch("http://localhost:3000/todo");
      let data = await res.json();
      let filteredTodos = data;

      if (val === "pending") {
        filteredTodos = data.filter((ele) => !ele.status);
      } else if (val === "completed") {
        filteredTodos = data.filter((ele) => ele.status);
      }

      dispatch(showtodo(filteredTodos));
      dispatch(statuschange(val));
    } catch (error) {
      console.log("Error filtering todos:", error);
    }
  }

  function handleChangeStatus(event) {
    handleFilterTodo(event.target.value);
  }

  function handleOnDragEnd(result) {
    if (!result.destination) return;

    const items = Array.from(state.todo);
    const [reorderedItem] = items.splice(result.source.index, 1);

    setMovingItem(reorderedItem);
    setNewStatus(reorderedItem.status ? "completed" : "pending");
    setModalVisible(true);
  }

  function handleChangeInput(event) {
    dispatch(changeinput(event.target.value));
  }

  async function handleAddTodoIs() {
    try {
      await fetch("http://localhost:3000/todo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: state.inputval, status: false }),
      });
      dispatch(changeinput(""));
      getTodoData();
    } catch (error) {
      console.log("Error adding todo:", error);
    }
  }

  function handleModalSubmit() {
    if (movingItem) {
      const updatedItem = { ...movingItem, status: newStatus === "completed" };

      const items = Array.from(state.todo);
      const movingItemIndex = items.findIndex((item) => item.id === movingItem.id);
      items.splice(movingItemIndex, 1);

      if (newStatus === "completed") {
        items.push(updatedItem);
      } else {
        items.unshift(updatedItem);
      }

      dispatch(showtodo(items));
    }
    setModalVisible(false);
    setMovingItem(null);
  }

  async function handleBlockClick(block) {
    setSelectedBlock(block);

    try {
      let res = await fetch(`http://localhost:3000/todo/${block.id}`);
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      let history = await res.json();
      console.log("Fetched history:", history);
      setBlockHistory(Array.isArray(history) ? history : []);
    } catch (error) {
      console.log("Error fetching block history:", error);
      setBlockHistory([]);
    }
  }

  useEffect(() => {
    getTodoData();
  }, []);

  return (
    <>
      <div>
        <input
          className={style.inputtodod}
          type="text"
          placeholder="Add Title"
          onChange={handleChangeInput}
          value={state.inputval}
        />
        <button className={style.todobutton} onClick={handleAddTodoIs}>
          Add
        </button>
      </div>

      <select
        className={style.select1}
        onChange={handleChangeStatus}
        value={state.status}
      >
        <option value="all">Status : All</option>
        <option value="pending">Status : Pending</option>
        <option value="completed">Status : Completed</option>
      </select>

      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="droppable-1">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {state.todo &&
                state.todo.map((ele, index) => (
                  <Draggable
                    key={ele.id}
                    draggableId={ele.id.toString()}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        className={style.tododiv}
                        {...provided.draggableProps}
                        ref={provided.innerRef}
                        {...provided.dragHandleProps}
                        onClick={() => handleBlockClick(ele)}
                      >
                        <p>Title is : {ele.title}</p>
                        <p className={style.ptodo}>
                          Status : {ele.status ? "Completed" : "Pending"}
                        </p>
                      </div>
                    )}
                  </Draggable>
                ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {modalVisible && (
        <div className={style.modal}>
          <label>
            <p className={style.newstatus}>New Status:</p>
            <select
              style={{ outline: "none" }}
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
            >
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </label>
          <button onClick={handleModalSubmit}>Submit</button>
        </div>
      )}

      {selectedBlock && (
        <div className={style.blockPreviewModal}>
          <h2>Block Details</h2>
          <p>Title: {selectedBlock.title}</p>
          <p>Status: {selectedBlock.status ? "Completed" : "Pending"}</p>
          <h3>History</h3>
          <ul>
            {blockHistory.length > 0 ? (
              blockHistory.map((entry, index) => (
                <li key={index}>{entry.date}: {entry.status}</li>
              ))
            ) : (
              <li>No history available</li>
            )}
          </ul>
          <button onClick={() => setSelectedBlock(null)}>Close</button>
        </div>
      )}
    </>
  );
};

export default Todo;
