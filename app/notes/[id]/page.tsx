import css from './NoteDetails.module.css';
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import { fetchNoteById } from '../../../lib/api';
import NoteDetailsClient from './NoteDetails.client';

interface NoteDetailsPageProps {
  params: { id: string };
}

export default async function NoteDetailsPage({ params }: NoteDetailsPageProps) {
  const id = Number(params.id);
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <main className={css.container}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <NoteDetailsClient id={id} />
      </HydrationBoundary>
    </main>
  );
}
