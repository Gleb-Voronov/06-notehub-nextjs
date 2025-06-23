'use client';

import { useState } from 'react';
import { useDebounce } from 'use-debounce';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api';
import NoteList from '@/components/NoteList/NoteList';
import SearchBox from '@/components/SearchBox/SearchBox';
import Pagination from '@/components/Pagination/Pagination';
import NoteModal from '@/components/NoteModal/NoteModal';
import type { Note } from '@/types/note';
import css from '../../components/NoteForm/NoteForm.module.css'

interface NotesClientProps {
  initialNotes: Note[];
  initialTotalPages: number;
  initialSearch: string;
  initialPage: number;
}

export default function NotesClient({
  initialNotes,
  initialTotalPages,
  initialSearch,
  initialPage,
}: NotesClientProps) {
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [debouncedSearchQuery] = useDebounce(searchQuery, 300);

  const { data } = useQuery({
    queryKey: ['notes', debouncedSearchQuery, currentPage],
    queryFn: () => fetchNotes(debouncedSearchQuery, currentPage),
    placeholderData: keepPreviousData,
    initialData: {
      notes: initialNotes,
      totalPages: initialTotalPages,
    },
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div>
      <header>
        <SearchBox searchQuery={searchQuery} onChange={handleSearch} />
        {data && data.totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            totalPages={data.totalPages}
          />
        )}
        <button  className={css.submitButton} onClick={openModal}>Create note +</button>
      </header>
      {data?.notes && data.notes.length > 0 && <NoteList notes={data.notes} />}
      {isModalOpen && <NoteModal onClose={closeModal} />}
    </div>
  );
}
