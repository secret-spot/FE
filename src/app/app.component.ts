import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { NavComponent } from './nav/nav.component';
import { CommonModule } from '@angular/common';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'secret-spot';

  showNav = true;

  // pages to hide navigation bar
  private hideNavPages = [
    '/splash',
    '/login',
    '/register',
    '/history',
    '/history/*',
    '/post/*',
    '/ranking'
     // all paths under history
  ];

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // check if current URL is in hideNavPages list
        this.showNav = !this.hideNavPages.some(page => {
          if (page.endsWith('/*')) {
            // handle wildcard pattern
            const basePath = page.slice(0, -1); // remove '*'
            return this.router.url.startsWith(basePath);
          }
          return this.router.url === page;
        });
      }
    });
  }

  ngOnInit() {
    // Make environment variables globally available
    (window as any).environment = environment;
  }
}
