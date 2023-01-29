import { Component, ViewChild } from "@angular/core";
import { StatisticsService } from "../../service/statistics.service";
import { FormGroup } from "@angular/forms";
import { ReceiveGraph } from "../../graphs/ReceiveGraph";
import { CourtComponent } from "../../../field/dumb-component/court/court.component";

@Component({
  selector: "vpms-receives",
  templateUrl: "./receives.component.html",
  styleUrls: ["./receives.component.scss"],
})
export class ReceivesComponent {
  @ViewChild("court", { static: false })
  private court: CourtComponent;

  formGroup: FormGroup;
  onCustomRender: () => void = () => {
    this.customRender();
  };

  private receiveGraph: ReceiveGraph;
  private context: CanvasRenderingContext2D;

  constructor(public statisticsService: StatisticsService) {}

  onReady(context: CanvasRenderingContext2D): void {
    this.context = context;
    this.receiveGraph = new ReceiveGraph(
      context,
      this.statisticsService.filteredReceives.map(r => r.targetPoint)
    );
  }

  onFilterChanged(): void {
    this.onReady(this.context);
    this.court.render();
  }

  customRender(): void {
    if (this.receiveGraph) {
      this.receiveGraph.draw();
    }
  }
}
