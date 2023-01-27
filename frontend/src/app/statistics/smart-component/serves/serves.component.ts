import { Component, ViewChild } from "@angular/core";
import { StatisticsService } from "../../service/statistics.service";
import { FormGroup } from "@angular/forms";
import { CourtComponent } from "../../../field/dumb-component/court/court.component";
import { PositionGraph } from "../../graphs/PositionGraph";

@Component({
  selector: "vpms-serves",
  templateUrl: "./serves.component.html",
  styleUrls: ["./serves.component.scss"],
})
export class ServesComponent {
  @ViewChild("court", { static: false })
  private court: CourtComponent;

  formGroup: FormGroup;
  onCustomRender: () => void = () => {
    this.customRender();
  };

  private positionGraph: PositionGraph;
  private context: CanvasRenderingContext2D;

  constructor(public statisticsService: StatisticsService) {}

  onReady(context: CanvasRenderingContext2D): void {
    this.context = context;
    this.positionGraph = new PositionGraph(
      context,
      this.statisticsService.filteredServes.filter(r => !!r.targetPoint).map(r => r.targetPoint!)
    );
  }

  onFilterChanged(): void {
    this.onReady(this.context);
    this.court.render();
  }

  customRender(): void {
    if (this.positionGraph) {
      this.positionGraph.draw();
    }
  }
}
