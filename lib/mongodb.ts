import { MongoClient, Db } from 'mongodb';

// Validate MongoDB URI format
function validateMongoUri(uri: string): void {
  if (!uri) {
    throw new Error('MongoDB URI is empty or undefined');
  }
  
  // Check for valid MongoDB URI scheme
  if (!uri.startsWith('mongodb://') && !uri.startsWith('mongodb+srv://')) {
    const scheme = uri.includes('://') ? uri.split('://')[0] : uri.substring(0, 20);
    throw new Error(
      `Invalid MongoDB URI scheme. Expected 'mongodb://' or 'mongodb+srv://', but got: '${scheme}://'`
    );
  }
}

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

  // Use global cache in both development and production to reuse connections
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    const client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  
  return globalWithMongo._mongoClientPromise;
}

export async function getDb(): Promise<Db> {
  const client = await getClientPromise();
  return client.db('skills-marketplace');
}
