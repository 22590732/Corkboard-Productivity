import React, {useState} from 'react';
import {ExpandedNoteModal} from './Modals';

function StickyNote({note, updateNote, deleteNote}) {
    const [showModal, setShowModal] = useState(false);
    const [dragging, setDragging] = useState(false);
    const [hasMoved, setHasMoved] = useState(false);
    const [offset, setOffset] = useState({x: 0, y: 0});

    const handleMouseDown = (e) => {
        setDragging(true);
        setHasMoved(false);
        setOffset({x: e.clientX - note.position.x, y: e.clientY - note.position.y});
    };

    const handleMouseMove = (e) => {
        if (!dragging) return;
        setHasMoved(true);
        updateNote({...note, position: {x: e.clientX - offset.x, y: e.clientY - offset.y}});
    };

    const handleMouseUp = () => {
        setDragging(false);
        // Reset hasMoved after a short delay to prevent click from triggering
        setTimeout(() => setHasMoved(false), 100);
    };

    const handleClick = () => {
        if (!hasMoved) {
            setShowModal(true);
        }
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const formatDate = (dateString) => {
        if (!dateString) return {date: 'No due date', weekday: ''};

        const date = new Date(dateString);

        // Get individual components
        const day = date.getDate();
        const month = date.toLocaleDateString('en-US', {month: 'long'});
        const weekday = date.toLocaleDateString('en-US', {weekday: 'long'});

        // Return object with separate date and weekday
        return {
            date: `${day} ${month}`,
            weekday: weekday
        };
    }; return (
        <>
            <div
                style={{
                    position: 'absolute',
                    left: note.position.x,
                    top: note.position.y,
                    width: 200,
                    minHeight: 120,
                    backgroundColor: note.color || '#fffb88',
                    border: '1px solid #ccc',
                    padding: '12px',
                    cursor: dragging ? 'grabbing' : 'grab',
                    zIndex: 1,
                    borderRadius: '5px',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                    transition: 'transform 0.1s ease'
                }}
                onClick={handleClick}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseEnter={(e) => {
                    if (!dragging) {
                        e.target.style.transform = 'scale(1.02)';
                    }
                }}
                onMouseLeave={(e) => {
                    e.target.style.transform = 'scale(1)';
                }}
            >
                <div style={{
                    fontWeight: 'bold',
                    fontSize: '1.1em',
                    marginBottom: '8px',
                    lineHeight: '1.3',
                    wordWrap: 'break-word',
                    hyphens: 'auto',
                    color: '#000'
                }}>
                    {note.title || 'Untitled'}
                </div>

                <div style={{
                    fontSize: '0.9em',
                    color: '#666',
                    marginBottom: '8px'
                }}>
                    <div>{formatDate(note.dueDate).date}</div>
                    {formatDate(note.dueDate).weekday && (
                        <div style={{marginTop: '2px', marginLeft: '16px'}}>
                            {formatDate(note.dueDate).weekday}
                        </div>
                    )}
                </div>

                {note.tasks && note.tasks.length > 0 && (
                    <div style={{
                        fontSize: '0.8em',
                        color: '#000'
                    }}>
                        📋 {note.tasks.filter(task => task.done).length}/{note.tasks.length} tasks
                    </div>
                )}

                <div style={{
                    position: 'absolute',
                    bottom: '5px',
                    right: '8px',
                    fontSize: '0.7em',
                    color: '#999',
                    fontStyle: 'italic'
                }}>
                    Click to expand
                </div>
            </div>

            <ExpandedNoteModal
                showModal={showModal}
                note={note}
                updateNote={updateNote}
                deleteNote={deleteNote}
                closeModal={closeModal}
            />
        </>
    );
}

export default StickyNote;