import {
  Component,
  OnInit,
  Input
} from '@angular/core';
import {
  AuthService
} from '../services/auth.service';
import { MatIconRegistry } from '@angular/material/icon';
import { UrlSanitizePipe } from '../pipes/url-sanitizer.pipe';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  userData: {
    displayName: string,
    uid: string
  };
  isLoggedIn = false;

  userId: string;
  userName: string;

  constructor(private matIconRegistery: MatIconRegistry, private urlSanitizer: UrlSanitizePipe, private authService: AuthService) {
    this.matIconRegistery.addSvgIcon('google', this.urlSanitizer.transform('assets/img/icon/google.svg'));

  }

  ngOnInit(): void {
    try {
      this.userData = JSON.parse(localStorage.getItem('user'));
      this.userName = this.userData.displayName;
      this.userId = this.userData.uid;

    } catch (error) {
      this.userId = '';
    }
    this.authService.isAuthenticated().then(
      (authenticated: boolean) => {
        this.isLoggedIn = authenticated;
      });
  }

  login(): void {
    this.authService.doGoogleLogin().then(
      userData => {
        this.userName = userData.user.displayName;
        this.isLoggedIn = true;
      });
  }

  logout(): void {
    this.authService.logout();
    this.isLoggedIn = false;
    this.userName = '';
  }

}
