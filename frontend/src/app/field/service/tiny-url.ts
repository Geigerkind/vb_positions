import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class TinyUrl {
  constructor(private http: HttpClient) {}

  shorten(url: string): Observable<string> {
    return this.http.get("https://cdpt.in/shorten?url=" + encodeURI(url), {
      responseType: "text",
    });
  }
}
