exports.formatDates = (list) => {
	if (!list.length) return [];
	list.forEach((item) => {
		item.created_at = new Date(item.created_at);
	});
	return list;
};

exports.makeRefObj = (list) => {
	if (!list.length) return {};
	const refObj = {};
	list.forEach(({ article_id, title }) => {
		refObj[title] = article_id;
	});
	return refObj;
};

exports.formatComments = (comments, articleRef) => {};
