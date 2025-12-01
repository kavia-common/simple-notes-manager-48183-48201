import React, { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { debounce } from '../utils/debounce';

// PUBLIC_INTERFACE
export default function Editor({ note, onChange, onDelete }) {
  /**
   * Main editor for the selected note. Debounced autosave for content and title.
   */
  const [title, setTitle] = useState(note ? note.title : '');
  const [content, setContent] = useState(note ? note.content : '');
  const [saving, setSaving] = useState(false);
  const mounted = useRef(false);

  useEffect(() => {
    setTitle(note ? note.title : '');
    setContent(note ? note.content : '');
  }, [note?.id]);

  // Debounce local UI save indicator
  const triggerSaved = useMemo(() => debounce(() => setSaving(false), 800), []);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    if (!note) return;
    setSaving(true);
    onChange(note.id, { title }, { debounce: true });
    triggerSaved();
  }, [title]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!mounted.current) return;
    if (!note) return;
    setSaving(true);
    onChange(note.id, { content }, { debounce: true });
    triggerSaved();
  }, [content]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!note) {
    return (
      <div className="empty" role="status" aria-live="polite">
        Select a note from the left or create a new one.
        <div className="hint">Use the New button or press “N”.</div>
      </div>
    );
  }

  return (
    <>
      <div className="editor-toolbar" aria-label="Editor toolbar">
        <div className="status" aria-live="polite">
          {saving ? 'Saving…' : 'All changes saved'}
        </div>
        <div className="toolbar-actions">
          <button
            className="btn btn-danger"
            onClick={() => {
              if (window.confirm('Delete this note? This cannot be undone.')) {
                onDelete();
              }
            }}
            aria-label="Delete note"
          >
            Delete
          </button>
        </div>
      </div>
      <div className="editor">
        <input
          className="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note title"
          aria-label="Note title"
        />
        <textarea
          className="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start writing your note…"
          aria-label="Note content"
        />
      </div>
    </>
  );
}

Editor.propTypes = {
  note: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string,
    content: PropTypes.string,
    updatedAt: PropTypes.number.isRequired,
  }),
  onChange: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};
