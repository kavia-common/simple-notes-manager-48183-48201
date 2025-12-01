import React from 'react';
import './App.css';
import './styles/theme.css';
import TopNav from './components/TopNav';
import Sidebar from './components/Sidebar';
import Editor from './components/Editor';
import { NotesProvider, useNotes } from './context/NotesContext';

// Main layout component to consume context and render UI
function NotesLayout() {
  const {
    notes,
    filteredNotes,
    selectedId,
    selectNote,
    createNote,
    deleteNote,
    setQuery,
    query,
    updateNote,
  } = useNotes();

  const selected = notes.find(n => n.id === selectedId) || null;

  return (
    <div className="ocean-app">
      <TopNav onNew={createNote} totalCount={notes.length} />
      <div className="ocean-body">
        <aside className="ocean-sidebar" aria-label="Notes sidebar">
          <Sidebar
            notes={filteredNotes}
            query={query}
            onQueryChange={setQuery}
            onSelect={selectNote}
            selectedId={selectedId}
            onNew={createNote}
          />
        </aside>
        <main className="ocean-main" role="main" aria-label="Note editor">
          <Editor
            note={selected}
            onChange={updateNote}
            onDelete={() => {
              if (selected) deleteNote(selected.id);
            }}
          />
        </main>
      </div>
      <footer className="ocean-footer" aria-label="Footer">
        <span>Ocean Professional • Simple Notes</span>
        <span className="footer-meta">
          {new Date().getFullYear()} • {notes.length} note{notes.length !== 1 ? 's' : ''}
        </span>
      </footer>
    </div>
  );
}

// PUBLIC_INTERFACE
function App() {
  /** Root of the Notes app providing context and layout. */
  return (
    <NotesProvider>
      <NotesLayout />
    </NotesProvider>
  );
}

export default App;
