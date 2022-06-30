const express = require('express');
const app = express();
require('./src/database/connect');
const morgan = require('morgan');
const cors = require('cors');
// const User = require('./models/userModel');
// const Product = require('./models/productModel');

require('dotenv/config');
const errorHandler = require('./src/helpers/errorHandler');

app.use(cors());
app.options('*', cors());

const port = process.env.PORT || 8080;
const api = process.env.API_URL;

//Middleware
app.use(express.json());
app.use(morgan('tiny'));
app.use(errorHandler);
app.use('/public/uploads', express.static(__dirname + '/public/uploads/'));
// console.log(__dirname);
// app.use(authJwtVerification);

//Routers
const userRouter = require('./src/routers/userRouter');
const productRouter = require('./src/routers/productRouter');
const orderRouter = require('./src/routers/orderRouter');
const catagoryRouter = require('./src/routers/catagoryRouter');

app.use(`${api}/users`, userRouter);
app.use(`${api}/products`, productRouter);
app.use(`${api}/orders`, orderRouter);
app.use(`${api}/catagorys`, catagoryRouter);

app.listen(port, () => {
  console.log(`Running server at port ${port}`);
});
