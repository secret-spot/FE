import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

interface Guide {
  id: number;
  title: string;
  location: string;
  rating: number;
  keywords: string[];
  imageUrl: string;
}

@Component({
  selector: 'app-explore',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.scss']
})
export class ExploreComponent implements OnInit {
  searchQuery: string = '';
  searchResults: any[] = [];
  isSearching: boolean = false;
  guides: Guide[] = [];

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    // URL 파라미터에서 검색어 가져오기
    this.route.queryParams.subscribe(params => {
      if (params['q']) {
        this.searchQuery = params['q'];
        this.performSearch();
      }
    });

    // TODO: 백엔드에서 가이드 데이터 가져오기
    this.fetchGuides();
  }

  fetchGuides() {
    // 임시 데이터 (실제로는 API 호출로 대체)
    this.guides = [
      {
        id: 1,
        title: '서울 야경 명소',
        location: '서울',
        rating: 4.5,
        keywords: ['야경', '로맨틱', '데이트'],
        imageUrl: 'assets/images/beach.svg'
      },
      {
        id: 2,
        title: '맛있는 카페 투어',
        location: '서울',
        rating: 4.8,
        keywords: ['카페', '디저트', '브런치'],
        imageUrl: 'assets/images/beach.svg'
      },
      {
        id: 3,
        title: '한옥 마을 탐방',
        location: '경주',
        rating: 4.3,
        keywords: ['한옥', '전통', '문화'],
        imageUrl: 'assets/images/beach.svg'
      }
    ];
  }

  onSearch() {
    // 검색 버튼 클릭 시 URL 변경 및 검색 수행
    this.router.navigate(['/explore'], { 
      queryParams: { q: this.searchQuery },
      queryParamsHandling: 'merge'
    });
    this.performSearch();
  }

  performSearch() {
    if (!this.searchQuery.trim()) {
      this.isSearching = false;
      this.searchResults = [];
      return;
    }

    this.isSearching = true;
    
    // 임시 검색 결과 데이터 (실제로는 API 호출 등으로 대체)
    this.searchResults = [
      {
        id: 1,
        title: '서울 야경 명소',
        description: '서울의 아름다운 야경을 감상할 수 있는 명소들을 소개합니다.',
        imageUrl: 'assets/images/beach.svg',
        location: '서울'
      },
      {
        id: 2,
        title: '맛있는 카페 투어',
        description: '서울의 숨은 카페들을 찾아보는 투어 가이드입니다.',
        imageUrl: 'assets/images/beach.svg',
        location: '서울'
      },
      {
        id: 3,
        title: '한옥 마을 탐방',
        description: '전통 한옥의 아름다움을 느낄 수 있는 한옥 마을 투어입니다.',
        imageUrl: 'assets/images/beach.svg',
        location: '경주'
      }
    ].filter(item => 
      item.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }
} 