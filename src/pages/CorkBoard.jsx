import React, {useState, useEffect} from 'react';
import StickyNote from '../components/StickyNote';
import {CreateNoteModal, CorkboardManagerModal} from '../components/Modals';
import {v4 as uuidv4} from 'uuid';
import {loadCorkboard, autoSave} from '../utils/storage';

function Corkboard() {
    const [notes, setNotes] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showManagerModal, setShowManagerModal] = useState(false);
    const [currentCorkboardName, setCurrentCorkboardName] = useState('Default Corkboard');
    const [newNoteData, setNewNoteData] = useState({
        title: '',
        dueDate: ''
    });

    // Load saved corkboard on component mount
    useEffect(() => {
        const savedCorkboard = loadCorkboard();
        if (savedCorkboard) {
            setNotes(savedCorkboard.notes);
            setCurrentCorkboardName(savedCorkboard.name);
        }
    }, []);

    // Auto-save whenever notes change
    useEffect(() => {
        if (notes.length > 0 || currentCorkboardName !== 'Default Corkboard') {
            autoSave(notes, currentCorkboardName);
        }
    }, [notes, currentCorkboardName]);

    // Array of sticky note colors
    const stickyNoteColors = [
        '#ffeb9c', // Yellow
        '#ffd1dc', // Pink
        '#d1ffd1', // Light Green
        '#e6e6fa', // Lavender
        '#ffeaa7', // Light Yellow
        '#fab1a0', // Light Orange
        '#fdcb6e', // Orange
        '#a29bfe', // Light Purple
        '#fd79a8', // Hot Pink
        '#00cec9'  // Teal
    ];

    const getRandomColor = () => {
        return stickyNoteColors[Math.floor(Math.random() * stickyNoteColors.length)];
    };

    const openModal = () => {
        setShowModal(true);
        setNewNoteData({title: '', dueDate: ''});
    };

    const closeModal = () => {
        setShowModal(false);
        setNewNoteData({title: '', dueDate: ''});
    };

    const createNote = () => {
        if (!newNoteData.title.trim()) {
            alert('Please enter a title for the sticky note');
            return;
        }

        const newNote = {
            id: uuidv4(),
            title: newNoteData.title,
            dueDate: newNoteData.dueDate || new Date().toISOString().split('T')[0],
            tasks: [],
            position: {x: Math.random() * (window.innerWidth - 300) + 250, y: Math.random() * (window.innerHeight - 350) + 150},
            color: getRandomColor(),
        };
        setNotes([...notes, newNote]);
        closeModal();
    };

    const addNote = () => {
        openModal();
    };

    const updateNote = (updatedNote) => {
        setNotes(notes.map(note => note.id === updatedNote.id ? updatedNote : note));
    };

    const deleteNote = (id) => {
        setNotes(notes.filter(note => note.id !== id));
    };

    const handleLoadCorkboard = (corkboard) => {
        setNotes(corkboard.notes);
        setCurrentCorkboardName(corkboard.name);
    };

    const openManagerModal = () => {
        setShowManagerModal(true);
    };

    const closeManagerModal = () => {
        setShowManagerModal(false);
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: '#8B4513', // Brown corkboard color
            backgroundImage: `
                radial-gradient(circle at 20% 80%, rgba(139, 69, 19, 0.3) 1px, transparent 1px),
                radial-gradient(circle at 80% 20%, rgba(139, 69, 19, 0.3) 1px, transparent 1px),
                radial-gradient(circle at 40% 40%, rgba(139, 69, 19, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '100px 100px, 150px 150px, 80px 80px',
            overflow: 'hidden'
        }}>
            {/* Header with logo, title, and add button */}
            <div style={{
                position: 'absolute',
                top: '20px',
                left: '20px',
                zIndex: 1000,
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                padding: '10px 20px',
                borderRadius: '10px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}>
                <h1 style={{
                    margin: 0,
                    fontSize: '1.8em',
                    color: '#8B4513',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}>
                    <img src="/images/pin.png" alt="Pin" style={{
                        width: '24px',
                        height: '24px'
                    }} />
                    Corkboard
                </h1>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    margin: '0 15px'
                }}>
                    <div style={{
                        fontSize: '0.9em',
                        color: '#666',
                        marginBottom: '5px'
                    }}>Current:</div>
                    <div style={{
                        fontSize: '1.1em',
                        fontWeight: 'bold',
                        color: '#8B4513'
                    }}>{currentCorkboardName}</div>
                </div>
                <button
                    onClick={openManagerModal}
                    style={{
                        backgroundColor: '#2196F3',
                        color: 'white',
                        border: 'none',
                        padding: '10px 15px',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '1em',
                        fontWeight: 'bold'
                    }}
                >
                    📁 Manage
                </button>
                <button
                    onClick={addNote}
                    style={{
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        border: 'none',
                        padding: '10px 15px',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '1em',
                        fontWeight: 'bold'
                    }}
                >
                    + Add Sticky Note
                </button>
            </div>

            {notes.map(note => (
                <StickyNote
                    key={note.id}
                    note={note}
                    updateNote={updateNote}
                    deleteNote={deleteNote}
                />
            ))}

            {/* Modal for creating new sticky note */}
            <CreateNoteModal
                showModal={showModal}
                newNoteData={newNoteData}
                setNewNoteData={setNewNoteData}
                closeModal={closeModal}
                createNote={createNote}
            />

            {/* Modal for managing corkboards */}
            <CorkboardManagerModal
                showModal={showManagerModal}
                closeModal={closeManagerModal}
                onLoadCorkboard={handleLoadCorkboard}
                currentCorkboardName={currentCorkboardName}
            />
        </div>
    );
}

export default Corkboard;