var request = require("request");
var _ = require("lodash");
var address = "16DaLhUXvrhsbvptGkJtcprbTdrp5sqpFe";
var block_url = "https://blockchain.info/block/000000000000000013eeb37e234acc365dd883e526af8c660ac740d2e3894826?format=json";
var colors = require('colors');

function ab2str(buf) {
  return String.fromCharCode.apply(null, new Uint16Array(buf));
}

request({
	url: block_url,
	json: true,
	method: "GET"
}, function (error, response, block) {
	if (!error && response.statusCode == 200) {
		var transactions = _(block.tx).filter(function(transaction) {	
			return ((_.where(transaction.out, {addr: address}).length > 0)
			)
		}).map(function(transaction) {
			var scripts = _(transaction.out).pluck("script").filter(function(script) {
				return (script.slice(0,2) == "6a")
			}).map(function(script) {
				var bufferData = new Buffer(script.slice(4, 84), "hex");  
				return ab2str(bufferData).match(/C\+([\d]*)V([\@\|\.\&\*\-\(\)\w\n\/\s\:\,]*)\=/);
			}).filter(function(set) {
				return set;
			}).map(function(doc) {
				return [
					parseInt(doc[1]),
					doc[2]
				]
			}).value();

			return scripts[0];
		}).sortBy(function(doc) {
			return doc[0];
		}).pluck(1).value().join('').split("\n");

		//Some post
		var statement = _(transactions).map(function(line, index) {
			if(index < 2) line = line.split('').reverse().join('').green
			return line.replace("moc.gnarat", "tarang.com");
		}).join("\n");

		console.log(statement.bold)


	}
})