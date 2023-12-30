import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { ColDef, SortModelItem, GridApi, GridOptions, RowClassParams, BodyScrollEndEvent, GridReadyEvent, ICellRendererParams, RowNode, ValueGetterParams } from 'ag-grid-community';
import { Subject, Subscription } from 'rxjs';

@Component({
  selector: 'ag-grid-plus',
  standalone: true,
  imports: [],
  template: `
  <ag-grid-angular
    style="width: 100%; height: 100%"
    [class]="ag-theme-material"
    [gridOptions]="gridOptions"
    (gridReady)="onGridReady($event)"
  ></ag-grid-angular>
  `,
  styles: ``
})
export class AgGridPlusComponent {
  /****** INPUT *********/
  @Input('rowHeight') rowHeight: number = 48;
  @Input('colDef') colDef: ColDef[] = [];
  @Input('deltaRows') deltaRows: any[] = [];
  @Input('rowBuffer') rowBuffer: number = 10;
  @Input('limit') limit: number = 100;
  @Input('hasReachedEndOfData') hasReachedEndOfData: boolean = false;
  @Input('rowId') rowId: string = '';
  @Input('class') clazz: string = 'ag-theme-material';
  /*********************/

  /********OUTPUT*******/
  @Output('getRows') getRowsEmitter = new EventEmitter<number>();
  @Output('sortChanged') onSortChangedEmitter = new EventEmitter<SortModelItem>();
  @Output('onGridReady') onGridReadyEmitter = new EventEmitter<GridApi>();
  /*********************/

  
  gridOptions!: GridOptions;
  private gridApi!: GridApi;
  private rowStore: any[] = [];
  private sortChanged = new Subject<SortModelItem>();
  private subscription = new Subscription();
  
  constructor() {
    this.initializeGridOptions();
    this.listenToSortChangedEvent();
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['rowHeight']) {
      this.gridOptions = {
        ...this.gridOptions,
        rowHeight: this.rowHeight,
      }
    }

    if(changes['colDef']) {
      this.setColumnDefs();
    }

    if(changes['deltaRows']) {
      this.appendRows(this.deltaRows);
    }

    if(changes['rowBuffer']) {
      this.gridOptions = {
        ...this.gridOptions,
        rowBuffer: this.rowBuffer
      }
    }

    if(changes['rowId'] && this.rowId) {
      this.gridOptions = {
        ...this.gridOptions,
        getRowId: () => { return this.rowId; }
      }
    }
  }

  initializeGridOptions(): void {
    this.gridOptions = {
      rowModelType: 'clientSide',
      context: {
        componentParent: this
      },
      rowHeight: this.rowHeight,
      columnDefs: this.colDef,
      rowBuffer: this.rowBuffer,
      onBodyScrollEnd: this.onBodyScrollEnd.bind(this),
    }
  }
  
  onBodyScrollEnd(event: BodyScrollEndEvent): void {
    if(event.direction === 'vertical' && this.hasReachedEnd() && !this.hasReachedEndOfData) {
      this.emitGetRows();
    }
  }

  hasReachedEnd(): boolean {
    return this.gridApi.getLastDisplayedRow() == this.rowStore.length - 1;
  }

  setColumnDefs(): void {
    this.colDef.forEach((colDef: ColDef) => {
      // attach sortChanged Subject to sortable columns for custom sorting
      if(colDef.sortable) {
        colDef.headerComponentParams = {
          ...colDef.headerComponentParams,
          onSortChanged: this.sortChanged,
        };
      }
      colDef.sortable = false;
    });

    this.gridOptions = {
      ...this.gridOptions,
      columnDefs: this.colDef
    }
  }

  appendRows(rows: any[]): void {
    this.rowStore.push(...rows);

    if(!this.gridApi) {
      // grid is in initialization phase, so set rows via gridoptions
      this.gridOptions = {
        ...this.gridOptions,
        rowData: rows
      }
      return;
    }

    // grid has initialized already, we can use gridApi to add delta rows
    this.gridApi.applyTransaction({
      add: rows,
      addIndex: this.rowStore.length
    });
  }

  clearGridData(): void {
    this.gridApi?.setRowData([]);
    this.rowStore = [];
    this.deltaRows = [];
  }

  emitGetRows(): void {
    this.getRowsEmitter.emit(this.rowStore.length);
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.onGridReadyEmitter.emit(this.gridApi);
  }

  listenToSortChangedEvent(): void {
    this.subscription.add(
      this.sortChanged.subscribe((sortModelItem: SortModelItem) => {
        this.clearGridData();
        this.onSortChangedEmitter.emit(sortModelItem);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
