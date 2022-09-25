const Card = require('../models/card');
const NotFound = require('../errors/NotFound');
const STATUS_CODES = require('../errors/errorCodes');

const createCard = (req, res) => {
  const { name, link, owner = req.user._id } = req.body;
  Card.create({ name, link, owner })
    .then((card) => {
      res.status(STATUS_CODES.successCreate).send(card);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(STATUS_CODES.dataError).send({
          message: 'Данные некорректны',
        });
      } else {
        res.status(STATUS_CODES.serverError).send({ message: 'Произошла ошибка. Повторите запрос' });
      }
    });
};

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.status(STATUS_CODES.success).send(cards);
    })
    .catch(() => {
      res.status(STATUS_CODES.serverError).send({ message: 'Произошла ошибка. Повторите запрос' });
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new NotFound();
    })
    .then((card) => {
      res.status(STATUS_CODES.success).send(card);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        res.status(STATUS_CODES.dataError).send({
          message: 'Данные некорректны',
        });
      } else if (error.name === 'NotFound') {
        res.status(error.status).send({ message: error.message });
      } else {
        res.status(STATUS_CODES.serverError).send({ message: 'Произошла ошибка. Повторите запрос' });
      }
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new NotFound();
    })
    .then((card) => {
      res.status(STATUS_CODES.success).send(card);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        res.status(STATUS_CODES.dataError).send({
          message: 'Данные некорректны',
        });
      } else if (error.name === 'NotFound') {
        res.status(error.status).send({ message: error.message });
      } else {
        res.status(STATUS_CODES.serverError).send({ message: 'Произошла ошибка. Повторите запрос' });
      }
    });
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(() => {
      throw new NotFound();
    })
    .then((card) => res.send(card))
    .catch((error) => {
      if (error.name === 'CastError') {
        res.status(STATUS_CODES.dataError).send({
          message: 'Данные некорректны',
        });
      } else if (error.name === 'NotFound') {
        res.status(error.status).send({ message: error.message });
      } else {
        res.status(STATUS_CODES.serverError).send({ message: 'Произошла ошибка. Повторите запрос' });
      }
    });
};

module.exports = {
  getCards, createCard, likeCard, dislikeCard, deleteCard,
};
