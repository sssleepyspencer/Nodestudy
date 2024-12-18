const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { userSchema } = require('../validators/user');

router.post('/register', async (req, res) => {
  const { error } = userSchema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send('User already registered.');

  user = new User({
    email: req.body.email,
    password: await bcrypt.hash(req.body.password, 10),
    role: req.body.role || 'user'
  });
  await user.save();

  const token = jwt.sign({ _id: user._id, role: user.role }, 'jwtPrivateKey');
  res.send({ token });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  let user = await User.findOne({ email });
  if (!user) return res.status(400).send('Invalid email or password.');

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) return res.status(400).send('Invalid email or password.');

  const token = jwt.sign({ _id: user._id, role: user.role }, 'jwtPrivateKey');
  res.send({ token });
});

module.exports = router;
