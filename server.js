import express from 'express';
import 'babel-polyfill';
import PersonController from './src/controllers/Person'
import ParkController from './src/controllers/Park';
import AttractionController from './src/controllers/Attraction';
import JournalController from './src/controllers/Journal';

const apiRoot = '/api/v1';
const app = express();

app.use(express.json());

// endpoints

// person
app.post(apiRoot + '/person', PersonController.create);
app.get(apiRoot + '/people', PersonController.get);
app.get(apiRoot + '/person/:id', PersonController.get);
app.put(apiRoot + '/person/:id', PersonController.update);
app.delete(apiRoot + '/person/:id', PersonController.delete);

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

// journal
app.post(apiRoot + '/journal', JournalController.create);
app.get(apiRoot + '/journals', JournalController.get);
app.get(apiRoot + '/journal/:id', JournalController.get);
app.put(apiRoot + '/journal/:id', JournalController.update);
app.delete(apiRoot + '/journal/:id', JournalController.delete);

app.get('/', (req, res) => {
  return res.status(200).send({'message': 'Vacation logger api'});
});

app.listen(3000);

console.log('app running on port ', 3000);
