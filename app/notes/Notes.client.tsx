'use client';

import { useState } from 'react';
import { useDebounce } from 'use-debounce';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { fetchNotes } from '../../lib/api';
import NoteList from '../../components/NoteList/NoteList';
import SearchBox from '../../components/SearchBox/SearchBox';
import Pagination from '../../components/Pagination/Pagination';
import NoteModal from '../../components/NoteModal/NoteModal';
import css from '../../components/NoteForm/NoteForm.module.css'

interface NotesClientProps {
  search: string;
  page: number;
}

export default function NotesClient({ search, page }: NotesClientProps) {
  const [searchQuery, setSearchQuery] = useState(search);
  const [currentPage, setCurrentPage] = useState(page);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [debouncedSearchQuery] = useDebounce(searchQuery, 300);

  const { data } = useQuery({
    queryKey: ['notes', debouncedSearchQuery, currentPage],
    queryFn: () => fetchNotes(debouncedSearchQuery, currentPage),
    placeholderData: keepPreviousData,
    refetchOnMount: false,
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
        <button    className={css.submitButton} onClick={openModal}>Create note +</button>
      </header>

      {data?.notes.length ? <NoteList notes={data.notes} /> : <p>No notes found.</p>}
      {isModalOpen && <NoteModal onClose={closeModal} />}
    </div>
  );
}
