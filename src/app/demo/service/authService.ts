import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  private apiUrl = 'http://localhost:8082/oauth2/token';
  private tokenKey = 'authToken';

  constructor(private http: HttpClient, private router: Router) {}

  login(username: string, password: string) {
    const headers = new HttpHeaders({
      Authorization: `Basic ${btoa(`${username}:${password}`)}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    const body = `grant_type=password&username=${username}&password=${password}`;

    return this.http.post(this.apiUrl, body, { headers });
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  setToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
  }
}
