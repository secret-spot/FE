import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { GuideListComponent } from '../../components/guide-list/guide-list.component';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-mypage',
  standalone: true,
  imports: [CommonModule, FormsModule, GuideListComponent],
  templateUrl: './mypage.component.html',
  styleUrls: ['./mypage.component.scss']
})
export class MyPageComponent implements OnInit {
  userProfile: any = null;
  userKeywords: any=null;
  userScraps: any[]=[];
  userGuides: any[]=[];
  userReviews: any[]=[];
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

    forkJoin([
      this.apiService.get<any>('mypage/profile'),
      this.apiService.get<any>('mypage/scraps/card')
    ]).subscribe({
      next: ([profile, scraps]) => {
        this.userProfile = profile;
        this.userKeywords = profile.keyword;
        this.userGuides = profile.userGuides;
        this.userReviews = profile.userReviews;
        this.userScraps = scraps;
        console.log(this.userScraps);
        console.log(this.userGuides);
        console.log(this.userReviews);
      },
      error: (err) => {
        console.error('프로필 데이터를 가져오는 중 오류 발생:', err);
        this.error = '프로필 데이터를 가져오는 중 오류가 발생했습니다.';
      }
    });
    }
  navigateToGuide(id: number) {
    this.router.navigate(['/post', id]);
  }
}
  

