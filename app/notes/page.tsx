import { fetchNotes } from '@/lib/api';
import NotesClient from './Notes.client';

export default async function NotesPage() {
  const search = '';
  const page = 1;

  const data = await fetchNotes(search, page);

  return (
    <NotesClient
      initialNotes={data.notes}
      initialTotalPages={data.totalPages}
      initialSearch={search}
      initialPage={page}
    />
  );
}
