exports.formatDates = (list) => {
	if (!list.length) return [];
	const mapArr = list.map(({ created_at }) => {
		return new Date(created_at);
	});
	return mapArr[0];
};

exports.makeRefObj = (list) => {};

exports.formatComments = (comments, articleRef) => {};
