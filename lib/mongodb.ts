import { MongoClient, Db } from 'mongodb';

// Validate MongoDB URI format
function validateMongoUri(uri: string): void {
  if (!uri) {
    throw new Error('MongoDB URI is empty or undefined');
  }
  
  // Check for valid MongoDB URI scheme
  if (!uri.startsWith('mongodb://') && !uri.startsWith('mongodb+srv://')) {
    throw new Error(
      `Invalid MongoDB URI scheme. Expected 'mongodb://' or 'mongodb+srv://', but got: '${uri.split('://')[0]}://'`
    );
  }
}

// Global cache for MongoDB client promise
let globalWithMongo = global as typeof globalThis & {
  _mongoClientPromise?: Promise<MongoClient>;
};

// Lazy initialization function
function getClientPromise(): Promise<MongoClient> {
  // Check if MongoDB URI is available
  if (!process.env.MONGODB_URI) {
    throw new Error('Please add your MongoDB URI to .env');
  }

  const uri = process.env.MONGODB_URI;
  
  // Validate URI format
  validateMongoUri(uri);

  const options = {};

  if (process.env.NODE_ENV === 'development') {
    // In development mode, use a global variable to preserve the connection
    if (!globalWithMongo._mongoClientPromise) {
      const client = new MongoClient(uri, options);
      globalWithMongo._mongoClientPromise = client.connect();
    }
    return globalWithMongo._mongoClientPromise;
  } else {
    // In production mode, create a new client for each connection
    const client = new MongoClient(uri, options);
    return client.connect();
  }
}

export async function getDb(): Promise<Db> {
  const client = await getClientPromise();
  return client.db('skills-marketplace');
}

// Export a function that returns the client promise
export default function getClient(): Promise<MongoClient> {
  return getClientPromise();
}
