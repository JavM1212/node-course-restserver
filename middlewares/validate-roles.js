const isAdminRole = (req, res, next) => {
	if (!req.user) {
		return res.status(500).json({
			msg: 'Veryfing role without validating token',
		});
	}

	const { role, name } = req.user;

	if (role !== 'ADMIN_ROLE') {
		return res.status(401).json({
			msg: `${name} is not admin`,
		});
	}

	next();
};

const hasRole = (...roles) => {
	return (req, res, next) => {
		if (!req.user) {
			return res.status(500).json({
				msg: 'Veryfing role without validating token',
			});
		}

		if (!roles.includes(req.user.role)) {
			return res.status(401).json({
				msg: `Service requires one of this roles: ${roles}`,
			});
		}

		next();
	};
};

module.exports = {
	isAdminRole,
	hasRole,
};
