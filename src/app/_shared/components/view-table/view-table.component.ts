import {Component, OnInit, ViewChild} from '@angular/core';
import {IFilter} from "../filter/filter.component";
import {MatMenuTrigger} from "@angular/material/menu";
import {AuthorizationService, IInfoResponseItem} from "../../../core/services/authorization.service";


@Component({
  selector: 'app-view-table',
  templateUrl: './view-table.component.html',
  styleUrls: ['./view-table.component.scss']
})
export class ViewTableComponent implements OnInit {
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;

  isLoading: boolean = true;

  tableData: IInfoResponseItem[] = [];

  currentFilter: IFilter = null
  
  constructor(private _authService: AuthorizationService) {
  }

  ngOnInit(): void {
    this._getInfo();
  }

  private _getInfo(filters?: IFilter) {
    this.isLoading = true;
    this._authService.getInfo(filters || {})
      .subscribe(data => {
        this.isLoading = false;
        this.tableData = data.response;
      })
  }

  getFilteredData(filter: IFilter) {
    this.currentFilter = filter;
    this.trigger.closeMenu();
    this._getInfo(filter);
  }
}
