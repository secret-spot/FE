import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Place } from '../../../services/place.service';

@Component({
  selector: 'app-guide-tab',
  templateUrl: './guide-tab.component.html',
  styleUrls: ['./guide-tab.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class GuideTabComponent {
  @Input() content: string = ''
  @Input() places: Place[] = [];
}
