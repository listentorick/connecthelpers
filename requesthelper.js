var sys = require('sys');
var Buffer = require('buffer').Buffer;
var querystring = require('querystring');

exports.handlePost = function(callback) {

	return function(req,res,next) {
	
		var chunks = [], bytes = 0;
	
		req.addListener('data', function(chunk) {
			// Gather up chunks & track total data length
			chunks.push(chunk);
			bytes += chunk.length;
		});
		
		req.addListener("end", function () {  
			
			var body = new Buffer(bytes);
            var offset = 0;
            chunks.forEach(function (chunk) {
                chunk.copy(body, offset);
                offset += chunk.length;
            });
			
			var result = body.toString('utf8', 0, body.byteLength);
		
			try {
				result = JSON.parse(result);
			} catch(e) {
				throw e;
			}
			callback(null, result, req, res, next);
			
		});
		
	}
}

function toCamel(str){
	return str.replace(/(\_[a-z])/g, function($1){return $1.toUpperCase().replace('_','');});
};

exports.handleGet = function(callback) {

	return function(req,res,next) {
		req.addListener("end", function () {  
			var result = null;
			var qs;
			if (req.url.indexOf('?') > 0) {
				qs = req.url.substr(req.url.indexOf('?')+1);
				//query string data is the format page_index, page_size.
				//core actually takes pageIndex and pageSize - so here we convert...
				result = querystring.parse(qs);
				var camelCaseResult = {};
				
				for(var prop in result) {
					camelCaseResult[toCamel(prop)] = result[prop];	
				}
			}
			callback(null, camelCaseResult, req, res, next);
			
		});
		
	}
}

