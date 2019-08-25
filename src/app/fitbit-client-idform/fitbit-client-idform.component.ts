import { Component, OnInit } from "@angular/core";
import { Placeholder } from "@angular/compiler/src/i18n/i18n_ast";
// import { HttpClient } from 'selenium-webdriver/http';
import { HttpClient } from "@angular/common/http";
import { FitbitDataService } from "../services/fitbit-data.service";

@Component({
  selector: "app-fitbit-client-idform",
  templateUrl: "./fitbit-client-idform.component.html",
  styleUrls: ["./fitbit-client-idform.component.scss"]
})
export class FitbitClientIDFormComponent implements OnInit {
  clientID: string;

  constructor(private fitbitDataService: FitbitDataService) {}

  ngOnInit() {}

  submit() {
    if (this.clientID === "" || !this.clientID) {
      console.log("Stop mfcker");
    } else this.fitbitDataService.authenticate(this.clientID);
  }
}
