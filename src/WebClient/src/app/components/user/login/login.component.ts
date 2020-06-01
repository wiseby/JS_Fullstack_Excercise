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

  user: LoginRequest;
  activeUser: User = null;

  onLogin(): void {
    this.userService.getUser(this.user).subscribe(response => {
      if (response) {
        localStorage.setItem('activeUser', JSON.stringify(response));
      } else {
        this.messageService.add('Register today to get our awesome newsletter!');
        this.router.navigate(['register']);
      }

    });
  }


  ngOnInit(): void {
  }

}
