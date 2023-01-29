import { Component, Input } from "@angular/core";
import { ColDef, ValueFormatterParams } from "ag-grid-community";
import { Observable } from "rxjs";
import { ReceiveStatistics } from "../../value/receiveStatistics";

@Component({
  selector: "vpms-receive-table",
  templateUrl: "./receive-table.component.html",
  styleUrls: ["./receive-table.component.scss"],
})
export class ReceiveTableComponent {
  public columnDefs: ColDef[] = [
    {
      field: "player_name",
      headerName: "Player",
    },
    {
      field: "receives_that_connected",
      headerName: "Connected",
      valueFormatter: (params: ValueFormatterParams<ReceiveStatistics>) =>
        ((params.value / Math.max(params.data!.receives_total, 1)) * 100).toFixed(1) + "%",
    },
    {
      field: "receives_2m",
      headerName: "2m radius",
      valueFormatter: (params: ValueFormatterParams<ReceiveStatistics>) =>
        ((params.value / Math.max(params.data!.receives_total, 1)) * 100).toFixed(1) + "%",
    },
    {
      field: "receives_4_5m",
      headerName: "4.5m radius",
      valueFormatter: (params: ValueFormatterParams<ReceiveStatistics>) =>
        ((params.value / Math.max(params.data!.receives_total, 1)) * 100).toFixed(1) + "%",
    },
    {
      field: "receives_more_than_4_5m",
      headerName: "Outer radius",
      valueFormatter: (params: ValueFormatterParams<ReceiveStatistics>) =>
        ((params.value / Math.max(params.data!.receives_total, 1)) * 100).toFixed(1) + "%",
    },
  ];

  public defaultColDef: ColDef = {
    sortable: true,
    filter: true,
  };

  @Input() rowData$: Observable<ReceiveStatistics[]>;
}
