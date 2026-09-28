const STORAGE_KEY = "todo-app-todos";

function initApp() {
  const input = document.getElementById("todo-input");
  const addBtn = document.getElementById("add-btn");
  const list = document.getElementById("todo-list");
  const stats = document.getElementById("todo-stats");
  const filterBtns = document.querySelectorAll(".filter-btn");
  const clearCompletedBtn = document.getElementById("clear-completed-btn");

  let todos = loadTodos();
  let nextId = todos.reduce((max, t) => Math.max(max, t.id), 0) + 1;
  let currentFilter = "all";

  function loadTodos() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  }

  function saveTodos() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }

  function addTodo() {
    const text = input.value.trim();

    if (text === "") {
      alert("할 일을 입력하세요");
      return;
    }

    const isDuplicate = todos.some((t) => t.text === text);
    if (isDuplicate) {
      alert("이미 등록된 할 일입니다");
      return;
    }

    todos.push({
      id: nextId++,
      text: text,
      completed: false,
    });

    input.value = "";
    render();
    input.focus();
  }

  function toggleTodo(id) {
    const todo = todos.find((t) => t.id === id);
    if (todo) {
      todo.completed = !todo.completed;
      render();
    }
  }

  function deleteTodo(id) {
    todos = todos.filter((t) => t.id !== id);
    render();
  }

  function clearCompleted() {
    todos = todos.filter((t) => !t.completed);
    render();
  }

  function getFilteredTodos() {
    if (currentFilter === "active") {
      return todos.filter((t) => !t.completed);
    }
    if (currentFilter === "completed") {
      return todos.filter((t) => t.completed);
    }
    return todos;
  }

  function renderStats() {
    const total = todos.length;
    const completed = todos.filter((t) => t.completed).length;
    stats.textContent = `전체 ${total}개 · 완료 ${completed}개`;
  }

  function render() {
    saveTodos();
    renderStats();

    list.innerHTML = "";

    getFilteredTodos().forEach((todo) => {
      const li = document.createElement("li");
      li.className = "todo-item" + (todo.completed ? " completed" : "");

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.className = "todo-item__checkbox";
      checkbox.checked = todo.completed;
      checkbox.addEventListener("change", () => toggleTodo(todo.id));

      const span = document.createElement("span");
      span.className = "todo-item__text";
      span.textContent = todo.text;

      const deleteBtn = document.createElement("button");
      deleteBtn.type = "button";
      deleteBtn.className = "todo-item__delete";
      deleteBtn.textContent = "삭제";
      deleteBtn.addEventListener("click", () => deleteTodo(todo.id));

      li.appendChild(checkbox);
      li.appendChild(span);
      li.appendChild(deleteBtn);
      list.appendChild(li);
    });
  }

  addBtn.addEventListener("click", addTodo);

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      addTodo();
    }
  });

  clearCompletedBtn.addEventListener("click", clearCompleted);

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      currentFilter = btn.dataset.filter;
      filterBtns.forEach((b) => b.classList.toggle("is-active", b === btn));
      render();
    });
  });

  render();
}

initApp();
