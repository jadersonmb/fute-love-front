import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Users } from '../api/useres';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private url = 'http://localhost:8080/api/v1/users';

  constructor(private client: HttpClient) { }


  getAllUsers() : Observable<any> {
    return this.client.get(this.url);
  }

  createUsers(user: Users) : Observable<any> {
    return this.client.post(this.url, user);
  }

  updateUsers(user: Users) : Observable<any> {
    return this.client.put(this.url, user);
  }

  globalSearch(value: string) : Observable<any> {
    return this.client.get(this.url + '?name=' + value);
  }

}
