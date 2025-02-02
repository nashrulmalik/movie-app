import { Client, Databases, ID, Query, Models } from 'appwrite'

const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;

const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject(PROJECT_ID)

const database = new Databases(client);

// Define an interface for the Movie object (consistent with App.tsx)
interface Movie {
  id: number;
  poster_path: string | null;
  // Add other properties from the Movie interface if needed in this context
}

// Define an interface for the Appwrite document structure for trending movies
interface TrendingMovieDocument extends Models.Document {
  searchTerm: string;
  count: number;
  poster_url: URL;
  movie_id: number;
  // Inherits Appwrite document properties like $id, $createdAt, $updatedAt, $permissions
}


export const updateSearchCount = async (searchTerm: string, movie: Movie): Promise<void> => {
  // 1. Use Appwrite SDK to check if the search term exists in the database
 try {
  const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
    Query.equal('searchTerm', searchTerm),
  ]);

  // 2. If it does, update the count
  if(result.documents.length > 0) {
   const doc = result.documents[0] as TrendingMovieDocument; // Type assertion here

   await database.updateDocument(DATABASE_ID, COLLECTION_ID, doc.$id, {
    count: doc.count + 1,
   });
  // 3. If it doesn't, create a new document with the search term and count as 1
  } else {
   await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
    searchTerm,
    count: 1,
    movie_id: movie.id,
    poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
   });
  }
 } catch (error: any) { // Type error in catch block as any
  console.error(error);
 }
}

export const getTrendingMovies = async (): Promise<TrendingMovieDocument[]> => {
 try {
  const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
    Query.limit(5),
    Query.orderDesc("count")
  ]);

  return result.documents as TrendingMovieDocument[]; // Type assertion here
 } catch (error: any) { // Type error in catch block as any
  console.error(error);
  return []; // Return an empty array in case of error to handle it gracefully in the component
 }
}