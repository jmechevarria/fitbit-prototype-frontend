import { Pipe, PipeTransform } from "@angular/core";
@Pipe({ name: "replaceSubstring" })
export class ReplaceSubstring implements PipeTransform {
  transform(subject: string, substring: string, replacement: string): string {
    return subject.replace(new RegExp(substring), replacement);
  }
}
