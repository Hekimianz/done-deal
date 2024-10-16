export const listFactory = (listName) => {
  let todos = [];
  return {
    listName,
    todos,
    addTodo(todo) {
      todos.push(todo);
    },
    removeTodo(index) {
      todos.splice(index, 1);
    },
    editTodo(index, updatedTodo) {
      todos[index] = updatedTodo;
    },
  };
};
