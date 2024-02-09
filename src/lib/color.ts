function componentToHex(c: number) {
  const hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

export function rgbToHex(r: number, g: number, b: number) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

export function hexToRgb(hex: string) {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function(m, r, g, b) {
    return r + r + g + g + b + b;
  });

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

// input: r,g,b in [0,1], out: h in [0,360) and s,v in [0,1]
export function rgbToHsv(r: number, g: number, b: number) {
  let v = Math.max(r, g, b), c = v - Math.min(r, g, b);
  let h = c && ((v == r) ? (g - b) / c : ((v == g) ? 2 + (b - r) / c : 4 + (r - g) / c));
  return {
    h: 60 * (h < 0 ? h + 6 : h),
    s: v && c / v,
    v: v
  };
}

export function hexToHsv(hex: string) {
  const rgb = hexToRgb(hex) || { r: 0, g: 0, b: 0};
  return rgbToHsv(rgb.r / 256, rgb.g / 256, rgb.b / 256);
}
