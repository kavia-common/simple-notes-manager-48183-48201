import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

// PUBLIC_INTERFACE
export default function Sidebar({ notes, query, onQueryChange, onSelect, selectedId, onNew }) {
  /**
   * Sidebar with search input and notes list. Supports keyboard '/' to focus search and 'n' to create.
   */
  useEffect(() => {
    const onKey = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === '/' || (e.key === 'k' && (e.ctrlKey || e.metaKey))) {
        const el = document.getElementById('notes-search');
        if (el) { el.focus(); e.preventDefault(); }
      }
      if (e.key.toLowerCase() === 'n') {
        onNew();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onNew]);

  return (
    <>
      <div className="sidebar-header">
        <div className="search" role="search">
          <input
            id="notes-search"
            type="text"
            placeholder="Search notes…"
            aria-label="Search notes"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
          />
          <span className="kbd">/</span>
        </div>
        <button className="btn" onClick={onNew} aria-label="New note">
          + New
        </button>
      </div>
      <ul className="note-list" role="listbox" aria-label="Notes list">
        {notes.length === 0 ? (
          <li className="empty" aria-live="polite">
            No notes yet.
            <div className="hint">Click “New” to create your first note.</div>
          </li>
        ) : (
          notes.map(n => (
            <li
              key={n.id}
              role="option"
              aria-selected={selectedId === n.id}
              className={`note-row ${selectedId === n.id ? 'active' : ''}`}
              tabIndex={0}
              onClick={() => onSelect(n.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') onSelect(n.id);
              }}
            >
              <span className="title">{n.title || 'Untitled'}</span>
              <span className="preview">{n.content ? n.content.replace(/\n/g, ' ') : 'No content'}</span>
              <span className="meta">Updated {new Date(n.updatedAt).toLocaleString()}</span>
            </li>
          ))
        )}
      </ul>
    </>
  );
}

Sidebar.propTypes = {
  notes: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string,
    content: PropTypes.string,
    updatedAt: PropTypes.number.isRequired,
  })).isRequired,
  query: PropTypes.string.isRequired,
  onQueryChange: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  selectedId: PropTypes.string,
  onNew: PropTypes.func.isRequired,
};
