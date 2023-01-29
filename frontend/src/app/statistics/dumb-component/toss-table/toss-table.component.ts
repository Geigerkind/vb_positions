import { Component, Input } from "@angular/core";
import { ColDef, ValueFormatterParams } from "ag-grid-community";
import { Observable } from "rxjs";
import { TossStatistics } from "../../value/tossStatistics";

@Component({
  selector: "vpms-toss-table",
  templateUrl: "./toss-table.component.html",
  styleUrls: ["./toss-table.component.scss"],
})
export class TossTableComponent {
  public columnDefs: ColDef[] = [
    {
      field: "player_name",
      headerName: "Player",
    },
    {
      field: "toss_set_total",
      headerName: "% Set",
      valueFormatter: (params: ValueFormatterParams<TossStatistics>) =>
        ((params.value / Math.max(params.data!.toss_total, 1)) * 100).toFixed(1) + "%",
    },
    {
      field: "failed",
      headerName: "% Failed",
      valueFormatter: (params: ValueFormatterParams<TossStatistics>) =>
        ((params.value / Math.max(params.data!.toss_total, 1)) * 100).toFixed(1) + "%",
    },
    {
      field: "front_left",
      headerName: "% Front left",
      valueFormatter: (params: ValueFormatterParams<TossStatistics>) =>
        ((params.value / Math.max(params.data!.toss_set_total, 1)) * 100).toFixed(1) + "%",
    },
    {
      field: "front_center",
      headerName: "% Front center",
      valueFormatter: (params: ValueFormatterParams<TossStatistics>) =>
        ((params.value / Math.max(params.data!.toss_set_total, 1)) * 100).toFixed(1) + "%",
    },
    {
      field: "front_right",
      headerName: "% Front right",
      valueFormatter: (params: ValueFormatterParams<TossStatistics>) =>
        ((params.value / Math.max(params.data!.toss_set_total, 1)) * 100).toFixed(1) + "%",
    },
    {
      field: "back_left",
      headerName: "% Back left",
      valueFormatter: (params: ValueFormatterParams<TossStatistics>) =>
        ((params.value / Math.max(params.data!.toss_set_total, 1)) * 100).toFixed(1) + "%",
    },
    {
      field: "back_center",
      headerName: "% Back center",
      valueFormatter: (params: ValueFormatterParams<TossStatistics>) =>
        ((params.value / Math.max(params.data!.toss_set_total, 1)) * 100).toFixed(1) + "%",
    },
    {
      field: "back_right",
      headerName: "% Back right",
      valueFormatter: (params: ValueFormatterParams<TossStatistics>) =>
        ((params.value / Math.max(params.data!.toss_set_total, 1)) * 100).toFixed(1) + "%",
    },
    {
      field: "success_toss_in_2m",
      headerName: "% Success from 2m radius",
      valueFormatter: (params: ValueFormatterParams<TossStatistics>) =>
        (
          (params.value /
            Math.max(
              params.data!.success_toss_in_2m +
                params.data!.success_toss_in_4_5m +
                params.data!.success_toss_in_more_than_4_5m,
              1
            )) *
          100
        ).toFixed(1) + "%",
    },
    {
      field: "success_toss_in_4_5m",
      headerName: "% Success from 4.5m radius",
      valueFormatter: (params: ValueFormatterParams<TossStatistics>) =>
        (
          (params.value /
            Math.max(
              params.data!.success_toss_in_2m +
                params.data!.success_toss_in_4_5m +
                params.data!.success_toss_in_more_than_4_5m,
              1
            )) *
          100
        ).toFixed(1) + "%",
    },
    {
      field: "success_toss_in_more_than_4_5m",
      headerName: "% Success from more than 4.5m radius",
      valueFormatter: (params: ValueFormatterParams<TossStatistics>) =>
        (
          (params.value /
            Math.max(
              params.data!.success_toss_in_2m +
                params.data!.success_toss_in_4_5m +
                params.data!.success_toss_in_more_than_4_5m,
              1
            )) *
          100
        ).toFixed(1) + "%",
    },
  ];

  public defaultColDef: ColDef = {
    sortable: true,
    filter: true,
  };

  @Input() rowData$: Observable<TossStatistics[]>;
}
