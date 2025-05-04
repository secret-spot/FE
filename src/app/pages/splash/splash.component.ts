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
    // 3초 후에 로그인 버튼 표시
    setTimeout(() => {
      this.showLoginButton = true;
    }, 3000);
  }

  signInWithGoogle() {
    window.location.href = `https://s2-5nwgikdioa-du.a.run.app/oauth2/authorization/google`;
  }
} 