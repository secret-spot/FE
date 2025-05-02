import { Component } from '@angular/core';

@Component({
  selector: 'app-guide-page',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent {
  activeTab = 'guide';
  tags = ['여행지', '음식', '도시', '자연'];
}