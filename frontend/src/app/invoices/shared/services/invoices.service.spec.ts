import { HttpResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { environment } from 'src/environments/environment';
import { ApiService } from './api.service';

import { InvoicesService } from './invoices.service';

describe('InvoicesService', () => {
  let service: InvoicesService;
  const apiService: any = {};

  beforeEach(async () => {
    apiService.get = jest.fn();
    apiService.post = jest.fn();

    await TestBed.configureTestingModule({
      providers: [
        InvoicesService,
        {
          provide: ApiService,
          useValue: apiService,
        }
      ]
    });
    service = TestBed.get(InvoicesService);
  });

  it('should be created', async () => {
    expect(service).toBeTruthy();
  });

  it('get', async (done: any) => {
    apiService.get.mockResolvedValue(new HttpResponse({ body: { data: [] } }));

    const response = await service.get();

    expect(apiService.get).toHaveBeenCalledWith('');
    expect(response).toEqual([]);

    done();
  });

  it('uploadFile', async (done: any) => {
    apiService.post.mockResolvedValue(new HttpResponse({
      body: {
        data: {
          total: 0,
          id: 0,
          createdAt: '',
          Rows: [],
        }
      }
    }));

    const file = new File([''], 'example.csv', { type: 'text/csv' });

    const response = await service.uploadFile(file);

    const formdata = new FormData();
    formdata.append(environment.INVOICE_CSV_FILE_FIELD, file);

    expect(apiService.post).toHaveBeenCalledWith('', formdata);
    expect(response).toEqual({
      total: 0,
      id: 0,
      createdAt: '',
      Rows: [],
    });

    done();
  });

});
