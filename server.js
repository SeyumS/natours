const dotenv = require('dotenv');
const mongoose = require('mongoose');
const app = require('./app');



dotenv.config({path: './config.env'})

console.log(app.get('env'));

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD)

mongoose.connect(DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(con => {
  console.log('DB connection successful!')
});

const port = 3000; 
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection', err => {
  console.log(err.name, err.message);
  console.log('ÙNHANDLED REJECTION shutting down...');
  server.close(() => {
    process.exit(1);
  });
});
process.on('uncaughtException', err=>{
  console.log('UNCAUGHT EXCEPTION! shutting down...');
  console.log(err.name, err.message);
  server.close(()=>{
    process.exit(1);
  });
});
