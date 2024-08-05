const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();

const PORT = 5000;

app.set('view engine', 'ejs');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

let users = []; // This should be replaced with a proper database in production

const requireLogin = (req, res, next) => {
  if (!req.session.userId) {
    return res.redirect('/login');
  }
  next();
};

app.get('/', requireLogin, (req, res) => {
  const files = fs.readdirSync('public');
  res.render('index', { files });
});

app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', async (req, res) => {
  const { email, username, password, 'repeat-password': repeatPassword } = req.body;

  // Check if passwords match
  if (password !== repeatPassword) {
    return res.status(400).send('Passwords do not match');
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Save user data
  users.push({ id: Date.now().toString(), email, username, password: hashedPassword });

  // Redirect to login page after successful registration
  res.redirect('/login');
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = users.find(user => user.username === username);
  if (user && await bcrypt.compare(password, user.password)) {
    req.session.userId = user.id;
    return res.redirect('/');
  }
  res.redirect('/login');
});

app.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.redirect('/');
    }
    res.clearCookie('connect.sid');
    res.redirect('/login');
  });
});

app.post('/upload', requireLogin, upload.single('file'), (req, res) => {
  res.redirect('/');
});

app.get('/delete', requireLogin, (req, res) => {
  const fileName = req.query.file;
  if (fileName) {
    fs.unlinkSync(`public/${fileName}`);
  }
  res.redirect('/');
});

app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
});







