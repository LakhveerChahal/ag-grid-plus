# AgGridPlus
An ag-grid based package providing extra features built on top of ag-grid community edition to unlock some paid enterprise features

# Unlocked features
1. Dynamic row height with lazy loading data from backend
(More features upcoming)


## Getting started
### Installation
```sh
$ npm install --save ag-grid-plus ag-grid-community ag-grid-angular
```

### Add a placeholder to HTML

```html
  <ag-grid-plus
    [deltaRows]="deltaRowData"
    [columnDefs]="columnDefs"
    [class]="'ag-theme-quartz'"
    (getRows)="getRowsAsync($event)"
    (sortChanged)="onSortChanged($event)"
    (onGridReady)="onGridReady($event)"
  >
  </ag-grid-plus>
```

### Import the grid component and styles in global styles file

```js
import { AgGridPlusComponent } from 'ag-grid-plus';

import 'ag-grid-community/styles//ag-grid.css';
import 'ag-grid-community/styles//ag-theme-quartz.css';
```

### Input parameters of AGGridPlusComponent

| Input parameter     | Info                |
| ------------------- | ----------------    |
|  colDef             | https://www.ag-grid.com/angular-data-grid/column-definitions/   |
|  rowHeight          | Default row height in pixels. |
|  deltaRows          | Paginated data to append in the ag-grid  |
|  rowBuffer          | The number of rows rendered outside the viewable area the grid renders. Having a buffer means the grid will have rows ready to show as the user slowly scrolls vertically. (Default: 10)  |
|  limit              | Pagination size (Default: 100 ) |
|  hasReachedEndOfData| Boolean input to inform the component to not request for further data as we have reached the end  |
|  clazz              | Ag grid theme to be used  |


### Output parameters of AGGridPlusComponent


| @Output parameter           | Info |
| --------------------|------------------|
|  getRows            | Emits when user scrolls to the bottom and hence grid requests for more data  |
|  sortChanged        | Emits when user clicks on any sortable header. Returns SortModelItem object  |
|  onGridReady        | Emits when grid becomes ready. Returns GridApi object  |


## Asking Questions

Feel free to ask any questions using Github [Issues] (https://github.com/LakhveerChahal/ag-grid-plus-workspace/issues)

## Github Repository

https://github.com/LakhveerChahal/ag-grid-plus-workspace/issues