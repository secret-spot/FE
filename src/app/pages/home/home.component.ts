import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { forkJoin } from 'rxjs';
import { GuideListComponent } from '../../components/guide-list/guide-list.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, GuideListComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  recommandedGuides: any[] = []; // guide data array
  topSpotters: any[] = []; // top spotter data array
  popularSpots: any[] = []; // popular spot data array
  recentReviews: any[] = []; // recent review data array
  recommendedRegions: any[] = []; // recommended region data array
  userNickname: string = '닉네임'; // user nickname
  error: string | null = null;
  isLoading: boolean = true;
  userName: string = '';

  // fake data (used when API request fails)
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
    private router: Router,
    private apiService: ApiService
  ) { }

  ngOnInit(): void {
    this.userNickname = localStorage.getItem('username') || 'Nickname';
    this.fetchHomeData();
  }

  fetchHomeData() {
    this.isLoading = true;
    this.error = null;

    // execute 4 API requests simultaneously
    forkJoin({
      guides: this.apiService.get<any>('home'),
      topSpotters: this.apiService.get<any>('rankings/home'),
      username: this.apiService.get<any>('users/username')
    }).subscribe({
      next: (data) => {
        console.log(data);
        console.log(data.guides.recommande);
        this.recommandedGuides = data.guides.recommendedGuide;
        this.popularSpots = data.guides.latestGuide;
        this.topSpotters = data.topSpotters;
        this.recommendedRegions = data.guides.recommendedRegion;
        this.isLoading = false;
        this.userName = data.username.userName;
      },
      error: (err) => {
        console.error('Error fetching home data:', err);
        this.error = 'Error fetching data. Using fake data.';
        
        // use fake data
        this.recommandedGuides = this.mockData.guides;
        this.topSpotters = this.mockData.topSpotters;
        this.popularSpots = this.mockData.popularSpots;
        this.recentReviews = this.mockData.recentReviews;
        this.isLoading = false;
      }
    });
  }

  navigateToRanking() {
    this.router.navigate(['/ranking']);
  }

  navigateNothing(){
    
  }

  navigateToGuide(id: number) {
    this.router.navigate(['/post', id]);
  }
}
