import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

// MongoDB connection URI and database name
const uri = 'mongodb+srv://Ashiya:Ashiya@carproposal.h2log.mongodb.net/?retryWrites=true&w=majority&appName=CarProposal';
const client = new MongoClient(uri);

export async function GET() {
  try {
    // Connect to MongoDB
    await client.connect();
    const database = client.db('CarProposalDB');
    const collection = database.collection('Proposals');  // Assuming 'proposals' is your collection

    // Fetch the latest proposal (or modify to fetch a specific proposal)
    const proposal = await collection.findOne({}, { sort: { _id: -1 } });  // Fetch the most recent proposal

    if (!proposal) {
      throw new Error('No proposal found');
    }

    return NextResponse.json(proposal, { status: 200 });
  } catch (error) {
    console.error('Error fetching proposal from database:', error);
    return NextResponse.json(
      { error: 'Failed to fetch proposal data from database.' },
      { status: 500 }
    );
  } finally {
    await client.close();  // Close the connection
  }
}
