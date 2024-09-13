import formidable from 'formidable';
import fs from 'fs';
import fetch from 'node-fetch';
import { NextResponse } from 'next/server';
import Proposal from '@/models/Proposal'; // Ensure the Proposal model is set up correctly
import { ConnectDB } from '@/lib/config/db';

export const config = {
  api: {
    bodyParser: false, // Disable body parsing to handle file uploads
  },
};

export default async function POST(req) {
  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return NextResponse.json({ error: 'Failed to parse form data' }, { status: 500 });
    }

    const { fullName, userId } = fields;
    const signatureFile = files.image; // Uploaded image file

    // Check if all fields are present
    if (!fullName || !userId || !signatureFile) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Process image with remove.bg
    try {
      const formData = new FormData();
      formData.append('size', 'auto');
      formData.append('image_file', fs.createReadStream(signatureFile.filepath));

      const response = await fetch('https://api.remove.bg/v1.0/removebg', {
        method: 'POST',
        headers: {
          'X-Api-Key': 'Y2gzyBQtQrvtHaAdF8ivgPuw', // Your remove.bg API key
        },
        body: formData,
      });

      if (!response.ok) {
        return NextResponse.json({ error: `Error removing background: ${response.statusText}` }, { status: 500 });
      }

      const buffer = await response.arrayBuffer();
      const cleanedImageUrl = `data:image/png;base64,${Buffer.from(buffer).toString('base64')}`;

      // Connect to MongoDB
      await ConnectDB();

      // Save the proposal in the database
      const newProposal = await Proposal.create({
        fullName,
        signatureUrl: cleanedImageUrl,
        userId,
        createdAt: new Date(),
        validated: true,
      });

      return NextResponse.json({ success: true, data: newProposal._id });
    } catch (error) {
      console.error('Error processing proposal:', error);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  });
}
