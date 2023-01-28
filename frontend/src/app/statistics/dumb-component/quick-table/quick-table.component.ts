import { Component, Input } from "@angular/core";
import { ColDef } from "ag-grid-community";
import { Observable } from "rxjs";
import { QuickStatistics } from "../../value/quickStatistics";

@Component({
  selector: "vpms-quick-table",
  templateUrl: "./quick-table.component.html",
  styleUrls: ["./quick-table.component.scss"],
})
export class QuickTableComponent {
  public columnDefs: ColDef[] = [
    {
      field: "player_name",
      headerName: "Player",
    },
    {
      field: "scored",
      headerName: "Scored",
    },
    {
      field: "failed_position",
      headerName: "Failed positioning",
    },
    {
      field: "failed_receive",
      headerName: "Failed receive",
    },
    {
      field: "failed_attack",
      headerName: "Failed attack",
    },
    {
      field: "failed_toss",
      headerName: "Failed toss",
    },
    {
      field: "failed_serve",
      headerName: "Failed serve",
    },
    {
      field: "failed_block",
      headerName: "Failed block",
    },
  ];

  public defaultColDef: ColDef = {
    sortable: true,
    filter: true,
  };

  @Input() rowData$: Observable<QuickStatistics[]>;
}
