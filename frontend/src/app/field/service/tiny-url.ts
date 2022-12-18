import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { map, Observable, of } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class TinyUrl {
  private headers = new HttpHeaders({
    "Content-Type": "application/json",
    "Authorization": "Bearer GMTjuO1F77wSxW1mLH19TTQr2kHLLZVAohLge90rnA8v0StURQVoYuAOKsmc",
  });

  constructor(private http: HttpClient) {}

  shorten(url: string): Observable<string> {
    return this.http
      .post(
        "https://api.tinyurl.com/create",
        {
          url: url,
          domain: "tinyurl.com",
        },
        {
          headers: this.headers,
          responseType: "json",
        }
      )
      .pipe(map((data: any) => data.data.tiny_url));
  }

  resolve(tinyurl: string): Observable<string> {
    if (!tinyurl.includes("tinyurl.com")) {
      return of();
    }
    const alias = tinyurl.split("tinyurl.com/")[1];
    return this.http
      .get(`https://api.tinyurl.com/alias/tinyurl.com/${alias}`, { headers: this.headers, responseType: "json" })
      .pipe(map((result: any) => result.data.url));
  }
}
