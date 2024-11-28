import { NextApiRequest, NextApiResponse } from 'next';
import { createObjectCsvWriter } from 'csv-writer';
import { fetchData } from '@/lib/dataAccess';
import fs from 'fs';
import JSZip from 'jszip';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { userProfiles, eventData, volunteerHistoryData } = await fetchData();
        const volunteerFilePath = '/tmp/volunteers.csv';
        const eventFilePath = '/tmp/events.csv';

        const volunteerCsvWriter = createObjectCsvWriter({
            path: volunteerFilePath,
            header: [
                { id: 'volunteerName', title: 'Volunteer Name' },
                { id: 'eventName', title: 'Event Name' },
                { id: 'role', title: 'Role' },
                { id: 'eventDate', title: 'Event Date' }
            ]
        });

        const eventCsvWriter = createObjectCsvWriter({
            path: eventFilePath,
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

        const volunteerRecords = userProfiles.flatMap(profile => 
            volunteerHistoryData
                .filter(history => history.userId === profile.userId)
                .map(record => ({
                    volunteerName: profile.fullName,
                    eventName: record.eventName,
                    role: record.role,
                    eventDate: record.eventDate
                }))
        );

        const eventRecords = eventData.map(event => ({
            eventName: event.eventName,
            description: event.description,
            location: event.location,
            requiredSkills: event.requiredSkills.join(', '),
            urgency: event.urgency,
            eventDate: event.eventDate,
            createdBy: event.createdBy,
            createdAt: event.createdAt.toISOString()
        }));

        await volunteerCsvWriter.writeRecords(volunteerRecords);
        await eventCsvWriter.writeRecords(eventRecords);

        // Read the files and send as response
        const volunteersBuffer = fs.readFileSync(volunteerFilePath);
        const eventsBuffer = fs.readFileSync(eventFilePath);

        // Clean up temp files
        fs.unlinkSync(volunteerFilePath);
        fs.unlinkSync(eventFilePath);

        // Create a zip file containing both CSVs
        const zip = new JSZip();
        zip.file('volunteers.csv', volunteersBuffer);
        zip.file('events.csv', eventsBuffer);

        const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });

        res.setHeader('Content-Type', 'application/zip');
        res.setHeader('Content-Disposition', 'attachment; filename=volunteer-reports.zip');
        res.send(zipBuffer);

    } catch (error) {
        console.error('Error generating CSV:', error);
        res.status(500).json({ message: 'Error generating CSV' });
    }
}