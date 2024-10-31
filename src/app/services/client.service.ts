import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private apiUrl = 'http://localhost:8090/client/info';

  constructor(private http: HttpClient) { }

  getClientInfo(type: string, documentNumber: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?type=${type}&documentNumber=${documentNumber}`);
  }
}
