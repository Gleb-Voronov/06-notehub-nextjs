import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import { fetchNoteById } from '../../../lib/api';
import NoteDetailsClient from './NoteDetails.client';
import { notFound } from 'next/navigation';

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>; // тип параметра – Promise
}) {
  const resolvedParams = await params; // розгортаємо проміс
  const id = Number(resolvedParams.id);

  const queryClient = new QueryClient();

  try {
    await queryClient.prefetchQuery({
      queryKey: ['note', id],
      queryFn: () => fetchNoteById(id),
    });
  } catch {
    notFound();
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient id={id} />
    </HydrationBoundary>
  );
}
