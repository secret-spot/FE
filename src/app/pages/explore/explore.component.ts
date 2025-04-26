import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';

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
  guides: any[] = [];
  error: string | null = null;
  showSearchResults: boolean = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private route: ActivatedRoute,
    private apiService: ApiService
  ) { }

  ngOnInit(): void {
    // URL 파라미터에서 검색어 가져오기
    this.route.queryParams.subscribe(params => {
      if (params['q']) {
        this.searchQuery = params['q'];
        this.performSearch();
      } else {
        this.fetchGuides();
      }
    });
  }

  fetchGuides() {
    this.isSearching = true;
    this.error = null;
    this.showSearchResults = false;
    
    this.apiService.get<any[]>('guides/hidden').subscribe({
      next: (data) => {
        this.guides = data;
        this.isSearching = false;
      },
      error: (err) => {
        console.error('가이드 데이터를 가져오는 중 오류 발생:', err);
        this.error = '가이드 데이터를 가져오는 중 오류가 발생했습니다.';
        this.isSearching = false;
      }
    });
  }

  onSearch() {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/explore'], { queryParams: { q: this.searchQuery } });
    } else {
      // 검색어가 없으면 기본 화면으로 이동
      this.router.navigate(['/explore']);
      this.showSearchResults = false;
      this.fetchGuides();
    }
  }

  performSearch() {
    if (!this.searchQuery.trim()) {
      this.fetchGuides();
      return;
    }

    this.isSearching = true;
    this.error = null;
    this.showSearchResults = true;
    
    this.apiService.get<any[]>(`guides/search?q=${encodeURIComponent(this.searchQuery)}`).subscribe({
      next: (data) => {
        this.searchResults = data;
        this.isSearching = false;
      },
      error: (err) => {
        console.error('검색 중 오류 발생:', err);
        this.error = '검색 중 오류가 발생했습니다.';
        this.isSearching = false;
      }
    });
  }
} 