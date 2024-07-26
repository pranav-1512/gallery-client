import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { IoAdd } from 'react-icons/io5';

function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [images, setImages] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [description, setDescription] = useState('');
  const [tag, setTag] = useState('');
  const [modalImage, setModalImage] = useState(null);
  const [editDescription, setEditDescription] = useState('');
  const [editTag, setEditTag] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [tags, setTags] = useState(['All']);
  const [selectedTag, setSelectedTag] = useState('All');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [deleteProgress, setDeleteProgress] = useState(0);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    checkLoggedIn();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      fetchUsername();
      fetchImages();
      fetchTags();
    }
  }, [isLoggedIn]);

  const checkLoggedIn = () => {
    const authToken = localStorage.getItem("authtoken");
    if (authToken) {
      setIsLoggedIn(true);
    } else {
      window.alert("Please Login");
      navigate("/");
    }
  };

  const fetchUsername = async () => {
    try {
      const response = await axios.get('https://gallery-backend-u0i7.onrender.com/auth/profile', {
        headers: {
          'Authorization': localStorage.getItem('authtoken')
        }
      });
      setUsername(response.data.username);
    } catch (error) {
      console.error('Error fetching username:', error);
    }
  };

  const fetchImages = async () => {
    try {
      const response = await axios.get('https://gallery-backend-u0i7.onrender.com/api/all', {
        headers: {
          'Authorization': localStorage.getItem('authtoken')
        }
      });
      console.log('Fetched images:', response.data);
      setImages(response.data);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await axios.get('https://gallery-backend-u0i7.onrender.com/api/tags', {
        headers: {
          'Authorization': localStorage.getItem('authtoken')
        }
      });
      const fetchedTags = response.data.map(tag => tag || 'No Tag');
      setTags(['All', ...new Set(fetchedTags)]);
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select a file to upload');
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('description', description);
    formData.append('tag', tag || 'No Tag');

    try {
      await axios.post('https://gallery-backend-u0i7.onrender.com/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': localStorage.getItem('authtoken')
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        }
      });
      setUploadProgress(100);
      setTimeout(() => {
        alert('Image uploaded successfully');
        fetchImages();
        fetchTags();
        setSelectedFile(null);
        setDescription('');
        setTag('');
        setIsUploadModalOpen(false);
        setUploadProgress(0);
      }, 500);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
      setUploadProgress(0);
    }
  };

  const openModal = (image) => {
    setModalImage(image);
    setEditDescription(image.description || '');
    setEditTag(image.tag || '');
    setIsEditing(false);
  };

  const closeModal = () => {
    setModalImage(null);
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const response = await axios.put(`https://gallery-backend-u0i7.onrender.com/api/update/${modalImage._id}`,
        {
          description: editDescription,
          tag: editTag || 'No Tag'
        },
        {
          headers: {
            'Authorization': localStorage.getItem('authtoken')
          }
        }
      );

      if (response.data.success) {
        setModalImage({ ...modalImage, description: editDescription, tag: editTag || 'No Tag' });
        setIsEditing(false);
        fetchImages();
        fetchTags();
        alert('Image details updated successfully');
      } else {
        alert('Failed to update image details');
      }
    } catch (error) {
      console.error('Error updating image details:', error);
      alert('Failed to update image details');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      try {
        setDeleteProgress(10);
        const response = await axios.delete(`https://gallery-backend-u0i7.onrender.com/api/delete/${modalImage._id}`, {
          headers: {
            'Authorization': localStorage.getItem('authtoken')
          },
          onDownloadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setDeleteProgress(percentCompleted);
          }
        });

        if (response.data.success) {
          setDeleteProgress(100);
          setTimeout(() => {
            closeModal();
            fetchImages();
            fetchTags();
            alert('Image deleted successfully');
            setDeleteProgress(0);
          }, 500);
        } else {
          alert('Failed to delete image');
          setDeleteProgress(0);
        }
      } catch (error) {
        console.error('Error deleting image:', error);
        alert('Failed to delete image');
        setDeleteProgress(0);
      }
    }
  };

  const TagSelector = ({ tags, selectedTag, onTagSelect, onNewTag }) => {
    const [newTagInput, setNewTagInput] = useState('');

    const handleAddNewTag = () => {
      if (newTagInput && !tags.includes(newTagInput)) {
        onNewTag(newTagInput);
        setNewTagInput('');
      }
    };

    return (
      <div>
        {tags.map(tag => (
          <button className='btn btn-info mx-2 my-3'
            key={tag}
            onClick={() => onTagSelect(tag)}
            style={{ fontWeight: selectedTag === tag ? 'bold' : 'normal' }}
          >
            {tag}
          </button>
        ))}
        <input
          type="text"
          value={newTagInput}
          onChange={(e) => setNewTagInput(e.target.value)}
          placeholder="New tag"
        />
        <button className='btn btn-primary mx-2' onClick={handleAddNewTag}>Add Tag</button>
      </div>
    );
  };

  const TagInput = ({ value, onChange, tags, onNewTag }) => {
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [newTagInput, setNewTagInput] = useState('');

    const handleSelectChange = (e) => {
      const selectedValue = e.target.value;
      if (selectedValue === 'new') {
        setIsAddingNew(true);
        setNewTagInput('');
      } else {
        setIsAddingNew(false);
        onChange(selectedValue);
      }
    };

    const handleNewTagInputChange = (e) => {
      setNewTagInput(e.target.value);
    };

    const handleAddNewTag = () => {
      if (newTagInput && !tags.includes(newTagInput)) {
        onNewTag(newTagInput);
        onChange(newTagInput);
        setIsAddingNew(false);
      }
    };

    return (
      <div>
        <select className="form-select" value={isAddingNew ? 'new' : (value || 'No Tag')} onChange={handleSelectChange}>
          <option value="No Tag">No Tag</option>
          {tags.filter(tag => tag !== 'All' && tag !== 'No Tag').map(tag => (
            <option key={tag} value={tag}>{tag}</option>
          ))}
          <option value="new">Add new tag</option>
        </select>
        {isAddingNew && (
          <div className="mt-2">
            <input
              type="text"
              className="form-control"
              value={newTagInput}
              onChange={handleNewTagInputChange}
              placeholder="Enter new tag"
            />
            <button className='btn btn-primary mt-2' onClick={handleAddNewTag}>Add</button>
          </div>
        )}
      </div>
    );
  };

  const filteredImages = selectedTag === 'All'
    ? images
    : images.filter(image => (image.tag || 'No Tag') === selectedTag);

  const handleNewTag = (newTag) => {
    setTags(prevTags => [...new Set([...prevTags, newTag])]);
    setSelectedTag(newTag);
  };

  return (
    <>
      {isLoggedIn && (
        <div className="container mt-4">
          <h1 className='caveat-font'>Welcome to {username}'s Personal Gallery</h1>
          <TagSelector
            tags={tags}
            selectedTag={selectedTag}
            onTagSelect={setSelectedTag}
            onNewTag={handleNewTag}
          />
          <div className="row row-cols-1 row-cols-md-4 g-4 mt-3">
            {filteredImages.map((image) => (
              <div key={image._id} className="col">
                <div className="card h-100" onClick={() => openModal(image)}>
                  <div className="card-img-container">
                    <img
                      src={`https://gallery-backend-u0i7.onrender.com/api/file/${image.filename}`}
                      className="card-img-top"
                      alt={image.description || 'Uploaded image'}
                      onError={(e) => {
                        console.error('Error loading image:', image.filename);
                        e.target.src = 'path/to/fallback/image.jpg';
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div
            style={{
              position: 'fixed',
              bottom: '20px',
              right: '20px',
              zIndex: 1000,
              cursor: 'pointer',
              backgroundColor: '#8a2be2',
              borderRadius: '12px',
              width: '60px',
              height: '60px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
            }}
            onClick={() => setIsUploadModalOpen(true)}
          >
            <IoAdd size={30} color="white" />
          </div>

          {modalImage && (
            <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
              <div className="modal-dialog modal-lg">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Image Details</h5>
                    <button type="button" className="btn-close" onClick={closeModal}></button>
                  </div>
                  <div className="modal-body">
                    <img
                      src={`https://gallery-backend-u0i7.onrender.com/api/file/${modalImage.filename}`}
                      alt={modalImage.description || 'Uploaded image'}
                      className="img-fluid mb-3"
                      style={{ maxHeight: '60vh', width: '100%', objectFit: 'contain' }}
                    />
                    {isEditing ? (
                      <>
                        <div className="mb-3">
                          <label className="form-label">Description:</label>
                          <input
                            type="text"
                            className="form-control"
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                          />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Tag:</label>
                          <TagInput
                            value={editTag}
                            onChange={setEditTag}
                            tags={tags}
                            onNewTag={handleNewTag}
                          />
                        </div>
                        <button className='btn btn-success' onClick={handleSave}>Save</button>
                      </>
                    ) : (
                      <>
                        <p><strong>Description:</strong> {modalImage.description || 'No description'}</p>
                        <p><strong>Tag:</strong> {modalImage.tag || 'No tag'}</p>
                        <button className='btn btn-secondary' onClick={handleEdit}>Edit</button>
                      </>
                    )}
                  </div>
                  <div className="modal-footer">
                    {deleteProgress > 0 && deleteProgress < 100 ? (
                      <div className="progress w-100">
                        <div
                          className="progress-bar"
                          role="progressbar"
                          style={{ width: `${deleteProgress}%` }}
                          aria-valuenow={deleteProgress}
                          aria-valuemin="0"
                          aria-valuemax="100"
                        >
                          Deleting... {deleteProgress}%
                        </div>
                      </div>
                    ) : (
                      <>
                        <button className='btn btn-danger' onClick={handleDelete}>Delete</button>
                        <button className='btn btn-secondary' onClick={closeModal}>Close</button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {isUploadModalOpen && (
            <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Upload Image</h5>
                    <button type="button" className="btn-close" onClick={() => setIsUploadModalOpen(false)}></button>
                  </div>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label htmlFor="fileInput" className="form-label">Select Image</label>
                      <input
                        type="file"
                        className="form-control"
                        id="fileInput"
                        onChange={handleFileChange}
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="descriptionInput" className="form-label">Description</label>
                      <input
                        type="text"
                        className="form-control"
                        id="descriptionInput"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="tagInput" className="form-label">Tag</label>
                      <TagInput
                        value={tag}
                        onChange={setTag}
                        tags={tags}
                        onNewTag={handleNewTag}
                      />
                    </div>
                    {uploadProgress > 0 && (
                      <div className="progress mb-3">
                        <div
                          className="progress-bar"
                          role="progressbar"
                          style={{ width: `${uploadProgress}%` }}
                          aria-valuenow={uploadProgress}
                          aria-valuemin="0"
                          aria-valuemax="100"
                        >
                          {uploadProgress < 100 ? `Uploading... ${uploadProgress}%` : 'Upload Complete!'}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={() => setIsUploadModalOpen(false)}>Cancel</button>
                    <button
                      className="btn btn-primary"
                      onClick={handleUpload}
                      disabled={uploadProgress > 0 && uploadProgress < 100}
                    >
                      {uploadProgress > 0 && uploadProgress < 100 ? 'Uploading...' : 'Upload'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default Home;