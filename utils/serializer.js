const PHP = require('php-serialize');

exports.serialize = (obj) => {
	return PHP.serialize(obj);
};

exports.unserialize = (str) => {
	try {
		return PHP.unserialize(str);
	} catch (e) {
		return {};
	}
};
