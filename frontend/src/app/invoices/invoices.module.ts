import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvoicesComponent } from './invoices/invoices.component';
import { TableComponent } from './shared/components/table/table.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';



@NgModule({
  declarations: [InvoicesComponent, TableComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    BrowserModule
  ],
  bootstrap: [InvoicesComponent]
})
export class InvoicesModule { }
