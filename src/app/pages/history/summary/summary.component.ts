import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';

interface TravelSummary {
  startDate: string;
  endDate: string;
  keywords: string[];
  regions: string[];
  description: string;
}

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class SummaryComponent implements OnInit {
  summary: TravelSummary = {
    startDate: '',
    endDate: '',
    keywords: [],
    regions: [],
    description: ''
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    // TODO: connect actual data from service
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      console.error('ID does not exist.');
      return;
    }
    this.apiService.get<any>(`guides/${id}`).subscribe({
      next: (data) => {
        console.log(data);
        this.summary.keywords = data.keywords;
        this.summary.regions = data.regions.map((r: any) => `${r.country}, ${r.region}`);
        this.summary.startDate = data.startDate;
        this.summary.endDate = data.endDate;
        console.log(this.summary.regions)
      },
      error: (err) => {
        console.error('Error occurred while summarizing travel record:', err);
      }
    });

  }
  
  onPublish() {
    // TODO: call API to publish travel record and use the received ID

    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      console.error('ID does not exist.');
      return;
    }
    // navigate to guide page
    this.router.navigate(['/post', id]);
  }

  onBack(): void {
    this.router.navigate(['/history/record']);
  }
} 