import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { VideoComponent } from './video/video.component';

export const routes: Routes = [
    { path: '', component: SignupComponent, title: 'chatbot-signup' },
    { path: 'login', component: LoginComponent, title: 'chatbot-login' },
    { path: 'signup', component: SignupComponent },
    { path: 'video',component: VideoComponent},
  ];
  