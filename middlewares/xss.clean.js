var xss = require("xss");

exports.removeXss = (data) => {
	try {
		var reqData = data.trim();
		var cleanData = xss(reqData);
		return cleanData;
	} catch (e) {
		return false;
	}
}