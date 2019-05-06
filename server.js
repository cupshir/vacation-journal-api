import express from 'express';
import 'babel-polyfill';
import ParkController from './src/controllers/Park';

const app = express();

app.use(express.json());

app.post('/api/v1/parks', ParkController.create);
app.get('/api/v1/parks', ParkController.get);
app.get('/api/v1/parks/:id', ParkController.get);
app.put('/api/v1/parks/:id', ParkController.update);
app.delete('/api/v1/parks/:id', ParkController.delete);

app.get('/', (req, res) => {
  return res.status(200).send({'message': 'Vacation logger api'});
});

app.listen(3000);

console.log('app running on port ', 3000);
