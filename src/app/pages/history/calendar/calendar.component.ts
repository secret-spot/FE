import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class CalendarComponent {
  @Output() dateSelected = new EventEmitter<Date>();
  
  selectedDate: Date = new Date();

  constructor(private router: Router) {}

  onDateSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input && input.value) {
      const date = new Date(input.value);
      this.selectedDate = date;
      this.dateSelected.emit(date);
    }
  }

  onNext(): void {
    this.router.navigate(['/history/search']);
  }
}
