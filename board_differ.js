const bmp = require('bmp-js')
const colors = require('./colors')
const Jimp = require('jimp')

// Takes the 2 buffers and returns a valid paint to make
// the targetBuffer meet the requiremetns

let HEIGHT = 1000
let WIDTH = 1000
let TRANSPARENT = 0xff00ffff

module.exports = function (rawBoardBuffer, rawTargetBuffer) {
  let targetBuffer = bmp.decode(rawTargetBuffer).data
  let boardBuffer = bmp.decode(rawBoardBuffer).data

  let len = targetBuffer.byteLength
  for (let i = 0; i < len-4; i += 4) {
    let val = targetBuffer.readUIntBE(i, 4)
    if (val !== TRANSPARENT) {
      let boardVal = boardBuffer.readUIntBE(i, 4)
      if (boardVal !== val) {
        let n = (i/4)
        let x = n % 1000
        let y = Math.floor(n / 1000)
        let color = colors.byInt.indexOf(val)

        if (color === -1) {
          console.log("Color not found, trying to fix it...");
          console.log(val);
          
          //try to fix it by converting it from bgra to rgba or something
          var tempVal = Jimp.intToRGBA(val);
          val = Jimp.rgbaToInt(val.b, val.g, val.r, 255);
          color = colors.byInt.indexOf(val)

          console.log("Fixed color: " + color)

          // var blah2 = Jimp.intToRGBA(val);
          // console.log(blah2.r + ' ' + blah2.g + ' ' + blah2.b + ' ' + blah2.a);

          // console.log('hoi');
          // for (let gg = 0; gg < 16; gg++) {
          //   console.log(gg + '  ' + colors.byInt[gg]);

          //   var blah = Jimp.intToRGBA(colors.byInt[gg]);
          //   console.log(blah.r + ' ' + blah.g + ' ' + blah.b + ' ' + blah.a);
          // }
        }
        return { x: x, y: y, color: color }
      }
    }
  }

  return null
}
