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
  tempSearchQuery: string = ''; // Temporary search query for input
  searchResults: any[] = [];
  isSearching: boolean = false;
  guides: any[] = [];
  error: string | null = null;
  showSearchResults: boolean = false;
  isRegion: boolean = false;
  isPlace: boolean = false;
  etiquette: string='';
  recommendedPlaces: any[] = [];
  recommendedRegions: any[] = [];

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
        this.tempSearchQuery = params['q']; // Initialize temp search query
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
        console.error('Error occurred while fetching guide data:', err);
        this.error = 'An error occurred while fetching guide data.';
        this.isSearching = false;
      }
    });
  }

  onSearch() {
    this.searchQuery = this.tempSearchQuery; // Update actual search query
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
    
    this.apiService.get<any>(`search/guides?query=${encodeURIComponent(this.searchQuery)}`).subscribe({
      next: (data) => {
        console.log(data);
        this.guides = data.guides;
        this.isSearching = false;
        this.isRegion = data.isRegion;
        this.etiquette = data.etiquette;
        this.recommendedPlaces=data.recommendedPlaces;
        this.recommendedRegions=data.recommendedRegions;
        this.isPlace=data.isPlace;
      },
      error: (err) => {
        console.error('Error occurred during search:', err);
        this.error = 'An error occurred during search.';
        this.isSearching = false;
      }
    });
  }

  navigateToGuide(id: number) {
    this.router.navigate(['/post', id]);
  }
} 