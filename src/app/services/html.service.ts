import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class HtmlService {
  keys(object: {}) {
    return Object.keys(object);
  }
  // ... other useful methods not available inside html, like isObject(), isArray(), findInArray(), and others...
}
