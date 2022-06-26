const express = require('express');
const app = express();
require('./database/connect');
const morgan = require('morgan');
const User = require('./models/userModel');
const Product = require('./models/productModel');
const userRouter = require('./routers/userRouter');
const productRouter = require('./routers/productRouter');
const orderRouter = require('./routers/orderRouter');

require('dotenv/config');
const port = process.env.PORT || 8080;
const api = process.env.API_URL;

//middleware
app.use(express.json());
app.use(morgan('tiny'));

app.use(`${api}/users`, userRouter);
app.use(`${api}/products`, productRouter);
app.use(`${api}/orders`, orderRouter);

app.listen(port, () => {
  console.log(`Running server at port ${port}`);
});
