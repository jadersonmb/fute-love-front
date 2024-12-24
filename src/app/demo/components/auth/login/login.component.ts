import { Component, OnInit } from '@angular/core';

import { AuthService } from '../../../service/authService';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styles: [`
        :host ::ng-deep .pi-eye,
        :host ::ng-deep .pi-eye-slash {
            transform:scale(1.6);
            margin-right: 1rem;
            color: var(--primary-color) !important;
        }
    `]
})
export class LoginComponent implements OnInit {

    valCheck: string[] = ['remember'];

    private apiUrl = 'http://localhost:8082/oauth2/token';
    private tokenKey = 'authToken';
    password!: string;
    email!: string;

    constructor(private authService: AuthService, private router: Router, private http: HttpClient) {}

    ngOnInit() {
    }

    onLogin() {
        const headers = new HttpHeaders({
            Authorization: `Basic ${btoa(`${this.email}:${this.password}`)}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        });
        const body = `grant_type=client_credentials&scope=posts:write`;
      
        this.http.post(this.apiUrl, body, { headers }).subscribe({
            next: (response) => this.setToken(response['access_token']),
            error: (error) => console.error('Login failed:', error),
        });
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
        this.router.navigate(['/'])
    }
}
