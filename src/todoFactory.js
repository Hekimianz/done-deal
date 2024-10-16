export const todoFactory = (title, description, dueDate) => {
  return {
    title,
    description,
    dueDate,
    completed: false,
    toggleCompleted() {
      this.completed = !this.completed;
    },
  };
};
