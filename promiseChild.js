module.exports = function (child) {
	return new Promise(function (resolve, reject) {
		child.on('close', function(code) {
			resolve(code);
		});
	});
};
