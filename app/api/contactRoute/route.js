import nodemailer from 'nodemailer';

export async function POST(req, res) {
  try {
    const body = await req.json();
    const { name, email, message } = body;

    // Validate form data
    if (!name || !email || !message) {
      return new Response(JSON.stringify({ error: 'Please fill out all the fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Set up Nodemailer transport with Gmail or other service
    const transporter = nodemailer.createTransport({
      service: 'gmail', // You can use a different service like Outlook or a custom SMTP
      auth: {
        user: process.env.GMAIL_USER, // Replace with your Gmail address
        pass: process.env.GMAIL_PASS, // Replace with your Gmail app password (or environment variable)
      },
    });

    // Set up email options
    const mailOptions = {
      from: email, // The email of the person filling out the form
      to: process.env.GMAIL_USER, // Your email where you'll receive the message
      subject: `New Contact Form Submission from ${name}`,
      text: `
        You have a new contact form submission:
        Name: ${name}
        Email: ${email}
        Message: ${message}
      `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    // Send a success response
    return new Response(JSON.stringify({ message: 'Email sent successfully!' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error sending email:', error);
    return new Response(JSON.stringify({ error: 'Failed to send the email' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
