import { Component, OnInit } from '@angular/core';
import { LoginRequest, User } from '../../../models/user';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private userService: UserService) { }

  user: LoginRequest;
  activeUser: User = null;

  onLogin(): void {
    console.log('onLogin kördes');
    this.userService.getUser(this.user).subscribe(response => {
      this.activeUser = response;
    });
  }


  ngOnInit(): void {
  }

}
