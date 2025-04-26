import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  guides: any[] = []; // 가이드 데이터를 저장할 배열
  topSpotters: any[] = []; // 상위 spotter 데이터를 저장할 배열
  popularSpots: any[] = []; // 인기 장소 데이터를 저장할 배열
  recentReviews: any[] = []; // 최근 리뷰 데이터를 저장할 배열
  userNickname: string = '닉네임'; // 사용자 닉네임
  error: string | null = null;
  isLoading: boolean = true;

  // 가짜 데이터 (API 요청 실패 시 사용)
  mockData = {
    guides: [
      {
        id: 1,
        title: '힐링 카페 여행',
        description: '대한민국 인천',
        imageUrl: 'assets/images/beach.svg',
        keywords: ['야경', '도시', '로맨틱', '사진', '데이트']
      },
      {
        id: 2,
        title: '맛있는 카페 투어',
        description: '대한민국 전주',
        imageUrl: 'assets/images/beach.svg',
        keywords: ['야경', '도시', '로맨틱', '사진', '데이트']
      },
      {
        id: 3,
        title: '한옥 마을 탐방',
        description: '대한민국 전주',
        imageUrl: 'assets/images/beach.svg',
        keywords: ['야경', '도시', '로맨틱', '사진', '데이트']
      }
    ],
    topSpotters: [
      {
        id: 1,
        nickname: '서울탐험가',
        profileImage: 'assets/images/people.svg'
      },
      {
        id: 2,
        nickname: '카페러버',
        profileImage: 'assets/images/people.svg'
      },
      {
        id: 3,
        nickname: '맛집헌터',
        profileImage: 'assets/images/people.svg'
      },
      {
        id: 4,
        nickname: '여행작가',
        profileImage: 'assets/images/people.svg'
      }
    ],
    popularSpots: [
      {
        id: 1,
        name: '인천 차이나타운',
        location: '인천',
        imageUrl: 'assets/images/beach.svg',
        rating: 4.5
      },
      {
        id: 2,
        name: '전주 한옥마을',
        location: '전주',
        imageUrl: 'assets/images/beach.svg',
        rating: 4.8
      },
      {
        id: 3,
        name: '부산 감천문화마을',
        location: '부산',
        imageUrl: 'assets/images/beach.svg',
        rating: 4.7
      }
    ],
    recentReviews: [
      {
        id: 1,
        spotName: '인천 차이나타운',
        reviewer: '서울탐험가',
        content: '맛있는 음식과 독특한 문화를 경험할 수 있는 곳이에요!',
        rating: 5,
        date: '2023-04-20'
      },
      {
        id: 2,
        spotName: '전주 한옥마을',
        reviewer: '카페러버',
        content: '전통 문화를 느낄 수 있는 아름다운 곳입니다.',
        rating: 4,
        date: '2023-04-18'
      },
      {
        id: 3,
        spotName: '부산 감천문화마을',
        reviewer: '맛집헌터',
        content: '색다른 경험을 할 수 있는 특별한 장소입니다.',
        rating: 5,
        date: '2023-04-15'
      }
    ]
  };

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private apiService: ApiService
  ) { }

  ngOnInit(): void {
    // 브라우저 환경에서만 localStorage 접근
    if (isPlatformBrowser(this.platformId)) {
      this.userNickname = localStorage.getItem('username') || '닉네임';
    }

    this.fetchHomeData();
  }

  fetchHomeData() {
    this.isLoading = true;
    this.error = null;

    // 4개의 API 요청을 동시에 실행
    forkJoin({
      guides: this.apiService.get<any>('home'),
      topSpotters: this.apiService.get<any>('rankings/home'),
    }).subscribe({
      next: (data) => {
        console.log(data);
        this.guides = data.guides.recommandedGuide;
        this.popularSpots = data.guides.latestGuide;
        this.topSpotters = data.topSpotters;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('홈 데이터를 가져오는 중 오류 발생:', err);
        this.error = '데이터를 가져오는 중 오류가 발생했습니다. 가짜 데이터를 사용합니다.';
        
        // 가짜 데이터 사용
        this.guides = this.mockData.guides;
        this.topSpotters = this.mockData.topSpotters;
        this.popularSpots = this.mockData.popularSpots;
        this.recentReviews = this.mockData.recentReviews;
        this.isLoading = false;
      }
    });
  }
}
