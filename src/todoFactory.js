import { format } from "date-fns";
export const todoFactory = (title, description, dueDate) => {
  return {
    title,
    description,
    dueDate,
    completed: false,
    copletedOn: false,
    toggleCompleted() {
      this.completed = !this.completed;
      this.completedOn = format(new Date(), "dd/MM/yy");
    },
  };
};
