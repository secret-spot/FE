import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

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
  userNickname: string = '사용자'; // 사용자 닉네임

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit(): void {
    // 브라우저 환경에서만 localStorage 접근
    if (isPlatformBrowser(this.platformId)) {
      this.userNickname = localStorage.getItem('username') || '사용자';
    }

    // 임의의 가이드 데이터 추가
    this.guides = [
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
    ];

    // 임의의 상위 spotter 데이터 추가
    this.topSpotters = [
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
    ];
  }
}
