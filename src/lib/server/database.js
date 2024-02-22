import { MongoClient } from "mongodb";

export async function connectToDatabase() {
  return await MongoClient.connect(process.env.MONGODB_URI);
}

export async function insertDocument(client, collection, document) {
  const db = client.db();
  return await db.collection(collection).insertOne(document);
}

export async function getAllDocuments({ client, collection, sort, filter }) {
  const db = client.db();
  return await db.collection(collection).find(filter).sort(sort).toArray();
}

export async function findDocument(client, collection, document) {
  const db = client.db();
  return await db.collection(collection).findOne(document);
}

export async function updateDocument(client, collection, document, target) {
  const db = client.db();
  return await db.collection(collection).updateOne(document, target);
}
