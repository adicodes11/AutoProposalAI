import { NextResponse } from 'next/server';

// Assuming you have some logic to generate or fetch the proposal here
export async function GET() {
  try {
    // You can implement your proposal generation logic here
    const proposalData = {
      message: 'Proposal generated successfully!',
      proposalLink: '/proposalPages/previewProposal',  // URL to the proposal preview page
    };

    return NextResponse.json(proposalData, { status: 200 });
  } catch (error) {
    console.error('Error generating proposal:', error);
    return NextResponse.json(
      { error: 'Failed to generate proposal. Please try again later.' },
      { status: 500 }
    );
  }
}
