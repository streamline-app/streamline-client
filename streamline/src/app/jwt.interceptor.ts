import { Injectable, Injector } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent} from "@angular/common/http";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    if (request.url.toString().includes('localhost:8080/')) {
      request = request.clone({
        setHeaders: {
          Authorization: 'Basic ' + btoa('user1:abc123'), 
        }
      });
      return next.handle(request);
    }
    if (this.auth.getToken()) {
        request = request.clone({
            setHeaders: {
              Authorization: `Bearer ${this.auth.getToken()}`
            }
        });
    }
    
    return next.handle(request);
  }
}