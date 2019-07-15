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

exports.formatComments = (comments, articleRef) => {
	if (!comments.length || !Object.keys(articleRef).length) return [];
	const { created_by, belongs_to, ...restOfCommentData } = comments[0];
	if (created_by) {
		restOfCommentData.author = created_by;
	}
	if (belongs_to) {
		restOfCommentData.article_id = articleRef[belongs_to];
	}
	return [ restOfCommentData ];
};
