import React from 'react';
import PropTypes from 'prop-types';

// PUBLIC_INTERFACE
export default function TopNav({ onNew, totalCount }) {
  /** Top navigation bar with brand and global actions. */
  return (
    <nav className="ocean-topnav" aria-label="Top navigation">
      <div className="topnav-inner">
        <div className="brand" aria-label="Brand">
          <span className="logo" aria-hidden="true" />
          <span>Simple Notes</span>
        </div>
        <div className="top-actions">
          <span aria-live="polite" className="sr-only" />
          <button className="btn btn-primary" onClick={onNew} aria-label="Create new note (N)">
            + New note
          </button>
          <span aria-label={`Total notes: ${totalCount}`} style={{ color: '#6B7280', fontSize: 13 }}>
            {totalCount}
          </span>
        </div>
      </div>
    </nav>
  );
}

TopNav.propTypes = {
  onNew: PropTypes.func.isRequired,
  totalCount: PropTypes.number.isRequired,
};
