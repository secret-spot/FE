import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-mypage',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mypage.component.html',
  styleUrls: ['./mypage.component.scss']
})
export class MyPageComponent implements OnInit {
  userProfile: any = null;
  error: string | null = null;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private route: ActivatedRoute,
    private apiService: ApiService
  ) { }

  ngOnInit(): void {
    this.fetchUserProfile();
  }

  fetchUserProfile() {
    this.error = null;
    
    this.apiService.get<any[]>('rankings').subscribe({
      next: (data) => {
        this.userProfile = data;
        console.log(data);
      },
      error: (err) => {
        console.error('프로필 데이터를 가져오는 중 오류 발생:', err);
        this.error = '프로필 데이터를 가져오는 중 오류가 발생했습니다.';
      }
    });
  }
}