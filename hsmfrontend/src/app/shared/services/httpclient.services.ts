import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
export const TOKEN_NAME = 'api_token';

@Injectable()
export class HttpClientExt {

    private accessToken: string = '';
    private headers: HttpHeaders = new HttpHeaders();

    constructor(
        private http: HttpClient) {
    }

    setAccessToken(access_token: string) {
        this.accessToken = access_token;
        localStorage.setItem(TOKEN_NAME, access_token);

        // Reset the header
        this.headers = new HttpHeaders({
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
        });
    }

    createBearerHeader() {
        let headers = new HttpHeaders();
        this.accessToken = localStorage.getItem('api_token');
        return headers.append('Authorization', 'Bearer ' + this.accessToken);
    }

    loadToken(): void {
        let token = localStorage.getItem(TOKEN_NAME);

        if(token && token.trim() !== '') {
            this.setAccessToken(token);
        }
    }

    removeToken(): void {
        this.accessToken = '';
        localStorage.removeItem(TOKEN_NAME);
    }

    get(url: string) {
        var headers = this.createBearerHeader();
        return this.http.get(url, {
            headers: headers
        });
    }

    post(url : string, data : any) {
        var headers = this.createBearerHeader();
        return this.http.post(url, data, {
            headers: headers
        });
    }

    put(url: string, data: any) {
        let headers = this.createBearerHeader();
        return this.http.put(url, data, {
            headers: headers
        });
    }

    delete(url: string) {
        let headers = this.createBearerHeader();
        return this.http.delete(url, {
            headers: headers
        });
    }
}