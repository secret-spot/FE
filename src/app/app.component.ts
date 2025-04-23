import { Component } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { NavComponent } from './nav/nav.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'secret-spot';

  showNav = true;

  // 네비게이션 바를 숨길 페이지 목록
  private hideNavPages = [
    '/splash',
    '/login',
    '/register',
    '/history'
  ];

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event.constructor.name === 'NavigationEnd') {
        // 현재 URL이 hideNavPages 목록에 있는지 확인
        this.showNav = !this.hideNavPages.includes(this.router.url);

      }
    });
  }
}
