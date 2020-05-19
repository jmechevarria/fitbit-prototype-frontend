import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "sentenceCase",
})
export class SentenceCasePipe implements PipeTransform {
  transform(value: string, ...args: any[]): any {
    if (value) {
      return value[0].toUpperCase() + value.substr(1);
    }
  }
}
