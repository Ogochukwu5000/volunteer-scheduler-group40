// Description: This file contains the code to fetch data from the MongoDB database.
require('dotenv').config();
const { MongoClient } = require('mongodb');

async function fetchData() {
    const uri = process.env.MONGODB_URI;
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        //this loads the data from the database and sets the tables to the variables
        //if you need to change any data its just chanign teh name to a different table
        await client.connect();
        const database = client.db('cluster0');
        const volunteers = database.collection('volunteers');
        const events = database.collection('events');
        const volunteerHistory = database.collection('volunteerHistory');

        const volunteerData = await volunteers.find({}).toArray();
        const eventData = await events.find({}).toArray();
        const volunteerHistoryData = await volunteerHistory.find({}).toArray();

        return { volunteerData, eventData };
    } finally {
        await client.close();
    }
}

module.exports = { fetchData };