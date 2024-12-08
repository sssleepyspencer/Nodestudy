const jwt = require('jsonwebtoken');

const authenticate = (roles = []) => {
    return (req, res, next) => {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Authorization token required' });
        }

        const token = authHeader.split(' ')[1];

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            if (!roles.includes(decoded.role)) {
                return res.status(403).json({ error: 'Forbidden' });
            }
            req.user = decoded; 
            next();
        } catch (err) {
            res.status(401).json({ error: 'Invalid or expired token' });
        }
    };
};

module.exports = authenticate;
