import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment as env } from 'src/environments/environment';

@Injectable()
export class HttpHeadersInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    req = req.clone({
      setHeaders: {
        'X-RapidAPI-Key': env.RAPID_API_KEY,
        'X-RapidAPI-Host': env.BASE_URL,
        'User-Agent': 'ng-video-game-db',
      },
      setParams: {
        key: env.RAWG_API_KEY
      }
    });

    return next.handle(req);
  }
}
