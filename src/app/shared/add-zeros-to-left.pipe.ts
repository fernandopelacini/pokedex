import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name:"addZerosToLeft"
})

export class AddZerosToLeftPipe implements PipeTransform{
    transform(value: number): string {
       if (value < 10)  return '00' + value.toString();
       if (value < 100) return '0' + value.toString();
       return value.toString();
    }

}
