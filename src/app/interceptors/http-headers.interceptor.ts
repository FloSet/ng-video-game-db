import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { finalize, Observable } from 'rxjs';
import { environment as env } from 'src/environments/environment';
import { LoadingService } from '../components/loading.service';

@Injectable()
export class HttpHeadersInterceptor implements HttpInterceptor {
  totalRequests: number = 0;
  completedRequests: number = 0;

  constructor(private loader: LoadingService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    req = req.clone({
      setHeaders: {
        'X-RapidAPI-Key': env.RAPID_API_KEY,
        'X-RapidAPI-Host': env.BASE_URL,
      },
      setParams: {
        key: env.RAWG_API_KEY,
      },
    });

    this.loader.show();
    this.totalRequests++;

    return next.handle(req).pipe(
      finalize(() => {
        this.completedRequests++;

        if (this.completedRequests === this.totalRequests) {
          this.loader.hide();
        }
      })
    );
  }
}
