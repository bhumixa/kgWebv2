import { Pipe, PipeTransform } from "@angular/core";
import {format} from "date-fns/format";
import {addHours} from "date-fns/addHours";
import {isAfter} from "date-fns/isAfter";
import {formatDistanceToNow} from "date-fns/formatDistanceToNow";
import {parseISO} from "date-fns/parseISO";


@Pipe({
  name: "timeAgo"
})
export class TimeAgoPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    // console.log("args", args);

    if (isAfter(parseISO(value), addHours(new Date(), 3))) {
      return formatDistanceToNow(new Date(value));
    } else if (args == 2) {
      return format(new Date(value), "dd-MMM hh:mm");
    } else if (args == 1) {
      return format(new Date(value), "dd-MMM hh:mm a");
    }
    else if (args == 0) {
      return format(new Date(value), "dd-MMM-yyyy");
    }
    else {
      return format(new Date(value), "dd-MMM-yyyy");
    }

  }
}
