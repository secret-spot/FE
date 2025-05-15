import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-splash',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './splash.component.html',
  styleUrl: './splash.component.scss'
})
export class SplashComponent implements OnInit {
  showLoginButton = false;

  constructor(private router: Router) {}

  ngOnInit() {
    // show login button after 3 seconds
    setTimeout(() => {
      this.showLoginButton = true;
    }, 3000);
  }

  signInWithGoogle() {
    window.location.href = `https://s2-473964008323.us-central1.run.app/oauth2/authorization/google`;
  }
} 