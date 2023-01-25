class Model {
  constructor() {
    this.todos = JSON.parse(localStorage.getItem("todos")) || [];
  }

  // Need Clarification
  bindTodoListChanged(callback) {
    this.onTodoListChanged = callback;
  }

  _commit(todos) {
    this.onTodoListChanged(todos);
    localStorage.setItem("todos", JSON.stringify(todos));
  }

  addTodo(todoText) {
    const todo = {
      id: this.todos.length > 0 ? this.todos[this.todos.length - 1].id + 1 : 1,
      text: todoText,
      complete: false,
    };

    this.todos.push(todo);

    this._commit(this.todos);
  }

  editTodo(id, updatedText) {
    this.todos = this.todos.map((todo) =>
      todo.id === id
        ? { id: todo.id, text: updatedText, complete: todo.complete }
        : todo
    );

    this._commit(this.todos);
  }

  deleteTodo(id) {
    this.todos = this.todos.filter((todo) => todo.id !== id);

    this._commit(this.todos);
  }

  toggleTodo(id) {
    this.todos = this.todos.map((todo) =>
      todo.id === id
        ? { id: todo.id, text: todo.text, complete: !todo.complete }
        : todo
    );

    this._commit(this.todos);
  }
}

class View {
  constructor() {
    this.app = document.querySelector("#root");
    this.titleHtml = "<h1 id='title'>To-Do's</h1>";
    this.app.insertAdjacentHTML("afterbegin", this.titleHtml);

    this.title = document.querySelector("#title");
    this.formHtml = "<form id='todo-submit-form'></form>";
    this.title.insertAdjacentHTML("afterend", this.formHtml);

    this.form = document.querySelector("#todo-submit-form");
    this.inputHtml =
      "<input id='todo-input' type='text' placeholder='Add To-Do' name='todo'></input>";
    this.form.insertAdjacentHTML("afterbegin", this.inputHtml);

    this.input = document.querySelector("#todo-input");
    this.submitButtonHtml = "<button id='submit-btn'>Submit</button>";
    this.input.insertAdjacentHTML("afterend", this.submitButtonHtml);

    this.todoListHtml = "<ul id='todoList' class='todo-list'></ul>";
    this.form.insertAdjacentHTML("afterend", this.todoListHtml);

    this._temporaryTodoText = "";
    this._initLocalListeners();

    this.todoList = document.querySelector("#todoList")

  }

  get _todoText() {
    return this.input.value;
  }

  _resetInput() {
    this.input.insertAdjacentText('afterbegin', "");
  }

  displayTodos(todos) {
    while (this.todoList.firstChild) {
      this.todoList.removeChild(this.todoList.firstChild);
    }

    if (todos.length === 0) {
      let pHtml = "<p>No To-Do's! Add some below</p>"
      this.todoList.insertAdjacentHTML("afterbegin", pHtml)
    } else {
      todos.forEach((todo) => {
        let liHtml = `<li id='list-item${todo.id}'></li>`
        this.todoList.insertAdjacentHTML("afterbegin", liHtml)

        this.li = document.querySelector(`#list-item${todo.id}`)
        let checkboxHtml = `<input id='todoCheck' type='checkbox' checkbox=${todo.complete}></input>`
        this.li.insertAdjacentHTML("afterbegin", checkboxHtml)

        this.checkbox = document.querySelector("#todoCheck")
        let spanHtml = "<span id='todoText' contentEditable=true class='editable'></span>"
        this.checkbox.insertAdjacentHTML('afterend', spanHtml)

        this.span = document.querySelector("#todoText")

        if (todo.complete) {
          let strikeHtml = `<s>${todo.text}</s>`
          this.span.insertAdjacentHTML('afterbegin', strikeHtml)
        } else {

          this.span.insertAdjacentText('afterbegin', todo.text)
        }

        let deleteBtnHtml = "<button class='delete'>Delete</button>"
        this.span.insertAdjacentHTML("afterend", deleteBtnHtml)

      });
    }
  }

  _initLocalListeners() {
    addEventListener("input", (event) => {
      if (event.target.className === "editable") {
        this._temporaryTodoText = event.target.innerText;
      }
    });
  }

  bindAddTodo(handler) {
    addEventListener("submit", (event) => {
      event.preventDefault();

      if (this._todoText) {
        handler(this._todoText);
        this._resetInput;
      }
    });
  }

  bindDeleteTodo(handler) {
    addEventListener("click", (event) => {
      if (event.target.className === "delete") {
        const id = parseInt(event.target.parentElement.id.split('list-item').join(""));
        console.log()

        handler(id);
      }
    });
  }

  bindEditTodo(handler) {
    addEventListener("focusout", (event) => {
      if (this._temporaryTodoText) {
        const id = parseInt(event.target.parentElement.id.split('list-item').join(""));

        handler(id, this._temporaryTodoText);
        this._temporaryTodoText = "";
      }
    });
  }

  bindToggleTodo(handler) {
    addEventListener("change", (event) => {
      if (event.target.type === "checkbox") {
        const id = parseInt(event.target.parentElement.id.split('list-item').join(""));

        handler(id);
      }
    });
  }
}

class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    // Need Clarification
    this.model.bindTodoListChanged(this.onTodoListChanged);
    this.view.bindAddTodo(this.handleAddTodo);
    this.view.bindDeleteTodo(this.handleDeleteTodo);
    this.view.bindEditTodo(this.handleEditTodo);
    this.view.bindToggleTodo(this.handleToggleTodo);

    // Need Clarification
    this.onTodoListChanged(this.model.todos);
  }

  onTodoListChanged = (todos) => {
    this.view.displayTodos(todos);
  };

  handleAddTodo = (todoText) => {
    this.model.addTodo(todoText);
  };

  handleDeleteTodo = (id) => {
    this.model.deleteTodo(id);
  };

  handleEditTodo = (id, todoText) => {
    this.model.editTodo(id, todoText);
  };

  handleToggleTodo = (id) => {
    this.model.toggleTodo(id);
  };
}

const app = new Controller(new Model(), new View());
