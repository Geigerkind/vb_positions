import { Component, ViewChild } from "@angular/core";
import { StatisticsService } from "../../service/statistics.service";
import { FormGroup } from "@angular/forms";
import { CourtComponent } from "../../../field/dumb-component/court/court.component";
import { PositionGraph } from "../../graphs/PositionGraph";

@Component({
  selector: "vpms-tosses",
  templateUrl: "./tosses.component.html",
  styleUrls: ["./tosses.component.scss"],
})
export class TossesComponent {
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
      this.statisticsService.filteredTosses.filter(r => !!r.targetPoint).map(r => r.targetPoint!)
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
