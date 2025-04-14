import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface SearchResult {
  name: string;
  address: string;
}

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class SearchComponent {
  searchQuery: string = '';
  searchResults: SearchResult[] = [];
  selectedLocation: SearchResult | null = null;

  constructor(private router: Router) {}

  onSearch(): void {
    // TODO: 실제 검색 API 연동
    this.searchResults = [
      { name: '여행지 1', address: '주소 1' },
      { name: '여행지 2', address: '주소 2' },
      { name: '여행지 3', address: '주소 3' }
    ];
  }

  selectLocation(location: SearchResult): void {
    this.selectedLocation = location;
  }

  onMapClick(): void {
    this.router.navigate(['/history/map']);
  }

  onNext(): void {
    // if (this.selectedLocation) {
    //   this.router.navigate(['/history/record']);
    // }
    this.router.navigate(['/history/record']);
  }
}
