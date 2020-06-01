import { Injectable } from '@angular/core';
import { UserService } from '../services/user.service';
import { LoginRequest } from '../models/user';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isLoggedIn: boolean;

  constructor(private userService: UserService, private router: Router) { }

  authenticateUser(user: LoginRequest): void {
    this.userService.getUser(user).subscribe( response => {
      if(response) { 
        this.isLoggedIn = true 
        return 
      } else {
        this.router.navigate(['/user/login']);
      }
    });
  }

  logout():void {
    this.isLoggedIn = false;
  }
}
