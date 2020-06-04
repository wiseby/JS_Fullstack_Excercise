import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginRequest, User, ChangeUserRequest } from '../models/user';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {


  private readonly loginUrl = environment.apiUrl + '/user/login';
  private readonly userRegisterURL = environment.apiUrl + '/user/register';
  private readonly userUrl = environment.apiUrl + '/user';


  private readonly httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    observe: 'response' as const
  };


  constructor(private httpClient: HttpClient) { }

  
  login(user: LoginRequest): Observable<HttpResponse<any>> {
    return this.httpClient.post<any>(this.loginUrl, user, this.httpOptions);
  }


  register(user: LoginRequest): Observable<HttpResponse<any>> {
    return this.httpClient.post<any>(this.userRegisterURL, user, this.httpOptions);
  }


  saveChanges(user: User, userPassword: string): Observable<HttpResponse<any>> {
    const data: ChangeUserRequest = {
      userData: user,
      password: userPassword
    };
    console.log(user);
    return this.httpClient.put<any>(this.userUrl, data, this.httpOptions);
  }
}
