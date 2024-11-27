import express, { Request, Response } from 'express';
import PDFDocument from 'pdfkit';
import { createObjectCsvWriter } from 'csv-writer';
import fs from 'fs';
import { fetchData } from './dataAccess';

// Define interfaces for data structures
interface Volunteer {
    _id: string;
    fullName: string;
}

interface Event {
    _id: string;
    eventName: string;
    description: string;
    location: string;
    requiredSkills: string;
    urgency: string;
    eventDate: string;
    createdBy: string;
    createdAt: string;
}

interface VolunteerHistory {
    volunteerId: string;
    eventId: string;
}

interface DatabaseData {
    volunteerData: Volunteer[];
    eventData: Event[];
    volunteerHistoryData: VolunteerHistory[];
}

interface VolunteerCsvRecord {
    volunteerName: string;
    eventName: string;
}

interface EventCsvRecord {
    eventName: string;
    description: string;
    location: string;
    requiredSkills: string;
    urgency: string;
    eventDate: string;
    createdBy: string;
    createdAt: string;
}

const app = express();
const port = 3000;

app.get('/generate-pdf', async (req: Request, res: Response): Promise<void> => {
    try {
        const { volunteerData, eventData, volunteerHistoryData }: DatabaseData = await fetchData();

        const doc = new PDFDocument();
        doc.pipe(fs.createWriteStream('output.pdf'));

        doc.text('Volunteers and Participation History');
        volunteerData.forEach((volunteer: Volunteer) => {
            doc.text(`Volunteer: ${volunteer.fullName}`);
            
            const history = volunteerHistoryData.filter(
                (history: VolunteerHistory) => history.volunteerId === volunteer._id
            );

            history.forEach((record: VolunteerHistory) => {
                const event = eventData.find((event: Event) => event._id === record.eventId);
                if (event) {
                    doc.text(`  Event: ${event.eventName}`);
                }
            });
        });

        doc.text('Events and Participants');
        eventData.forEach((event: Event) => {
            doc.text(`Event: ${event.eventName}`);
            doc.text(`  Description: ${event.description}`);
            doc.text(`  Location: ${event.location}`);
            doc.text(`  Required Skills: ${event.requiredSkills}`);
            doc.text(`  Urgency: ${event.urgency}`);
            doc.text(`  Event Date: ${event.eventDate}`);
            doc.text(`  Created By: ${event.createdBy}`);
            doc.text(`  Created At: ${event.createdAt}`);

            const participants = volunteerHistoryData.filter(
                (history: VolunteerHistory) => history.eventId === event._id
            );
            participants.forEach((participant: VolunteerHistory) => {
                const volunteer = volunteerData.find(
                    (volunteer: Volunteer) => volunteer._id === participant.volunteerId
                );
                if (volunteer) {
                    doc.text(`    Participant: ${volunteer.fullName}`);
                }
            });
        });

        doc.end();
        res.download('output.pdf');
    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).send('Error generating PDF');
    }
});

app.get('/generate-csv', async (req: Request, res: Response): Promise<void> => {
    try {
        const { volunteerData, eventData, volunteerHistoryData }: DatabaseData = await fetchData();

        const volunteerCsvWriter = createObjectCsvWriter({
            path: 'volunteers.csv',
            header: [
                { id: 'volunteerName', title: 'Volunteer Name' },
                { id: 'eventName', title: 'Event Name' }
            ]
        });

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

        const volunteerRecords: VolunteerCsvRecord[] = [];
        const eventRecords: EventCsvRecord[] = [];

        volunteerData.forEach((volunteer: Volunteer) => {
            const history = volunteerHistoryData.filter(
                (history: VolunteerHistory) => history.volunteerId === volunteer._id
            );

            history.forEach((record: VolunteerHistory) => {
                const event = eventData.find((event: Event) => event._id === record.eventId);
                if (event) {
                    volunteerRecords.push({
                        volunteerName: volunteer.fullName,
                        eventName: event.eventName
                    });
                }
            });
        });

        eventData.forEach((event: Event) => {
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
    } catch (error) {
        console.error('Error generating CSV:', error);
        res.status(500).send('Error generating CSV');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});