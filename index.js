
var pull = require('pull-stream')
var defer = require('pull-defer')
var HighWatermark = require('pull-high-watermark')
var fs = require('fs')
var length = 2048*64

module.exports = function (file, opts) {

  var stream = defer.source(), ended = false, n = 0
  fs.open(file, 'r', function (err, fd) {

    var source = pull.count()
    stream.resolve(function next (end, cb) {
      if(ended) return cb(true)
      //move buffer creation out of next and it will go really really fast.
      var b = new Buffer(length)
      fs.read(fd, b, 0, length, length*(n++), function (err, bytesRead) {
        if(bytesRead !== length) {
          ended = true
          cb(null, b.slice(0, bytesRead))
        }
        else
          cb(null, b)
      })
    })

  })

  return stream
}


if(!module.parent) {
  var start = Date.now(), total = 0
  pull(
    module.exports(process.argv[2]),
    HighWatermark(2),
    pull.drain(function (b) {
      total += b.length
    }, function (err) {
      var mb = total/(1024*1024)
      var elapsed = (Date.now() - start)/1000
      console.log(mb, elapsed, mb/elapsed)
    })
  )
}












