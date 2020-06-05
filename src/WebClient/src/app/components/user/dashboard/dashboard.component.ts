import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import { MessageService } from 'src/app/services/message.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public user: User;
  public editMode: boolean = false;
  public verifyChange: string;

  constructor(
    public messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService
  ) { }


  logout(): void {
    localStorage.removeItem('activeUser');
    this.messageService.clear();
    this.router.navigate(['../login'], { relativeTo: this.route });
  }


  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('activeUser'));
    this.messageService.clear();
  }


  saveChanges(): void {
    this.userService.saveChanges(this.user, this.verifyChange).subscribe(response => {
      this.messageService.clear();
      this.messageService.add('Profile Settings Saved!');
    },
      (error) => {
        this.messageService.clear();
        this.messageService.add('Failed To Save Settings!');
        console.error(error.error);
      });
    this.editMode = false;
  }


  toggleEditMode(): void {
    this.editMode = !this.editMode;
  }
}
