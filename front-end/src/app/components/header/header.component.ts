import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isLoggedIn: boolean = false;
  user       : any;
  showSidebar: boolean = true;
  userId     : any;
  token      : any;

  constructor(
    private authService: AuthService,
  ) {}

  ngOnInit() {
    // Check if user logged in
    this.isLoggedIn = this.authService.isLoggedIn();
    // Get elements of user from Local Storage
    if (this.isLoggedIn === true) {
      this.userId = localStorage.getItem('userId');
      this.token  = localStorage.getItem('token');
    }
  }

  logout(event: Event) {
    event.preventDefault();

    if(confirm("Êtes-vous sûr de vouloir vous déconnecter ?")) {
      this.authService.logout();
      this.isLoggedIn  = false;
      window.location.reload();
    }
  }
}
