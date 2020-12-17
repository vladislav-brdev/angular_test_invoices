import { ComponentFixture, TestBed } from '@angular/core/testing';
import { serializePath } from '@angular/router/src/url_tree';
import { TableComponent } from '../shared/components/table/table.component';
import { InvoicesService } from '../shared/services/invoices.service';

import { InvoicesComponent } from './invoices.component';

describe('InvoicesComponent', () => {
  let component: InvoicesComponent;
  let fixture: ComponentFixture<InvoicesComponent>;
  const invoicesService: any = {};

  beforeEach(async () => {
    invoicesService.get = jest.fn();
    invoicesService.uploadFile = jest.fn();

    await TestBed.configureTestingModule({
      declarations: [ InvoicesComponent, TableComponent ],
      providers: [
        {
          provide: InvoicesService,
          useValue: invoicesService,
        }
      ]
    })
    .compileComponents();
  });

  beforeEach(async () => {
    fixture = TestBed.createComponent(InvoicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', async () => {
    expect(component).toBeTruthy();
  });

  it('getInvoices', async (done: any) => {
    invoicesService.get.mockResolvedValue([]);

    await component.getInvoices();

    expect(invoicesService.get).toHaveBeenCalledWith();
    expect(component.invoices).toEqual([]);

    done();
  });

  it('reject uploadCsv', async (done) => {
    await invoicesService.uploadFile.mockRejectedValue({
      statusText: '123',
      error: [
        {
          errors: [{ isValid: false, field: 'asdf' }],
          number: 1,
          amount: 1,
          dueDate: 'date'
        }
      ]
    });

    await component.uploadCsv({ target: { files: [1] }});

    expect(component.errors).toEqual([{
      errorList: [{ isValid: false, field: 'asdf' }],
      number: 1,
      message: '123',
      amount: 1,
      dueDate: 'date'
    }]);

    setTimeout(() => {
      expect(component.errors).toEqual([]);
      done();
    }, 5500);
  });
});
