import { Component } from '@angular/core';
import { IHeaderAngularComp } from 'ag-grid-angular';
import { IHeaderParams, SortModelItem } from 'ag-grid-community';
import { Subject, Subscription } from 'rxjs';

@Component({
    selector: 'ag-grid-plus-header',
    templateUrl: './ag-grid-plus-header.component.html',
    styleUrls: ['ag-grid-plus-header.component.less']
})
export class AGGridPlusHeaderComponent implements IHeaderAngularComp {
    headerName: string = '';
    params!: IHeaderParams;
    sortChangedEvent!: Subject<SortModelItem>;
    sortOrder: 'asc' | 'desc' | 'none' = 'asc';
    subscription = new Subscription();

    agInit(params: IHeaderParams): void {
        this.params = params;
        this.headerName = params.displayName;
        if(params.column.getColDef().sortable) {
            this.sortChangedEvent = (<Subject<SortModelItem>>params.column.getColDef().headerComponentParams.onSortChanged);
            this.listenToSortChangeEvent();
        }
    }

    refresh(params: IHeaderParams): boolean {
        return true;
    }

    onSortChanged(): void {
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';

        this.sortChangedEvent.next({
            colId: this.params.column.getColId(),
            sort: this.sortOrder
        });
    }
    
    listenToSortChangeEvent(): void {
        this.subscription.add(
            this.sortChangedEvent.subscribe((sortModel: SortModelItem) => {
                // write logic to reset sort order if column is different from the one on which sort is being performed
                this.sortOrder = this.params.column.getColId() !== sortModel.colId ? 'none' : this.sortOrder;
            })
        );
    }
    
    /** 
     * Gets invoked when column is not present in DOM anymore.
     * Any cleanup activity can be done here.
     */
    destroy(): void {
        this.subscription.unsubscribe();
    }

}