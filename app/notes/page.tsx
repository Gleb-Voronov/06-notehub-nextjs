import { fetchNotes } from '@/lib/api';
import NotesClient from './Notes.client';

export default async function NotesPage() {
  try {
    const page = 1;
    const search = '';
    const data = await fetchNotes(search, page);

    return (
      <NotesClient
        initialNotes={data.notes}
        initialTotalPages={data.totalPages}
        initialSearch={search}
        initialPage={page}
      />
    );
  } catch (error) {
    console.error('Failed to fetch notes:', error);
    return <div>Failed to load notes. Please try again later.</div>;
  }
}
