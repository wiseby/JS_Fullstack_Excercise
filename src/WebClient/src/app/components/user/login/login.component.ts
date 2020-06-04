import { Component, OnInit } from '@angular/core';
import { LoginRequest, User } from '../../../models/user';
import { UserService } from '../../../services/user.service';
import { MessageService } from 'src/app/services/message.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    private userService: UserService, 
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute
    ) { }

  user: LoginRequest = {
    name: "",
    password: ""
  };

  activeUser: User;

  onLogin(): void {

    this.userService.login(this.user).subscribe(response => {
      console.log(response);
      localStorage.setItem('activeUser', JSON.stringify(response.body));
      console.log(localStorage.getItem('activeUser'));
      this.router.navigate(['../dashboard'], {relativeTo: this.route});
    },
    (error) => {
      this.messageService.clear();
      this.messageService.add(error.error.message);
      this.messageService.add('Register today to get our awesome newsletter!');
    });
  }


  ngOnInit(): void {
  }

}
