import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {map, Observable} from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class TinyUrl {
  private headers = new HttpHeaders({'Content-Type': 'application/json'});

  constructor(private http: HttpClient) {
  }

  shorten(url: string): Observable<string> {
    return this.http.post('https://abbrefy.xyz/api/v1/url/abbrefy', {
      url: url
    }, {
      headers: this.headers,
      responseType: 'json'
    }).pipe(
      map((data: any) => data)
    );
  }
}
