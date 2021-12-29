import { parseJSON, format, min, max } from "date-fns"
export const parseInputDate = (date: string) => {
    const splitDate = date.split("-");
    const numberDate = [parseInt(splitDate[0]), parseInt(splitDate[1]) - 1, parseInt(splitDate[2])];
    const dateObj = new Date(numberDate[0], numberDate[1], numberDate[2]);
  
    return dateObj.toISOString();

}

export const parseTimeStamp = (timestamp: string | undefined | null, formatString: string) => {
  if (!timestamp) {
    return ""
  }

  const dateObj = parseJSON(timestamp)  
  return format(dateObj, formatString);
}

export const minMaxDates = (timestamps: string[], formatString: string): string[] => {
  const dates = timestamps.map(timestamp => parseJSON(timestamp))
  const minMax = [format(min(dates), formatString), format(max(dates), formatString)]
  return minMax
}