import React, { createContext, useContext, useEffect, useMemo, useReducer, useRef, useCallback, useState } from 'react';
import { loadNotes, saveNotes } from '../utils/storage';
import { debounce } from '../utils/debounce';

/**
 * Note model
 * @typedef {{ id: string, title: string, content: string, updatedAt: number }} Note
 */

const NotesContext = createContext(null);

const initialState = {
  notes: [],
  selectedId: null,
  query: '',
};

function sortDesc(a, b) {
  return (b.updatedAt || 0) - (a.updatedAt || 0);
}

function reducer(state, action) {
  switch (action.type) {
    case 'INIT': {
      const notes = (action.payload || []).sort(sortDesc);
      return { ...state, notes, selectedId: notes[0]?.id || null };
    }
    case 'CREATE': {
      const note = action.payload;
      const notes = [note, ...state.notes].sort(sortDesc);
      return { ...state, notes, selectedId: note.id };
    }
    case 'UPDATE': {
      const { id, data } = action.payload;
      const notes = state.notes
        .map(n => (n.id === id ? { ...n, ...data, updatedAt: Date.now() } : n))
        .sort(sortDesc);
      return { ...state, notes };
    }
    case 'DELETE': {
      const id = action.payload;
      const notes = state.notes.filter(n => n.id !== id);
      const selectedId = state.selectedId === id ? notes[0]?.id || null : state.selectedId;
      return { ...state, notes, selectedId };
    }
    case 'SELECT':
      return { ...state, selectedId: action.payload };
    case 'QUERY':
      return { ...state, query: action.payload };
    default:
      return state;
  }
}

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

// PUBLIC_INTERFACE
export function NotesProvider({ children }) {
  /**
   * Provides notes state and actions with persistence to localStorage.
   */
  const [state, dispatch] = useReducer(reducer, initialState);
  const hasLoadedRef = useRef(false);

  // Load from storage on mount
  useEffect(() => {
    const data = loadNotes();
    dispatch({ type: 'INIT', payload: data });
    hasLoadedRef.current = true;
  }, []);

  // Persist to storage when notes change
  useEffect(() => {
    if (!hasLoadedRef.current) return;
    saveNotes(state.notes);
  }, [state.notes]);

  const createNote = useCallback(() => {
    const newNote = {
      id: uid(),
      title: 'Untitled',
      content: '',
      updatedAt: Date.now(),
    };
    dispatch({ type: 'CREATE', payload: newNote });
  }, []);

  const updateNoteImmediate = useCallback((id, data) => {
    dispatch({ type: 'UPDATE', payload: { id, data } });
  }, []);

  // Debounced update for autosave UX
  const debouncedUpdate = useMemo(() => debounce(updateNoteImmediate, 600), [updateNoteImmediate]);

  const updateNote = useCallback((id, data, { debounce: shouldDebounce = true } = {}) => {
    if (shouldDebounce) debouncedUpdate(id, data);
    else updateNoteImmediate(id, data);
  }, [debouncedUpdate, updateNoteImmediate]);

  const deleteNote = useCallback((id) => {
    dispatch({ type: 'DELETE', payload: id });
  }, []);

  const selectNote = useCallback((id) => {
    dispatch({ type: 'SELECT', payload: id });
  }, []);

  const setQuery = useCallback((q) => {
    dispatch({ type: 'QUERY', payload: q });
  }, []);

  const filteredNotes = useMemo(() => {
    const q = (state.query || '').toLowerCase().trim();
    const base = state.notes.slice().sort(sortDesc);
    if (!q) return base;
    return base.filter(n =>
      n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q)
    );
  }, [state.notes, state.query]);

  const value = useMemo(() => ({
    notes: state.notes,
    filteredNotes,
    selectedId: state.selectedId,
    query: state.query,
    createNote,
    updateNote,
    deleteNote,
    selectNote,
    setQuery,
  }), [state.notes, filteredNotes, state.selectedId, state.query, createNote, updateNote, deleteNote, selectNote, setQuery]);

  return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>;
}

// PUBLIC_INTERFACE
export function useNotes() {
  /** Hook to access the notes context. */
  const ctx = useContext(NotesContext);
  if (!ctx) throw new Error('useNotes must be used within NotesProvider');
  return ctx;
}
