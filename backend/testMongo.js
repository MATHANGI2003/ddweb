const mongoose = require('mongoose');
require('dotenv').config({ path: 'c:/ddwebsite/backend/.env' });
const Contact = require('./models/Contact');

async function testSave() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    const newContact = new Contact({
      name: 'Test Name',
      email: 'test@example.com',
      profession: 'Tester',
      message: 'Test Message'
    });
    
    await newContact.save();
    console.log('Saved successfully');
  } catch (error) {
    console.error('Error saving:', error);
  } finally {
    mongoose.disconnect();
  }
}

testSave();
