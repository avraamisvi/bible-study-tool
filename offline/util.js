function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function computeTrackLineItemColor(colorStr) {

  rgba_header = hexToRgb(colorStr);
  rgba_body = hexToRgb(colorStr);

  rgba_header.r = Math.round(rgba_header.r - (rgba_header.r * 0.1));
  rgba_header.g = Math.round(rgba_header.g - (rgba_header.g * 0.1));
  rgba_header.b = Math.round(rgba_header.b - (rgba_header.b * 0.1));

  return {
    header: "rgba(" + rgba_header.r + "," + rgba_header.g + "," + rgba_header.b + ",1)",
    body: "rgba(" + rgba_body.r + "," + rgba_body.g + "," + rgba_body.b + ",0.65)"
  }
}

function addZeros(num, zeros) {
  var ret = "" + num;

  zeros = Math.abs(ret.length - zeros);

  for(i = 0; i < zeros; i++) {
    ret = "0" + ret;
  }

  return ret;
}
