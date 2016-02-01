
var start = Date.now(), total = 0
require('fs').createReadStream(process.argv[2])
  .on('data', function (d) {
    total += d.length
  })
  .on('end', function () {
    var mb = total/(1024*1024)
    var time = (Date.now() - start)/1000

    console.log(mb, time, mb/time)
  })
