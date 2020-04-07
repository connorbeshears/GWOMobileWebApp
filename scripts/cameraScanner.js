import Quagga from '../dist/quagga.min.js'; // ES6
const Quagga = require('../dist/quagg.min.js').default; // Common JS (important: default)

Quagga.init({
    inputStream : {
      name : "Live",
      type : "LiveStream"
    },
    decoder : {
      readers : ["code_128_reader"]
    }
  }, function(err) {
      if (err) {
          console.log(err);
          return
      }
      console.log("Initialization finished. Ready to start");
      Quagga.start();
  });