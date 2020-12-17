import { Component, OnInit } from '@angular/core';
import { TableColumn } from '../shared/components/table/table.component';
import { Invoice, InvoicesService } from '../shared/services/invoices.service';

interface ResponseError {
  message: string;
  errorList: Array<{
    field: string;
    isValid: boolean
  }>;
  number: number;
  amount: number;
  dueDate: string;
}

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.scss']
})
export class InvoicesComponent implements OnInit {
  invoices: Invoice[] = [];
  columns: TableColumn[] = [];
  rows: any[][] = [];
  errors: ResponseError[] = [];
  constructor(private invoicesService: InvoicesService) { }

  ngOnInit(): void {
    this.getInvoices();
    this.columns = [
      {
        key: 'number',
        title: 'ID'
      },
      {
        key: 'sellPrice',
        title: 'Sell Price'
      },
      {
        key: 'amount',
        title: 'Amount'
      },
      {
        key: 'dueDate',
        title: 'Date created'
      },
    ];
  }

  async getInvoices(): Promise<void> {
    this.invoices = await this.invoicesService.get();
  }

  async uploadCsv(e): Promise<void> {
    try {
      const invoice = await this.invoicesService.uploadFile(e.target.files[0]);
      this.invoices.push(invoice);
      this.errors = [];
    } catch (e) {
      e.error.forEach(error => {
        const errorObj = {
          errorList: error.errors.filter(item => !item.isValid),
          number: error.number,
          message: e.statusText,
          amount: error.amount,
          dueDate: error.dueDate
        };
        this.errors.push(errorObj);
      });

      setTimeout(() => {
        this.errors = [];
      }, 5000);
    }
  }
}
