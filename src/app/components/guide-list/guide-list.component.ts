import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-guide-list',
  templateUrl: './guide-list.component.html',
  styleUrls: ['./guide-list.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class GuideListComponent {
  @Input() title: string = '';
  @Input() guides: any[] = [];

  @Output() clickGuide = new EventEmitter<number>();

  onClickGuide(id: number) {
    this.clickGuide.emit(id);
  }
}

