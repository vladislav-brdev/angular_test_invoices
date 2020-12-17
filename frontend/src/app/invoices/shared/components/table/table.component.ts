import { Component, Input, OnInit } from '@angular/core';

export interface TableColumn {
  key: string;
  title: string;
}

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
  @Input() columns: TableColumn[] = [];
  @Input() rows: any[] = [];

  keysOf = Object.keys;

  constructor() { }

  ngOnInit(): void {
  }

}
