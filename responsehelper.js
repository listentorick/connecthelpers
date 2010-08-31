exports.writeErrorToResponse = function(res, error) {
	var errorResponse = {error:error};
	res.writeHead(400, {});	
	res.end(JSON.stringify(errorResponse));
}

exports.writeResultToResponse = function(res, result) {
	var resultResponse = {result:result};
	res.writeHead(200, {});	
	res.end(JSON.stringify(resultResponse));
}