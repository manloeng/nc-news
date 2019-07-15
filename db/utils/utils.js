exports.formatDates = (list) => {
	if (!list.length) return [];
	list.forEach((item) => {
		item.created_at = new Date(item.created_at);
	});
	return list;
};

exports.makeRefObj = (list) => {
	if (!list.length) return {};
	console.log(list);
	const refObj = {};
	const { article_id, title } = list[0];
	console.log(article_id);
	console.log(title);
	refObj[title] = article_id;
	return refObj;
};

exports.formatComments = (comments, articleRef) => {};
