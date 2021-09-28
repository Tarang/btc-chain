var axios = require("axios");
var _ = require("lodash");
var address = "16DaLhUXvrhsbvptGkJtcprbTdrp5sqpFe";
var block_url = "https://blockchain.info/block/000000000000000013eeb37e234acc365dd883e526af8c660ac740d2e3894826?format=json";
var colors = require('colors');

function ab2str(buf) {
  return String.fromCharCode.apply(null, new Uint16Array(buf));
}

let run = async () => {

  let { data } = await axios.get(block_url);
  
  let transactions = data.tx.filter(tx => tx.out.filter(out => out.addr === address).length > 0);

  console.log(transactions);

  var scripts = transactions
    .map(tx => tx.out.map(i => i.script))
    .filter(script => script.map(item => item.slice(0, 2) == "6a").filter(item => item).length > 0)
    .map(script => script.map(item => item.slice(4, 84), "hex"))
    .map(script => script.map(item => ab2str(Buffer.from(item, "hex"))))
    .map(script => script.map(item => item.match(/C\+([\d]*)V([\@\|\.\&\*\-\(\)\w\n\/\s\:\,]*)\=/)))
    .map(script => [parseInt(script[0][1]), script[0][2]])
    .sort((a, b) => a[0] - b[0])
    .map(script => script[1])
    .join('')
    .split('\n')

  var statement = scripts.map((line, index) => {
    if(index < 2) line = line.split('').reverse().join('').green
    return line.replace("moc.gnarat", "tarang.com");
  }).join("\n");

  console.log(statement.bold)

}

run();
