import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isLoggedIn: boolean = false;
  userId: any;

  constructor(
    private authService: AuthService,
  ) {}

  ngOnInit() {
    // Check if user logged in
    this.isLoggedIn = this.authService.isLoggedIn();
    // Get elements of user from Local Storage
    if (this.isLoggedIn) {
      this.userId = this.authService.getDecryptedUserId();
    }
  }

  /**
  * Logout the user
  * @param event - The event object
  */
  logout(event: Event) {
    event.preventDefault();

    if(confirm("Êtes-vous sûr de vouloir vous déconnecter ?")) {
      this.authService.logout();
    }
  }
}
