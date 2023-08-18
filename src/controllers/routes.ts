import express from 'express';

import customersControllers from './customers.controller';
import usersControllers from './users.controller';

function routerApi(app: express.Application){
  // const router = express.Router();
  app.use('/customers', customersControllers);
  app.use('/users', usersControllers);
}

export { routerApi };