import { NextApiRequest, NextApiResponse } from 'next';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import { fetchData } from '@/lib/dataAccess';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { userData, userProfiles, eventData, volunteerHistoryData } = await fetchData();

        const doc = new PDFDocument();
        const filePath = '/tmp/output.pdf'; // Use temp directory for serverless environment
        doc.pipe(fs.createWriteStream(filePath));

        doc.text('Volunteers and Participation History');
        userProfiles.forEach((profile) => {
            doc.text(`Volunteer: ${profile.fullName}`);
            
            const history = volunteerHistoryData.filter(
                (history) => history.userId === profile.userId
            );

            history.forEach((record) => {
                doc.text(`  Event: ${record.eventName}`);
                doc.text(`  Role: ${record.role}`);
                doc.text(`  Date: ${record.eventDate}`);
                doc.text(`  Location: ${record.eventLocation}`);
            });
        });

        doc.text('\nEvents and Participants');
        eventData.forEach((event) => {
            doc.text(`Event: ${event.eventName}`);
            doc.text(`  Description: ${event.description}`);
            doc.text(`  Location: ${event.location}`);
            doc.text(`  Required Skills: ${event.requiredSkills.join(', ')}`);
            doc.text(`  Urgency: ${event.urgency}`);
            doc.text(`  Event Date: ${event.eventDate}`);
            doc.text(`  Created By: ${event.createdBy}`);
            doc.text(`  Created At: ${event.createdAt.toLocaleDateString()}`);

            const participants = volunteerHistoryData.filter(
                (history) => history.eventId === event._id
            );
            participants.forEach((participant) => {
                const profile = userProfiles.find(
                    (profile) => profile.userId === participant.userId
                );
                if (profile) {
                    doc.text(`    Participant: ${profile.fullName} (Role: ${participant.role})`);
                }
            });
        });

        doc.end();

        const pdfBuffer = fs.readFileSync(filePath);
        fs.unlinkSync(filePath); // Clean up temp file

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=volunteer-report.pdf');
        res.send(pdfBuffer);

    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).json({ message: 'Error generating PDF' });
    }
}