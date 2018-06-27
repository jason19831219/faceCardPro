module.exports = (req, res, next) => {
	console.log(req.sessionID)
    next();
	// if (req.session.adminlogined) {
	// 	next();
	// } else {
	// 	res.status(501);
	// 	res.send({
	// 		status: "error",
	// 		message: "admin auth failed."
	// 	});
	// 	return;
	// }
};
