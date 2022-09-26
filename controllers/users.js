const User = require('../models/user');
const NotFound = require('../errors/NotFound');
const STATUS_CODES = require('../errors/errorCodes');

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => {
      res.status(STATUS_CODES.successCreate).send(user);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(STATUS_CODES.dataError).send({
          message: 'Данные некорректны',
        });
      } else {
        res.status(STATUS_CODES.serverError).send({ message: 'Произошла ошибка на сервере. Повторите запрос' });
      }
    });
};

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch(() => {
      res.status(STATUS_CODES.serverError).send({ message: 'Произошла ошибка на сервере. Повторите запрос' });
    });
};

const getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => {
      throw new NotFound();
    })
    .then((user) => {
      res.send(user);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        res.status(STATUS_CODES.dataError).send({
          message: 'Данные некорректны',
        });
      } else if (error.name === 'NotFound') {
        res.status(error.status).send({ message: error.message });
      } else {
        res.status(STATUS_CODES.serverError).send({ message: 'Произошла ошибка на сервере. Повторите запрос' });
      }
    });
};

const updateUser = (req, res) => {
  const { name, about, _id = req.user._id } = req.body;
  User.findByIdAndUpdate(
    _id,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(() => {
      throw new NotFound();
    })
    .then((user) => {
      res.send(user);
    })
    .catch((error) => {
      if (error.name === 'ValidationError' || error.name === 'CastError') {
        res.status(STATUS_CODES.dataError).send({
          message: 'Данные некорректны',
        });
      } else if (error.name === 'NotFound') {
        res.status(error.status).send({ message: error.message });
      } else {
        res.status(STATUS_CODES.serverError).send({ message: 'Произошла ошибка на сервере. Повторите запрос' });
      }
    });
};

const updateAvatar = (req, res) => {
  const { avatar, _id = req.user._id } = req.body;
  User.findByIdAndUpdate(
    _id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(() => {
      throw new NotFound();
    })
    .then((user) => {
      res.send(user);
    })
    .catch((error) => {
      if (error.name === 'ValidationError' || error.name === 'CastError') {
        res.status(STATUS_CODES.dataError).send({
          message: 'Данные некорректны',
        });
      } else if (error.name === 'NotFound') {
        res.status(error.status).send({ message: error.message });
      } else {
        res.status(STATUS_CODES.serverError).send({ message: 'Произошла ошибка на сервере. Повторите запрос' });
      }
    });
};

module.exports = {
  getUsers, getUserById, createUser, updateUser, updateAvatar,
};
