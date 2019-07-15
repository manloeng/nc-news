exports.formatDates = (list) => {
	if (!list.length) return [];
	const mapArr = list.map(({ created_at, ...restOfListData }) => {
		restOfListData.created_at = new Date(created_at);
		return restOfListData;
	});
	return mapArr;
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

	const mapArr = comments.map(({ created_by, belongs_to, created_at, ...restOfCommentData }) => {
		if (created_by) {
			restOfCommentData.author = created_by;
		}
		if (belongs_to) {
			restOfCommentData.article_id = articleRef[belongs_to];
		}
		if (created_at >= 0) {
			restOfCommentData.created_at = new Date(created_at);
		}
		return restOfCommentData;
	});
	return mapArr;
};
