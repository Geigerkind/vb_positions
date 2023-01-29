import { Component, Input } from "@angular/core";
import { ColDef, ValueFormatterParams } from "ag-grid-community";
import { Observable } from "rxjs";
import { BlockStatistics } from "../../value/blockStatistics";

@Component({
  selector: "vpms-block-table",
  templateUrl: "./block-table.component.html",
  styleUrls: ["./block-table.component.scss"],
})
export class BlockTableComponent {
  public columnDefs: ColDef[] = [
    {
      field: "player_name",
      headerName: "Player",
    },
    {
      field: "blocks_success",
      headerName: "% Success",
      valueFormatter: (params: ValueFormatterParams<BlockStatistics>) =>
        ((params.value / Math.max(params.data!.blocks_total, 1)) * 100).toFixed(1) + "%",
    },
    {
      field: "blocks_failed",
      headerName: "% Failed",
      valueFormatter: (params: ValueFormatterParams<BlockStatistics>) =>
        ((params.value / Math.max(params.data!.blocks_total, 1)) * 100).toFixed(1) + "%",
    },
    {
      field: "soft_blocks",
      headerName: "% Soft blocks",
      valueFormatter: (params: ValueFormatterParams<BlockStatistics>) =>
        ((params.value / Math.max(params.data!.blocks_success, 1)) * 100).toFixed(1) + "%",
    },
    {
      field: "kill_blocks",
      headerName: "% Kill blocks",
      valueFormatter: (params: ValueFormatterParams<BlockStatistics>) =>
        ((params.value / Math.max(params.data!.blocks_success, 1)) * 100).toFixed(1) + "%",
    },
  ];

  public defaultColDef: ColDef = {
    sortable: true,
    filter: true,
  };

  @Input() rowData$: Observable<BlockStatistics[]>;
}
