import {Injectable} from '@angular/core';
import {HttpClient, HttpEventType, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';

export interface ToDo {
  completed: boolean;
  title: string;
  id?: number;
}

@Injectable({
  providedIn: 'root'
})
export class TodosService {
  constructor(private http: HttpClient) {
  }

  addTodo(todo: ToDo): Observable<ToDo> {
    return this.http.post<ToDo>('https://jsonplaceholder.typicode.com/todos', todo, {
      headers: new HttpHeaders({
        HeyCustomService: Math.random().toString(),
      })
    });
  }

  fetchTodos(): Observable<ToDo[]> {
    const httpParams = new HttpParams()
      .append('_limit', '5')
      .append('_some', '5');

    return this.http.get<ToDo[]>('https://jsonplaceholder.typicode.com/todos', {
      params: httpParams,
      observe: 'response'
    })
      .pipe(
        tap(response => console.log(response)),
        map(response => response.body),
        catchError(error => {
          console.error(error);
          return throwError(error);
        })
      );
  }

  removeTodo(id: number): Observable<any> {
    return this.http.delete<void>(`https://jsonplaceholder.typicode.com/todos/${id}`, {
      observe: 'events'
    }).pipe(
        tap(value => {
          if (value.type === HttpEventType.Response) {
            console.log('Response');
          }

          if (value.type === HttpEventType.Sent) {
            console.log('Sent');
          }
        })
      );
  }

  completeTodo(id: number): Observable<ToDo> {
    return this.http.put<ToDo>(`https://jsonplaceholder.typicode.com/todos/${id}`, { completed: true });
  }
}
