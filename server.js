import express from 'express';
import 'babel-polyfill';
import PersonController from './src/controllers/Person'
import ParkController from './src/controllers/Park';
import AttractionController from './src/controllers/Attraction';
import JournalController from './src/controllers/Journal';
import JournalEntryController from './src/controllers/JournalEntry';
import JournalParkController from './src/controllers/JournalPark';

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

// journal entry
app.post(apiRoot + '/journal-entry', JournalEntryController.create);
app.get(apiRoot + '/journal-entries', JournalEntryController.get);
app.get(apiRoot + '/journal-entry/:id', JournalEntryController.get);
app.put(apiRoot + '/journal-entry/:id', JournalEntryController.update);
app.delete(apiRoot + '/journal-entry/:id', JournalEntryController.delete);

// journal park
app.post(apiRoot + '/journal-park', JournalParkController.create);
app.get(apiRoot + '/journal-park/all', JournalParkController.get);
app.get(apiRoot + '/journal-park/:id', JournalParkController.get);
app.put(apiRoot + '/journal-park/:id', JournalParkController.update);
app.delete(apiRoot + '/journal-park/:id', JournalParkController.delete);

app.get('/', (req, res) => {
  return res.status(200).send({'message': 'Vacation logger api'});
});

app.listen(3000);

console.log('app running on port ', 3000);
