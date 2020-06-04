import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { LoginRequest } from 'src/app/models/user';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  user: LoginRequest = {
    name: "",
    password: ""
  }


  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    public messageService: MessageService
  ) { }

  
  ngOnInit(): void {
    this.messageService.clear();
  }


  onRegisterClick(): void {
    this.userService.register(this.user).subscribe(response => {
      if (response.status === 200) {
        this.messageService.clear();
        this.messageService.add('Successfully registered user');
        this.router.navigate(['../login'], { relativeTo: this.route })
      } else {
        let message = JSON.stringify(response.body.message);
        console.error(
          `Backend returned code ${response.status}, ` +
          `body was: ${message}`);
        this.messageService.clear();
        this.messageService.add('Registration failed');
        this.messageService.add(JSON.stringify(message));
      }
    });
  }
}
