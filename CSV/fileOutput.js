// Purpose: Generate PDF and CSV files from database data and serve them to the user
const express = require('express');
const PDFDocument = require('pdfkit');
const { createObjectCsvWriter } = require('csv-writer');
const fs = require('fs');
const { fetchData } = require('./dataAccess');

const app = express();
const port = 3000;
// both endponit access the data from fetchData function where you just give it a table name and it will return the data from that table
// if you call this endpoint, it will generate a PDF file containing volunteer and event data
app.get('/generate-pdf', async (req, res) => {
    const { volunteerData, eventData, volunteerHistoryData } = await fetchData();

    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream('output.pdf'));
// like here you are gettign the volunters.full name
    doc.text('Volunteers and Participation History');
    volunteerData.forEach(volunteer => {
        doc.text(`Volunteer: ${volunteer.fullName}`);
        // goes through the hisotry table and finds all occurances of the current volunteer
        // this step is done by matching both the ids between the tables since i know you changed it to that format
        const history = volunteerHistoryData.filter(history => history.volunteerId === volunteer._id);

        history.forEach(record => {
            //_id is the id of the event table and the eventId is the id of the event in the history table
            const event = eventData.find(event => event._id === record.eventId);
            doc.text(`  Event: ${event.eventName}`);
        });
    });
    // List of all events with detailed information
    doc.text('Events and Participants');
    eventData.forEach(event => {
        doc.text(`Event: ${event.eventName}`);
        doc.text(`  Description: ${event.description}`);
        doc.text(`  Location: ${event.location}`);
        doc.text(`  Required Skills: ${event.requiredSkills}`);
        doc.text(`  Urgency: ${event.urgency}`);
        doc.text(`  Event Date: ${event.eventDate}`);
        doc.text(`  Created By: ${event.createdBy}`);
        doc.text(`  Created At: ${event.createdAt}`);
        // find all the participants of the event so goes through event hisotry and sees all the occurances of the current event
        const participants = volunteerHistoryData.filter(history => history.eventId === event._id);
        participants.forEach(participant => {
            const volunteer = volunteerData.find(volunteer => volunteer._id === participant.volunteerId);
            doc.text(`    Participant: ${volunteer.fullName}`);
        });
    });

    doc.end();
    res.download('output.pdf');
});
// if you call this endpoint, it will generate a CSV file containing volunteer and event data
app.get('/generate-csv', async (req, res) => {
    // fetches the data from the database
    const { volunteerData, eventData, volunteerHistoryData } = await fetchData();
    // creates a csv writer for the volunteers to fill in the data(think header as the column names)
    const volunteerCsvWriter = createObjectCsvWriter({
        path: 'volunteers.csv',
        header: [
            { id: 'volunteerName', title: 'Volunteer Name' },
            { id: 'eventName', title: 'Event Name' }
        ]
    });
    // creates a csv writer for the events to fill in the data
    const eventCsvWriter = createObjectCsvWriter({
        path: 'events.csv',
        header: [
            { id: 'eventName', title: 'Event Name' },
            { id: 'description', title: 'Description' },
            { id: 'location', title: 'Location' },
            { id: 'requiredSkills', title: 'Required Skills' },
            { id: 'urgency', title: 'Urgency' },
            { id: 'eventDate', title: 'Event Date' },
            { id: 'createdBy', title: 'Created By' },
            { id: 'createdAt', title: 'Created At' }
        ]
    });

    const volunteerRecords = [];
    const eventRecords = [];
    // goes through the volunteer table and finds all the history of the current volunteer by matching ids can be changed to names
    volunteerData.forEach(volunteer => {
        const history = volunteerHistoryData.filter(history => history.volunteerId === volunteer._id);

        history.forEach(record => {
            const event = eventData.find(event => event._id === record.eventId);
            volunteerRecords.push({
                volunteerName: volunteer.fullName,
                eventName: event.eventName
            });
        });
    });
    
    eventData.forEach(event => {
        eventRecords.push({
            eventName: event.eventName,
            description: event.description,
            location: event.location,
            requiredSkills: event.requiredSkills,
            urgency: event.urgency,
            eventDate: event.eventDate,
            createdBy: event.createdBy,
            createdAt: event.createdAt
        });
    });

    await volunteerCsvWriter.writeRecords(volunteerRecords);
    await eventCsvWriter.writeRecords(eventRecords);
    res.send('CSV files generated');
});


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});