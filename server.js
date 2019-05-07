import express from 'express';
import 'babel-polyfill';
import ParkController from './src/controllers/Park';
import AttractionController from './src/controllers/Attraction';

const apiRoot = '/api/v1';
const app = express();

app.use(express.json());

// endpoints

// park
app.post(apiRoot + '/park', ParkController.create);
app.get(apiRoot + '/parks', ParkController.get);
app.get(apiRoot + '/park/:id', ParkController.get);
app.put(apiRoot + '/park/:id', ParkController.update);
app.delete(apiRoot + '/park/:id', ParkController.delete);

// attraction
app.post(apiRoot + '/attraction', AttractionController.create);
app.get(apiRoot + '/attractions', AttractionController.get);
app.get(apiRoot + '/attraction/:id', AttractionController.get);
app.put(apiRoot + '/attraction/:id', AttractionController.update);
app.delete(apiRoot + '/attraction/:id', AttractionController.delete);



app.get('/', (req, res) => {
  return res.status(200).send({'message': 'Vacation logger api'});
});

app.listen(3000);

console.log('app running on port ', 3000);
