import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ToDo, TodosService} from './services/todos.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  todos: ToDo[] = [];
  todoTitle = '';
  loading = false;
  error = '';

  constructor(private todosService: TodosService) {}

  ngOnInit() {
    this.fetchTodos();
  }

  addTodo() {
    if (!this.todoTitle.trim()) {
      return;
    }

    this.todosService.addTodo({
      title: this.todoTitle,
      completed: false,
    })
      .subscribe(todo => {
        this.todos.push(todo);
        this.todoTitle = '';
      });
  }

  fetchTodos() {
    this.loading = true;
    this.todosService.fetchTodos()
      .subscribe(todos => {
        this.loading = false;
        this.todos = todos;
      }, error => {
        this.error = error.message;
        console.error(error);
      });
  }

  removeTodo(id: number) {
    this.todosService.removeTodo(id)
      .subscribe(() => this.todos = this.todos.filter(todo => todo.id !== id));
  }

  onComplete(id: number) {
    this.todosService.completeTodo(id)
      .subscribe(todo => {
        this.todos.find(({ id: todoId }) => todoId === todo.id ).completed = true;
      });
  }
}

