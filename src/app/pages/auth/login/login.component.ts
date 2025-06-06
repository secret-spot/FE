import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-login',
  imports: [ ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  nickname: string = '';

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private apiService: ApiService
  ) { }

  ngOnInit(): void {
    // only access localStorage in browser environment
    this.apiService.get<any>('users/username').subscribe((data) => {
      this.nickname = data.userName;
    });

    
  }

  goToHome() {
    window.location.href = `/home`;
  }
} 

