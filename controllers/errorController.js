const AppError = require('./../utils/appError');

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}.`
  return new AppError(message, 400);
}

const handleDuplicateFieldsDB = err => {

  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  console.log(value);
  const message = `Duplicate fields value: x. Please use another value`;
  return new AppError(message, 400);
}
handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message);

  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
}

const handleJWTError = () => new AppError('Invalid token please log in again!', 401);

const handleJWTExpiredError = () => new AppError('Your token has expired! please log in again', 401);


const sendErrorDev = (err, req, res) => {
  // API 
  if (req.originalUrl.startsWith('/api')) {
    return es.status(err.statusCode).json({
      status: err.staus,
      error: err,
      message: err.message,
      stack: err.stack
    });

    //RENDERED WEBSITE
  }
  return res.status(err.status).render('error', {
    title: 'Something went wrong!',
    msg: err.message
  })


}
const sendErrorProduction = (err, req, res) => {
  //A) API
  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.staus,
        message: err.message,
      });
    } else {
      // 1) Log error
      console.error('ERROR ', err)
      //2) send generic message
      return res.status(500).json({
        status: 'error',
        message: 'Something went very wrong!'
      })
    }
  }
  //B) RENDERED WEBSITE
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.staus,
      message: err.message,
    });
  } else {
    // 1) Log error
    console.error('ERROR ', err)
    //2) send generic message
    res.status(500).json({
      status: 'error',
      title: 'Something went very wrong!',
      msg: 'please try again later'
    })
  }


}


module.exports = ((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error'

  if (process.env.NODE_ENV == 'developments') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV == 'production') {
    let error = { ...err };
    error.message = err.message;

    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldDB(error);
    if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError()
    if (error.name === 'TokenExxpiredError') error = handleJWTExpiredError();

    sendErrorProduction(error, req, res);
  }

})