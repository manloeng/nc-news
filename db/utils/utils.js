exports.formatDates = (list) => {
	if (!list.length) return [];
	const formattedDateArr = list.map(({ created_at, ...restOfListData }) => {
		restOfListData.created_at = new Date(created_at);
		return restOfListData;
	});
	return formattedDateArr;
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
		restOfCommentData.author = created_by;
		restOfCommentData.article_id = articleRef[belongs_to];
		restOfCommentData.created_at = new Date(created_at);
		return restOfCommentData;
	});
	return mapArr;
};
