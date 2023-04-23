import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isLoggedIn: boolean = false;

  constructor(
    private authService: AuthService,
  ) {}

  ngOnInit() {
    // Check if user logged in
    this.isLoggedIn = this.authService.isLoggedIn();
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
