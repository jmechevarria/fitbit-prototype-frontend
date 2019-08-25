import { Component, OnInit } from "@angular/core";
import { parseWindowHash } from "./helper";
import { ImplicitGrantFlowResponse } from "./models/ImplicitGrantFlowResponse";
import { Router } from "@angular/router";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {
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
  title = "fitbit-app-proto";
}
