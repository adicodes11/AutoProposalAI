import mongoose from 'mongoose';

export const ConnectDB = async () => {
  try {
    if (mongoose.connection.readyState >= 1) {
      console.log('Database already connected');
      return mongoose.connection; // Return the existing connection
    }

    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Database connected successfully');
    return mongoose.connection; // Return the connection object after successful connection

  } catch (error) {
    console.error('Database connection error:', error);
    throw new Error('Database connection failed');
  }
};
