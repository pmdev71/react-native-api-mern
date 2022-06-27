const express = require('express');
const app = express();
require('./database/connect');
const morgan = require('morgan');
const cors = require('cors');
const User = require('./models/userModel');
const Product = require('./models/productModel');

require('dotenv/config');

app.use(cors());
app.options('*', cors());

const port = process.env.PORT || 8080;
const api = process.env.API_URL;

//Middleware
app.use(express.json());
app.use(morgan('tiny'));

//Routers
const userRouter = require('./routers/userRouter');
const productRouter = require('./routers/productRouter');
const orderRouter = require('./routers/orderRouter');
const catagoryRouter = require('./routers/catagoryRouter');

app.use(`${api}/users`, userRouter);
app.use(`${api}/products`, productRouter);
app.use(`${api}/orders`, orderRouter);
app.use(`${api}/catagorys`, catagoryRouter);

app.listen(port, () => {
  console.log(`Running server at port ${port}`);
});
