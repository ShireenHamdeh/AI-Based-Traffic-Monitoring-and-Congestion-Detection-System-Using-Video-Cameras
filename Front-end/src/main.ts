import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
bootstrapApplication(AppComponent, {
  providers: [ provideHttpClient(),provideRouter(routes),provideFirebaseApp(() => 
    initializeApp({"apiKey": "AIzaSyAaEZAtl-qxV4zD3phVoWjnGJCljSddDTI",
"authDomain": "traffic-project-1f90d.firebaseapp.com",
"databaseURL": "https://traffic-project-1f90d-default-rtdb.firebaseio.com",
"projectId": "traffic-project-1f90d",
"storageBucket": "traffic-project-1f90d.firebasestorage.app",
"messagingSenderId": "156961443248",
"appId": "1:156961443248:web:05a6d35520aab038db1a75",
"measurementId": "G-8C5PTPL1SQ"})), provideAuth(() => getAuth()), provideFirestore(() => getFirestore()), provideDatabase(() => getDatabase())]
}).catch((err) => console.error(err));





