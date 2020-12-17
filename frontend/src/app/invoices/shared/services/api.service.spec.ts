import { HttpClient, HttpClientModule, HttpResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';


import { ApiService } from './api.service';

describe('ApiService', () => {
  let service: ApiService;
  const http: any = {};


  beforeEach(async () => {
    http.get = jest.fn();
    http.post = jest.fn();
    http.put = jest.fn();
    http.delete = jest.fn();
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule
      ],
      providers: [
        ApiService,
        {
          provide: HttpClient,
          useValue: http,
        }
      ]
    });
    service = TestBed.get(ApiService);
  });

  it('should be created', async (done: any) => {
    expect(service).toBeTruthy();

    done();
  });

  it('get', async (done: any) => {
    http.get.mockReturnValue(new Observable((observer) => {
      observer.next(new HttpResponse({ body: 1 }));
      observer.complete();
    }));
    const response = await service.get<number>('test');

    expect(http.get).toHaveBeenCalledWith(
      `${environment.APP_BASE_URL}/test`,
      { observe: 'response' }
    );
    expect(response.body).toBe(1);
    expect(response.status).toEqual(200);

    done();
  });

  it('post', async (done: any) => {
    http.post.mockReturnValue(new Observable((observer) => {
      observer.next(new HttpResponse({ body: { n: 1 }, status: 201 }));
      observer.complete();
    }));
    const response = await service.post<{ n: number }>('test', { n: 1 });

    expect(http.post).toHaveBeenCalledWith(
      `${environment.APP_BASE_URL}/test`,
      { n: 1 },
      { observe: 'response' }
    );
    expect(response.body).toEqual({ n: 1 });
    expect(response.status).toEqual(201);

    done();
  });

  it('put', async (done: any) => {
    http.put.mockReturnValue(new Observable((observer) => {
      observer.next(new HttpResponse({ body: { n: 1 } }));
      observer.complete();
    }));
    const response = await service.put<{ n: number }>('test', { n: 1 });

    expect(http.put).toHaveBeenCalledWith(
      `${environment.APP_BASE_URL}/test`,
      { n: 1 },
      { observe: 'response' }
    );
    expect(response.body).toEqual({ n: 1 });
    expect(response.status).toEqual(200);

    done();
  });

  it('delete', async (done: any) => {
    http.delete.mockReturnValue(new Observable((observer) => {
      observer.next(new HttpResponse({ body: 1 }));
      observer.complete();
    }));
    const response = await service.delete<1>('test');

    expect(http.delete).toHaveBeenCalledWith(
      `${environment.APP_BASE_URL}/test`,
      { observe: 'response' }
    );
    expect(response.body).toEqual(1);
    expect(response.status).toEqual(200);

    done();
  });

  it('reject withErrorHandling', async () => {
    const error = new Error('123');
    try {
      // @ts-ignore
      await service.withErrorHandling(new Observable((observer) => observer.error(error)));
      fail('Should reject');
    } catch (e) {
      expect(e).toEqual(error);
    }
  });
});
