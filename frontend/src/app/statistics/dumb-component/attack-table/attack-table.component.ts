import { Component, Input } from "@angular/core";
import { ColDef, ValueFormatterParams } from "ag-grid-community";
import { Observable } from "rxjs";
import { AttackStatistics } from "../../value/attackStatistics";

@Component({
  selector: "vpms-attack-table",
  templateUrl: "./attack-table.component.html",
  styleUrls: ["./attack-table.component.scss"],
})
export class AttackTableComponent {
  public columnDefs: ColDef[] = [
    {
      field: "player_name",
      headerName: "Player",
    },
    {
      field: "attacks_success",
      headerName: "% Success",
      valueFormatter: (params: ValueFormatterParams<AttackStatistics>) =>
        ((params.value / Math.max(params.data!.attacks_total, 1)) * 100).toFixed(1) + "%",
    },
    {
      field: "attacks_returned",
      headerName: "% Returned",
      valueFormatter: (params: ValueFormatterParams<AttackStatistics>) =>
        ((params.value / Math.max(params.data!.attacks_success, 1)) * 100).toFixed(1) + "%",
    },
    {
      field: "attacks_blocked",
      headerName: "% Blocked",
      valueFormatter: (params: ValueFormatterParams<AttackStatistics>) =>
        ((params.value / Math.max(params.data!.attacks_total, 1)) * 100).toFixed(1) + "%",
    },
    {
      field: "attacks_failed",
      headerName: "% Failed",
      valueFormatter: (params: ValueFormatterParams<AttackStatistics>) =>
        ((params.value / Math.max(params.data!.attacks_total, 1)) * 100).toFixed(1) + "%",
    },
    {
      field: "front_left",
      headerName: "% Front left",
      valueFormatter: (params: ValueFormatterParams<AttackStatistics>) =>
        ((params.value / Math.max(params.data!.attacks_success, 1)) * 100).toFixed(1) + "%",
    },
    {
      field: "front_center",
      headerName: "% Front center",
      valueFormatter: (params: ValueFormatterParams<AttackStatistics>) =>
        ((params.value / Math.max(params.data!.attacks_success, 1)) * 100).toFixed(1) + "%",
    },
    {
      field: "front_right",
      headerName: "% Front right",
      valueFormatter: (params: ValueFormatterParams<AttackStatistics>) =>
        ((params.value / Math.max(params.data!.attacks_success, 1)) * 100).toFixed(1) + "%",
    },
    {
      field: "back_left",
      headerName: "% Back left",
      valueFormatter: (params: ValueFormatterParams<AttackStatistics>) =>
        ((params.value / Math.max(params.data!.attacks_success, 1)) * 100).toFixed(1) + "%",
    },
    {
      field: "back_center",
      headerName: "% Back center",
      valueFormatter: (params: ValueFormatterParams<AttackStatistics>) =>
        ((params.value / Math.max(params.data!.attacks_success, 1)) * 100).toFixed(1) + "%",
    },
    {
      field: "back_right",
      headerName: "% Back right",
      valueFormatter: (params: ValueFormatterParams<AttackStatistics>) =>
        ((params.value / Math.max(params.data!.attacks_success, 1)) * 100).toFixed(1) + "%",
    },
  ];

  public defaultColDef: ColDef = {
    sortable: true,
    filter: true,
  };

  @Input() rowData$: Observable<AttackStatistics[]>;
}
