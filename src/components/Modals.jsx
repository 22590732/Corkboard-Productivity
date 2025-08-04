import React, {useState, useEffect} from 'react';
import {getSavedCorkboards, loadSpecificCorkboard, deleteCorkboard, createNewCorkboard, renameCorkboard} from '../utils/storage';

// Modal for creating new sticky notes
export function CreateNoteModal({showModal, newNoteData, setNewNoteData, closeModal, createNote}) {
    if (!showModal) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 2000
        }}>
            <div style={{
                backgroundColor: 'white',
                padding: '30px',
                borderRadius: '15px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                width: '400px',
                maxWidth: '90vw'
            }}>
                <h2 style={{
                    margin: '0 0 20px 0',
                    color: '#8B4513',
                    textAlign: 'center'
                }}>Create New Sticky Note</h2>

                <div style={{marginBottom: '20px'}}>
                    <label style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontWeight: 'bold',
                        color: '#333'
                    }}>Title:</label>
                    <input
                        type="text"
                        value={newNoteData.title}
                        onChange={(e) => setNewNoteData({...newNoteData, title: e.target.value})}
                        placeholder="Enter deadline title..."
                        style={{
                            width: '100%',
                            padding: '12px',
                            border: '2px solid #ddd',
                            borderRadius: '8px',
                            fontSize: '16px',
                            boxSizing: 'border-box'
                        }}
                        autoFocus
                    />
                </div>

                <div style={{marginBottom: '30px'}}>
                    <label style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontWeight: 'bold',
                        color: '#333'
                    }}>Due Date:</label>
                    <input
                        type="date"
                        value={newNoteData.dueDate}
                        onChange={(e) => setNewNoteData({...newNoteData, dueDate: e.target.value})}
                        style={{
                            width: '100%',
                            padding: '12px',
                            border: '2px solid #ddd',
                            borderRadius: '8px',
                            fontSize: '16px',
                            boxSizing: 'border-box'
                        }}
                    />
                </div>

                <div style={{
                    display: 'flex',
                    gap: '10px',
                    justifyContent: 'flex-end'
                }}>
                    <button
                        onClick={closeModal}
                        style={{
                            padding: '12px 20px',
                            border: '2px solid #ddd',
                            borderRadius: '8px',
                            backgroundColor: 'white',
                            color: '#666',
                            cursor: 'pointer',
                            fontSize: '16px',
                            fontWeight: 'bold'
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={createNote}
                        style={{
                            padding: '12px 20px',
                            border: 'none',
                            borderRadius: '8px',
                            backgroundColor: '#4CAF50',
                            color: 'white',
                            cursor: 'pointer',
                            fontSize: '16px',
                            fontWeight: 'bold'
                        }}
                    >
                        Create Note
                    </button>
                </div>
            </div>
        </div>
    );
}

// Modal for expanded sticky note view
export function ExpandedNoteModal({showModal, note, updateNote, deleteNote, closeModal}) {
    if (!showModal || !note) return null;

    const addTask = () => {
        const task = prompt('Enter new task:');
        if (task) {
            updateNote({...note, tasks: [...note.tasks, {text: task, done: false}]});
        }
    };

    const updateTask = (index, newText) => {
        const newTasks = [...note.tasks];
        newTasks[index].text = newText;
        updateNote({...note, tasks: newTasks});
    };

    const toggleTaskDone = (index) => {
        const newTasks = [...note.tasks];
        newTasks[index].done = !newTasks[index].done;
        updateNote({...note, tasks: newTasks});
    };

    const deleteTask = (index) => {
        const newTasks = [...note.tasks];
        newTasks.splice(index, 1);
        updateNote({...note, tasks: newTasks});
    };

    const updateField = (field, value) => {
        updateNote({...note, [field]: value});
    };

    const handleDeleteNote = () => {
        if (window.confirm('Are you sure you want to delete this note?')) {
            deleteNote(note.id);
            closeModal();
        }
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 2000
        }}>
            <div style={{
                backgroundColor: note.color || '#fffb88',
                padding: '30px',
                borderRadius: '15px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                width: '500px',
                maxWidth: '90vw',
                maxHeight: '80vh',
                overflow: 'auto'
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '20px'
                }}>
                    <h2 style={{
                        margin: 0,
                        color: '#333',
                        fontSize: '1.5em'
                    }}>Sticky Note Details</h2>
                    <button
                        onClick={closeModal}
                        style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '24px',
                            cursor: 'pointer',
                            color: '#666'
                        }}
                    >
                        ✕
                    </button>
                </div>

                <div style={{marginBottom: '20px'}}>
                    <label style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontWeight: 'bold',
                        color: '#333'
                    }}>Title:</label>
                    <input
                        value={note.title}
                        onChange={(e) => updateField('title', e.target.value)}
                        placeholder="Deadline Title"
                        style={{
                            width: '100%',
                            padding: '12px',
                            border: '2px solid #ddd',
                            borderRadius: '8px',
                            fontSize: '18px',
                            fontWeight: 'bold',
                            boxSizing: 'border-box'
                        }}
                    />
                </div>

                <div style={{marginBottom: '25px'}}>
                    <label style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontWeight: 'bold',
                        color: '#333'
                    }}>Due Date:</label>
                    <input
                        type="date"
                        value={note.dueDate}
                        onChange={(e) => updateField('dueDate', e.target.value)}
                        style={{
                            width: '100%',
                            padding: '12px',
                            border: '2px solid #ddd',
                            borderRadius: '8px',
                            fontSize: '16px',
                            boxSizing: 'border-box'
                        }}
                    />
                </div>

                <div style={{marginBottom: '25px'}}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '15px'
                    }}>
                        <h4 style={{margin: 0, color: '#333'}}>Tasks:</h4>
                        <button
                            onClick={addTask}
                            style={{
                                backgroundColor: '#4CAF50',
                                color: 'white',
                                border: 'none',
                                padding: '8px 12px',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                fontSize: '14px'
                            }}
                        >
                            + Add Task
                        </button>
                    </div>

                    <ul style={{
                        listStyle: 'none',
                        padding: 0,
                        margin: 0,
                        maxHeight: '200px',
                        overflow: 'auto'
                    }}>
                        {note.tasks.map((task, index) => (
                            <li key={index} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                marginBottom: '10px',
                                padding: '10px',
                                backgroundColor: 'rgba(255, 255, 255, 0.5)',
                                borderRadius: '8px'
                            }}>
                                <input
                                    type="checkbox"
                                    checked={task.done}
                                    onChange={() => toggleTaskDone(index)}
                                    style={{cursor: 'pointer'}}
                                />
                                <input
                                    type="text"
                                    value={task.text}
                                    onChange={(e) => updateTask(index, e.target.value)}
                                    style={{
                                        textDecoration: task.done ? 'line-through' : 'none',
                                        flex: 1,
                                        border: 'none',
                                        background: 'transparent',
                                        fontSize: '16px',
                                        padding: '5px',
                                        color: '#000'
                                    }}
                                />
                                <button
                                    onClick={() => deleteTask(index)}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontSize: '18px',
                                        color: '#f44336'
                                    }}
                                >
                                    🗑
                                </button>
                            </li>
                        ))}
                    </ul>
                    {note.tasks.length === 0 && (
                        <p style={{
                            color: '#666',
                            fontStyle: 'italic',
                            textAlign: 'center',
                            margin: '20px 0'
                        }}>No tasks yet. Click "Add Task" to get started!</p>
                    )}
                </div>

                <div style={{
                    display: 'flex',
                    gap: '10px',
                    justifyContent: 'flex-end'
                }}>
                    <button
                        onClick={handleDeleteNote}
                        style={{
                            padding: '12px 20px',
                            border: 'none',
                            borderRadius: '8px',
                            backgroundColor: '#f44336',
                            color: 'white',
                            cursor: 'pointer',
                            fontSize: '16px',
                            fontWeight: 'bold'
                        }}
                    >
                        Delete Note
                    </button>
                    <button
                        onClick={closeModal}
                        style={{
                            padding: '12px 20px',
                            border: '2px solid #4CAF50',
                            borderRadius: '8px',
                            backgroundColor: '#4CAF50',
                            color: 'white',
                            cursor: 'pointer',
                            fontSize: '16px',
                            fontWeight: 'bold'
                        }}
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
}

// Modal for managing saved corkboards
export function CorkboardManagerModal({showModal, closeModal, onLoadCorkboard, currentCorkboardName}) {
    const [savedCorkboards, setSavedCorkboards] = useState([]);
    const [newCorkboardName, setNewCorkboardName] = useState('');
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [renamingCorkboard, setRenamingCorkboard] = useState(null);
    const [renameValue, setRenameValue] = useState('');

    useEffect(() => {
        if (showModal) {
            setSavedCorkboards(getSavedCorkboards());
        }
    }, [showModal]);

    if (!showModal) return null;

    const handleLoadCorkboard = (name) => {
        const corkboard = loadSpecificCorkboard(name);
        if (corkboard) {
            onLoadCorkboard(corkboard);
            closeModal();
        }
    };

    const handleDeleteCorkboard = (name) => {
        if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
            deleteCorkboard(name);
            setSavedCorkboards(getSavedCorkboards());
        }
    };

    const handleCreateNew = () => {
        if (!newCorkboardName.trim()) {
            alert('Please enter a name for the new corkboard');
            return;
        }

        const existingNames = savedCorkboards.map(cb => cb.name);
        if (existingNames.includes(newCorkboardName)) {
            alert('A corkboard with this name already exists');
            return;
        }

        const newCorkboard = createNewCorkboard(newCorkboardName);
        onLoadCorkboard(newCorkboard);
        closeModal();
    };

    const handleStartRename = (name) => {
        setRenamingCorkboard(name);
        setRenameValue(name);
    };

    const handleRename = () => {
        if (!renameValue.trim()) {
            alert('Please enter a valid name');
            return;
        }

        if (renameValue === renamingCorkboard) {
            setRenamingCorkboard(null);
            setRenameValue('');
            return;
        }

        const success = renameCorkboard(renamingCorkboard, renameValue);
        if (success) {
            setSavedCorkboards(getSavedCorkboards());
            // Update current corkboard name if it was renamed
            if (currentCorkboardName === renamingCorkboard) {
                onLoadCorkboard({name: renameValue, notes: [], lastModified: new Date().toISOString()});
            }
            setRenamingCorkboard(null);
            setRenameValue('');
        } else {
            alert('A corkboard with this name already exists');
        }
    };

    const handleCancelRename = () => {
        setRenamingCorkboard(null);
        setRenameValue('');
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString();
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 2000
        }}>
            <div style={{
                backgroundColor: 'white',
                padding: '30px',
                borderRadius: '15px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                width: '600px',
                maxWidth: '90vw',
                maxHeight: '80vh',
                overflow: 'auto'
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '20px'
                }}>
                    <h2 style={{
                        margin: 0,
                        color: '#8B4513'
                    }}>Manage Corkboards</h2>
                    <button
                        onClick={closeModal}
                        style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '24px',
                            cursor: 'pointer',
                            color: '#666'
                        }}
                    >
                        ✕
                    </button>
                </div>

                {currentCorkboardName && (
                    <div style={{
                        backgroundColor: '#f0f8ff',
                        padding: '15px',
                        borderRadius: '8px',
                        marginBottom: '20px',
                        border: '2px solid #4CAF50'
                    }}>
                        <strong>Current: {currentCorkboardName}</strong>
                    </div>
                )}

                <div style={{marginBottom: '25px'}}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '15px'
                    }}>
                        <h3 style={{margin: 0, color: '#333'}}>Saved Corkboards:</h3>
                        <button
                            onClick={() => setShowCreateForm(!showCreateForm)}
                            style={{
                                backgroundColor: '#388E3C',
                                color: 'white',
                                border: 'none',
                                padding: '8px 15px',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                fontSize: '14px'
                            }}
                        >
                            + New Corkboard
                        </button>
                    </div>

                    {showCreateForm && (
                        <div style={{
                            backgroundColor: '#f9f9f9',
                            padding: '15px',
                            borderRadius: '8px',
                            marginBottom: '15px'
                        }}>
                            <input
                                type="text"
                                value={newCorkboardName}
                                onChange={(e) => setNewCorkboardName(e.target.value)}
                                placeholder="Enter corkboard name..."
                                style={{
                                    width: '70%',
                                    padding: '8px',
                                    border: '1px solid #ddd',
                                    borderRadius: '5px',
                                    marginRight: '10px'
                                }}
                                onKeyPress={(e) => e.key === 'Enter' && handleCreateNew()}
                            />
                            <button
                                onClick={handleCreateNew}
                                style={{
                                    backgroundColor: '#388E3C',
                                    color: 'white',
                                    border: 'none',
                                    padding: '8px 15px',
                                    borderRadius: '5px',
                                    cursor: 'pointer'
                                }}
                            >
                                Create
                            </button>
                            <button
                                onClick={() => {
                                    setShowCreateForm(false);
                                    setNewCorkboardName('');
                                }}
                                style={{
                                    backgroundColor: '#D32F2F',
                                    color: 'white',
                                    border: 'none',
                                    padding: '8px 15px',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                    marginLeft: '5px'
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    )}

                    <div style={{
                        maxHeight: '300px',
                        overflow: 'auto'
                    }}>
                        {savedCorkboards.length === 0 ? (
                            <p style={{
                                color: '#666',
                                fontStyle: 'italic',
                                textAlign: 'center',
                                margin: '20px 0'
                            }}>No saved corkboards yet. Create your first one!</p>
                        ) : (
                            savedCorkboards.map((corkboard) => (
                                <div key={corkboard.name} style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '15px',
                                    backgroundColor: currentCorkboardName === corkboard.name ? '#e8f5e8' : '#f9f9f9',
                                    borderRadius: '8px',
                                    marginBottom: '10px',
                                    border: currentCorkboardName === corkboard.name ? '2px solid #4CAF50' : '1px solid #ddd'
                                }}>
                                    <div>
                                        <div style={{
                                            fontWeight: 'bold',
                                            fontSize: '16px',
                                            marginBottom: '5px'
                                        }}>
                                            {renamingCorkboard === corkboard.name ? (
                                                <input
                                                    type="text"
                                                    value={renameValue}
                                                    onChange={(e) => setRenameValue(e.target.value)}
                                                    onKeyPress={(e) => e.key === 'Enter' && handleRename()}
                                                    style={{
                                                        border: '1px solid #ddd',
                                                        borderRadius: '3px',
                                                        padding: '2px 5px',
                                                        fontSize: '16px',
                                                        fontWeight: 'bold'
                                                    }}
                                                    autoFocus
                                                />
                                            ) : (
                                                corkboard.name
                                            )}
                                        </div>
                                        <div style={{
                                            fontSize: '12px',
                                            color: '#666'
                                        }}>
                                            {corkboard.notes.length} notes • Last modified: {formatDate(corkboard.lastModified)}
                                        </div>
                                    </div>
                                    <div>
                                        {renamingCorkboard === corkboard.name ? (
                                            <>
                                                <button
                                                    onClick={handleRename}
                                                    style={{
                                                        backgroundColor: '#388E3C',
                                                        color: 'white',
                                                        border: 'none',
                                                        padding: '8px 12px',
                                                        borderRadius: '5px',
                                                        cursor: 'pointer',
                                                        marginRight: '5px',
                                                        fontSize: '12px'
                                                    }}
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    onClick={handleCancelRename}
                                                    style={{
                                                        backgroundColor: '#D32F2F',
                                                        color: 'white',
                                                        border: 'none',
                                                        padding: '8px 12px',
                                                        borderRadius: '5px',
                                                        cursor: 'pointer',
                                                        fontSize: '12px'
                                                    }}
                                                >
                                                    Cancel
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={() => handleLoadCorkboard(corkboard.name)}
                                                    disabled={currentCorkboardName === corkboard.name}
                                                    style={{
                                                        backgroundColor: currentCorkboardName === corkboard.name ? '#9E9E9E' : '#1976D2',
                                                        color: 'white',
                                                        border: 'none',
                                                        padding: '8px 12px',
                                                        borderRadius: '5px',
                                                        cursor: currentCorkboardName === corkboard.name ? 'not-allowed' : 'pointer',
                                                        marginRight: '5px',
                                                        fontSize: '12px'
                                                    }}
                                                >
                                                    {currentCorkboardName === corkboard.name ? 'Current' : 'Load'}
                                                </button>
                                                <button
                                                    onClick={() => handleStartRename(corkboard.name)}
                                                    style={{
                                                        backgroundColor: '#F57C00',
                                                        color: 'white',
                                                        border: 'none',
                                                        padding: '8px 12px',
                                                        borderRadius: '5px',
                                                        cursor: 'pointer',
                                                        marginRight: '5px',
                                                        fontSize: '12px'
                                                    }}
                                                >
                                                    Rename
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteCorkboard(corkboard.name)}
                                                    style={{
                                                        backgroundColor: '#D32F2F',
                                                        color: 'white',
                                                        border: 'none',
                                                        padding: '8px 12px',
                                                        borderRadius: '5px',
                                                        cursor: 'pointer',
                                                        fontSize: '12px'
                                                    }}
                                                >
                                                    Delete
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div style={{
                    display: 'flex',
                    justifyContent: 'flex-end'
                }}>
                    <button
                        onClick={closeModal}
                        style={{
                            padding: '12px 20px',
                            border: '2px solid #388E3C',
                            borderRadius: '8px',
                            backgroundColor: '#388E3C',
                            color: 'white',
                            cursor: 'pointer',
                            fontSize: '16px',
                            fontWeight: 'bold'
                        }}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
