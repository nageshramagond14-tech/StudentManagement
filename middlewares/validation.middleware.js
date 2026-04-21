module.exports = (req, res, next) => {
  const { name, age, course } = req.body;

  if (!name || !age || !course) {
    return res.status(400).json({ message: 'All fields required' });
  }

  next();
};