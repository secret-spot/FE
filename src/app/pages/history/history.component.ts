import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CalendarComponent } from './calendar/calendar.component';
import { TravelRecordComponent } from './travel-record/travel-record.component';
import { SearchComponent } from './search/search.component';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule]
})
export class HistoryComponent {
  selectedDate: Date = new Date();

  onDateSelected(date: Date) {
    this.selectedDate = date;
  }
}
