import { Component, OnInit } from "@angular/core";
import { parseWindowHash } from "./helper";
import { ImplicitGrantFlowResponse } from "./models/ImplicitGrantFlowResponse";
import { Router } from "@angular/router";
import { FitbitDataService } from "./services/fitbit-data.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
  private title = "fitbit-app-proto";

  constructor(private router: Router, private fitbitDataService: FitbitDataService) {}

  ngOnInit(): void {
    if (this.isAuthenticated) {
      this.router.navigate(["dashboard"]);
      return;
    }

    if (window.location.hash !== "") {
      if (window.location.search.includes("error") || window.location.search.includes("error_description")) {
        console.log("if");
        this.router.navigate([""]);
      } else if (window.location.hash.includes("access_token")) {
        console.log("else");
        const implicitGrantFlowResponse = parseWindowHash<ImplicitGrantFlowResponse>(window.location.hash);

        localStorage.setItem("access-token", implicitGrantFlowResponse.access_token);
        localStorage.setItem("user-id", implicitGrantFlowResponse.user_id);

        console.log(implicitGrantFlowResponse.state);
        console.log(location.hash);
        window.location.hash = "";
      }
    }
  }

  get isAuthenticated() {
    return this.fitbitDataService.isAuthenticated();
  }
}
