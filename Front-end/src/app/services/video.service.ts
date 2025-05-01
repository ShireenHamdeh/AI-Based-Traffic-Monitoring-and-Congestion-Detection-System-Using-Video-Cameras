import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VideoService {
  private apiUrl = 'http://127.0.0.1:5000/api/track'; // رابط الـ API

  constructor(private http: HttpClient) {}

  sendVideoUrl(videoUrl: string): Observable<any> {
    return this.http.post(this.apiUrl, { url: videoUrl });
  }
}
