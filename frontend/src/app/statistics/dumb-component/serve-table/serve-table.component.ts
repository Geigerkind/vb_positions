import { Component, Input, OnInit } from "@angular/core";
import { ColDef, ValueFormatterParams } from "ag-grid-community";
import { map, Observable } from "rxjs";
import { ServeStatisticByServeType, ServeStatistics } from "../../value/serveStatistics";
import { ServeType } from "../../value/serveType";

interface TableRow {
  player_name: string;
  serves_total: number;
  serve_type: ServeType;
  success: number;
  net: number;
  out: number;
  other: number;
  returned: number;
  part1: number;
  part2: number;
  part3: number;
  part4: number;
  part5: number;
  part6: number;
}

@Component({
  selector: "vpms-serve-table",
  templateUrl: "./serve-table.component.html",
  styleUrls: ["./serve-table.component.scss"],
})
export class ServeTableComponent implements OnInit {
  public columnDefs: ColDef[] = [
    {
      field: "player_name",
      headerName: "Player",
    },
    {
      field: "serve_type",
      headerName: "Serve type",
      valueFormatter: params => {
        switch (params.value) {
          case ServeType.UNDERHAND:
            return "Underhand";
          case ServeType.OVERHAND:
            return "Overhand";
          case ServeType.FLOATER:
            return "Floater";
          case ServeType.JUMP:
            return "Jump";
          case ServeType.JUMP_FLOATER:
            return "Jump floater";
        }
        return "?!?";
      },
    },
    {
      field: "success",
      headerName: "Successful",
      valueFormatter: (params: ValueFormatterParams<TableRow>) =>
        ((params.value / Math.max(params.data!.serves_total, 1)) * 100).toFixed(1) + "%",
    },
    {
      field: "returned",
      headerName: "Returned",
      valueFormatter: (params: ValueFormatterParams<TableRow>) =>
        ((params.value / Math.max(params.data!.success, 1)) * 100).toFixed(1) + "%",
    },
    {
      field: "part4",
      headerName: "Front left",
      valueFormatter: (params: ValueFormatterParams<TableRow>) =>
        ((params.value / Math.max(params.data!.success, 1)) * 100).toFixed(1) + "%",
    },
    {
      field: "part3",
      headerName: "Front center",
      valueFormatter: (params: ValueFormatterParams<TableRow>) =>
        ((params.value / Math.max(params.data!.success, 1)) * 100).toFixed(1) + "%",
    },
    {
      field: "part2",
      headerName: "Front right",
      valueFormatter: (params: ValueFormatterParams<TableRow>) =>
        ((params.value / Math.max(params.data!.success, 1)) * 100).toFixed(1) + "%",
    },
    {
      field: "part5",
      headerName: "Back left",
      valueFormatter: (params: ValueFormatterParams<TableRow>) =>
        ((params.value / Math.max(params.data!.success, 1)) * 100).toFixed(1) + "%",
    },
    {
      field: "part6",
      headerName: "Back center",
      valueFormatter: (params: ValueFormatterParams<TableRow>) =>
        ((params.value / Math.max(params.data!.success, 1)) * 100).toFixed(1) + "%",
    },
    {
      field: "part1",
      headerName: "Back right",
      valueFormatter: (params: ValueFormatterParams<TableRow>) =>
        ((params.value / Math.max(params.data!.success, 1)) * 100).toFixed(1) + "%",
    },
    {
      field: "net",
      headerName: "Net",
      valueFormatter: (params: ValueFormatterParams<TableRow>) =>
        ((params.value / Math.max(params.data!.serves_total, 1)) * 100).toFixed(1) + "%",
    },
    {
      field: "out",
      headerName: "Out",
      valueFormatter: (params: ValueFormatterParams<TableRow>) =>
        ((params.value / Math.max(params.data!.serves_total, 1)) * 100).toFixed(1) + "%",
    },
    {
      field: "other",
      headerName: "Other",
      valueFormatter: (params: ValueFormatterParams<TableRow>) =>
        ((params.value / Math.max(params.data!.serves_total, 1)) * 100).toFixed(1) + "%",
    },
  ];

  public defaultColDef: ColDef = {
    sortable: true,
    filter: true,
  };

  @Input() rowData$: Observable<ServeStatistics[]>;

  _rowData?: Observable<TableRow[]>;

  getRowData(): Observable<TableRow[]> | undefined {
    const toTableRow: (
      statistics: ServeStatistics,
      byType: ServeStatisticByServeType,
      serve_type: ServeType
    ) => TableRow = (statistics, byType, serve_type) => ({
      player_name: statistics.player_name,
      serves_total: byType.success + byType.net + byType.out + byType.other,
      serve_type: serve_type,
      success: byType.success,
      returned: byType.returned,
      net: byType.net,
      out: byType.out,
      other: byType.other,
      part1: byType.part1,
      part2: byType.part2,
      part3: byType.part3,
      part4: byType.part4,
      part5: byType.part5,
      part6: byType.part6,
    });

    return this.rowData$.pipe(
      map(serveStatistics =>
        serveStatistics.reduce((acc, item) => {
          acc.push(toTableRow(item, item.underhand, ServeType.UNDERHAND));
          acc.push(toTableRow(item, item.overhand, ServeType.OVERHAND));
          acc.push(toTableRow(item, item.floater, ServeType.FLOATER));
          acc.push(toTableRow(item, item.jump, ServeType.JUMP));
          acc.push(toTableRow(item, item.jump_floater, ServeType.JUMP_FLOATER));
          return acc;
        }, [] as TableRow[])
      )
    );
  }

  ngOnInit(): void {
    this._rowData = this.getRowData();
  }
}
