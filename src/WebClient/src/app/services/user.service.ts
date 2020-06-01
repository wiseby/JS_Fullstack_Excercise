import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { LoginRequest, User } from '../models/user';
import { environment } from '../../environments/environment';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly userLoginUrl = environment.apiUrl + '/user/login';
  private readonly adminLoginUrl = environment.apiUrl + '/admin';

  httpOptions = {
    headers: new HttpHeaders ({
    'Content-Type': 'application/json'
  })
  };

  constructor(private httpClient: HttpClient, private messageService: MessageService) { }

  getUser(user: LoginRequest): Observable<User> {
    return this.httpClient.post<User>(this.userLoginUrl, user, this.httpOptions)
      .pipe(
        catchError(this.handleError<User>('getUser', null))
      );
  }

 /**
 * Handle Http operation that failed.
 * Let the app continue.
 * @param operation - name of the operation that failed
 * @param result - optional value to return as the observable result
 */
private handleError<T>(operation = 'operation', result?: T) {
  return (error: any): Observable<T> => {

    // TODO: send the error to remote logging infrastructure
    console.error(error); // log to console instead
    this.messageService.add(operation + error);

    // Let the app keep running by returning an empty result.
    return of(result as T);
  };
}
}
