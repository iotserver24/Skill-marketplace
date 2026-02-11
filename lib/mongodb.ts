import { MongoClient, Db } from 'mongodb';

// Validate MongoDB URI format
function validateMongoUri(uri: string): void {
  if (!uri) {
    throw new Error('MongoDB URI is empty or undefined');
  }
  
  // Check for valid MongoDB URI scheme
  if (!uri.startsWith('mongodb://') && !uri.startsWith('mongodb+srv://')) {
    throw new Error(
      "Invalid MongoDB URI scheme. Expected 'mongodb://' or 'mongodb+srv://'"
    );
  }
}

// Lazy initialization function
function getClientPromise(): Promise<MongoClient> {
  // Check if MongoDB URI is available
  if (!process.env.MONGODB_URI) {
    throw new Error(
      'Environment variable MONGODB_URI is not set. Configure it in your .env file for local development or in your deployment platform\'s environment settings (e.g., https://vercel.com/docs/projects/environment-variables).'
    );
  }

  const uri = process.env.MONGODB_URI;
  
  // Validate URI format
  validateMongoUri(uri);

  const options = {};

  // Use global cache in both development and production to reuse connections
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    const client = new MongoClient(uri, options);
    // Wrap the connection promise to clear cache on failure
    globalWithMongo._mongoClientPromise = client.connect().catch((error) => {
      // Clear the cached promise so next attempt can retry
      globalWithMongo._mongoClientPromise = undefined;
      throw error;
    });
  }
  
  return globalWithMongo._mongoClientPromise;
}

export async function getDb(): Promise<Db> {
  const client = await getClientPromise();
  return client.db('skills-marketplace');
}
