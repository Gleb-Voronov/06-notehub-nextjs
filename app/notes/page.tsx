import { fetchNotes } from '../../lib/api';
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import NotesClient from './Notes.client';

export default async function NotesPage() {
  const queryClient = new QueryClient();
  const search = '';
  const page = 1;

  await queryClient.prefetchQuery({
    queryKey: ['notes', search, page],
    queryFn: () => fetchNotes(search, page),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient search={search} page={page} />
    </HydrationBoundary>
  );
}
