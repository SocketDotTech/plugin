// Currently this is not used anywhere. 
import { formatRGB } from ".";

export const getContrast = function (rgbColor) {
  if (rgbColor) {
    const color = formatRGB(rgbColor).split(",");

    const r = parseInt(color[0]);
    const g = parseInt(color[1]);
    const b = parseInt(color[2]);

    // GET YUQ ratio
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    // console.log(rgbColor, yiq);
    return yiq >= 128 ? true : false;
  }
};
