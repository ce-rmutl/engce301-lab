const form = document.querySelector("form");
const todoInput = document.querySelector("#todo-input");
const addButton = document.querySelector("#add-button");
const todoList = document.querySelector("#todo-list");

let todos = [];

function addTodo() {
  //console.log("Hello, guys.");
  const todoText = todoInput.value.trim();
  if (todoText.length > 0) {
    const todo = {
      id: Date.now(),
      text: todoText,
      completed: false,
    };

    todos.push(todo);

    todoInput.value = "";

    renderTodos();
  }
}

function deleteTodo(id) {
  //console.log(id);
  todos = todos.filter((todo) => todo.id !== id);
  renderTodos();
}

function toggleCompleted(id) {
  // console.log(id);
  //let a = 1;
  //a = a + 1; //a = 2
  todos = todos.map((todo) => {
    if (todo.id === id) {
      todo.completed = !todo.completed;
    }
    return todo;
  });
  renderTodos();
}

function renderTodos() {
  todoList.innerHTML = "";

  todos.forEach((todo) => {
    const todoItem = document.createElement("li");
    const todoText = document.createElement("span");
    const todoDeleteButton = document.createElement("button");
    const myCheck = document.createElement("INPUT");
          myCheck.setAttribute("type", "checkbox");

    todoText.textContent = todo.text;
    todoDeleteButton.textContent = "Delete";

    todoDeleteButton.addEventListener("click", () => deleteTodo(todo.id));

    if (todo.completed) {
      todoItem.classList.add("completed");
    }

    todoItem.addEventListener("click", () => toggleCompleted(todo.id));
  
    todoItem.appendChild(todoText);
    todoItem.appendChild(todoDeleteButton);


    todoList.appendChild(todoItem);
  });
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  addTodo();
});

renderTodos();
