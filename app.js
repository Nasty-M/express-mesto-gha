const express = require('express');
const mongoose = require('mongoose');
const STATUS_CODE = require('./errors/errorCodes');
const router = require('./routes/routes');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});
app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '6330b38269641a71b7622fbe',
  };

  next();
});
app.use('/', router);
app.use('*', (req, res) => {
  res.status(STATUS_CODE.notFound).send({ message: 'Страница не найдена' });
});

app.listen(PORT);
