exports.formatDates = (list) => {
	if (!list.length) return [];
	list.forEach((item) => {
		item.created_at = new Date(item.created_at);
	});
	return list;
};

exports.makeRefObj = (list) => {
	return {};
};

exports.formatComments = (comments, articleRef) => {};
