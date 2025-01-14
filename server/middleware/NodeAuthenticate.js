require('dotenv').config();

const NodeAuthenticate = (req, res, next) => {
  const apiKey = req.headers['x-api-key']; // API key from headers

  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res.status(401).json({ error: 'Unauthorized: Invalid or missing API key' });
  }

  next(); // Proceed to the next middleware or route handler
};

module.exports = NodeAuthenticate;
