import { Component, OnInit } from "@angular/core";
import { FitbitService } from "../../services/fitbit.service";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-fitbit-client-idform",
  templateUrl: "./fitbit-client-idform.component.html",
  styleUrls: ["./fitbit-client-idform.component.scss"]
})
export class FitbitClientIDFormComponent implements OnInit {
  constructor(private fitbitDataService: FitbitService) {}

  ngOnInit() {}
}
