import { Component,Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-guide-tab',
  imports: [CommonModule],
  templateUrl: './guide-tab.component.html',
  styleUrl: './guide-tab.component.scss'
})
export class GuideTabComponent {
  @Input() content: string = '';
  @Input() places: any[] = [];
}
