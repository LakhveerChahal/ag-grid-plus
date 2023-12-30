import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ColDef, GridApi, SortModelItem } from 'ag-grid-community';
import { of, delay } from 'rxjs';
import { AgGridPlusComponent } from 'ag-grid-plus';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, AgGridPlusComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.less'
})
export class AppComponent {
  deltaRowData: any[] = [];
  colDef: ColDef[] = [];
  limit: number = 50;
  gridApi!: GridApi;

  constructor() { }

  ngOnInit(): void {
    this.initializeColDefs();
    this.getRowsAsync(0);
  }

  initializeColDefs(): void {
    this.colDef = [
      {
        headerName: "Car brand",
        field: "carBrand",
        sortable: true,
      },
      {
        headerName: "Model",
        field: "model",
        sortable: true,
      },
      {
        headerName: "Type",
        field: "type",
        sortable: true,
      },
    ]
  }

  addRows(limit: number, offset: number): any[] {
    const rows = [];
    for (let index = offset; index < offset + limit; index++) {
      const row = {
        carBrand: "Brand " + index,
        model: 'Model' + index,
        type: "Sports",
      };
      rows.push(row);
    }

    return rows;
  }

  getRowsAsync(offset: number): void {
    of(this.getRows(offset))
      .pipe(delay(3000))
      .subscribe((res) => {
        this.deltaRowData = res;
      })
  }

  getRows(offset: number): any[]{
    return this.addRows(this.limit, offset);
  }

  onSortChanged(sortModel: SortModelItem): void {
    // reload data based on the sort model
    console.log(sortModel);
    this.addRows(this.limit, 0);
  }

  onGridReady(gridApi: GridApi): void {
    this.gridApi = gridApi;
  }
}
