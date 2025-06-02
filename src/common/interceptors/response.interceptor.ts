import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  data: T;
  meta?: Record<string, any>;
}

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => {
        // Check if data already has the expected structure
        if (data && data.data !== undefined) {
          return data;
        }

        // If data is an array with a meta property (for pagination)
        if (data && Array.isArray(data.items) && data.meta) {
          return {
            data: data.items,
            meta: data.meta,
          };
        }

        // Default structure
        return {
          data,
        };
      }),
    );
  }
}
