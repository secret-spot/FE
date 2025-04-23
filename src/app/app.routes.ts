import { Routes } from '@angular/router';
import { SplashComponent } from './pages/splash/splash.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { HomeComponent } from './pages/home/home.component';
import { ExploreComponent } from './pages/explore/explore.component';
import { HistoryComponent } from './pages/history/history.component';
import { ChatbotComponent } from './pages/chatbot/chatbot.component';
import { MypageComponent } from './pages/mypage/mypage.component';
import { OAuthCallbackComponent } from './pages/auth/oauth-callback/oauth-callback.component';

export const routes: Routes = [
  { path: '', redirectTo: 'splash', pathMatch: 'full' },
  { path: 'splash', component: SplashComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent },
  { path: 'explore', component: ExploreComponent },
  { path: 'history', component: HistoryComponent },
  { path: 'chatbot', component: ChatbotComponent },
  { path: 'mypage', component: MypageComponent },
  { path: 'oauth2/redirect', component: OAuthCallbackComponent },
];
