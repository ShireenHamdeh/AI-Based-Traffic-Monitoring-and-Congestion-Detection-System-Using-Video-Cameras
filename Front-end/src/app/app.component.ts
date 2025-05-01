import { Component } from '@angular/core';

import { RouterModule } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from "./login/login.component";
import { HttpClientModule } from '@angular/common/http';
import { VideoComponent } from './video/video.component';
@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
     imports: [SignupComponent, LoginComponent,RouterModule,RouterOutlet,HttpClientModule,VideoComponent]
})
export class AppComponent {
 
}
