import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { UserService } from '../../service/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isLoggedIn : boolean = false;
  user       : any;
  showSidebar: boolean = true;
  userId     : any;
  token      : any;

  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  ngOnInit() {
    // Check if user logged in
    this.isLoggedIn = this.authService.isLoggedIn();
    // Get elements of user from Local Storage
    if (this.isLoggedIn) {
      this.token = this.authService.getAuthToken();
      this.userId = this.authService.getDecryptedUserId();
    }
  }

  logout(event: Event) {
    event.preventDefault();

    if(confirm("Êtes-vous sûr de vouloir vous déconnecter ?")) {
      this.authService.logout();
      window.location.reload();
    }
  }
}
