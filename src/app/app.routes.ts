import { Routes } from '@angular/router';
import { SplashComponent } from './pages/splash/splash.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { HomeComponent } from './pages/home/home.component';
import { ExploreComponent } from './pages/explore/explore.component';
import { HistoryComponent } from './pages/history/history.component';
import { ChatbotComponent } from './pages/chatbot/chatbot.component';
import { MyPageComponent } from './pages/mypage/mypage.component';
import { CalendarComponent } from './pages/history/calendar/calendar.component';
import { SearchComponent } from './pages/history/search/search.component';
import { TravelRecordComponent } from './pages/history/travel-record/travel-record.component';
import { MapComponent } from './pages/history/map/map.component';
import { SummaryComponent } from './pages/history/summary/summary.component';
import { LoadingComponent } from './pages/history/loading/loading.component';
import { OAuthCallbackComponent } from './pages/auth/oauth-callback/oauth-callback.component';
import { RankingComponent } from './pages/ranking/ranking.component';
import { PostComponent } from './pages/post/post.component';
import { EditReviewComponent } from './pages/post/edit-review/edit-review.component';
export const routes: Routes = [
  { path: '', redirectTo: 'splash', pathMatch: 'full' },
  { path: 'splash', component: SplashComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent },
  { path: 'explore', component: ExploreComponent },
  { 
    path: 'history', 
    component: HistoryComponent,
    children: [
      { path: '', component: CalendarComponent },
      { path: 'search', component: SearchComponent },
      { path: 'map', component: MapComponent },
      { path: 'record', component: TravelRecordComponent },
      { path: 'loading/:id', component: LoadingComponent },
      { path: 'summary/:id', component: SummaryComponent }
    ]
  },
  { path: 'chatbot', component: ChatbotComponent },
  { path: 'mypage', component: MyPageComponent },
  { path: 'guide', component: MyPageComponent },
  { path: 'oauth2/redirect', component: OAuthCallbackComponent },
  { path: 'ranking', component: RankingComponent },
  { path: 'post/:id', component: PostComponent },
  { path: 'post/:id/review', component: EditReviewComponent }
];
