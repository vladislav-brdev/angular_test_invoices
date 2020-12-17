import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ApiService } from './api.service';

export interface Invoice {
  total?: number;
  id: number;
  createdAt: string;
  Rows: Row[];
}

export interface Row {
  number: number;
  amount: number;
  dueDate: string;
  sellPrice: number;
}

export interface BodyData<T> {
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class InvoicesService {

  constructor(private apiService: ApiService) { }

  async get(): Promise<Invoice[]> {
    const invoices: HttpResponse<BodyData<Invoice[]>> = await this.apiService.get<BodyData<Invoice[]>>('');
    return invoices.body.data;
  }

  async uploadFile(file: File): Promise<Invoice> {
    const formData: FormData = new FormData();
    formData.append(environment.INVOICE_CSV_FILE_FIELD, file);
    const invoices: HttpResponse<BodyData<Invoice>> = await this.apiService.post<BodyData<Invoice>>('', formData);
    return invoices.body.data;
  }
}
