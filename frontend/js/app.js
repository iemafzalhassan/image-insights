// ImageInsights Frontend Application

// Configuration - Replace with your API Gateway URL after deployment
const API_URL = 'YOUR_API_GATEWAY_URL';

// DOM Elements
const userIdInput = document.getElementById('userId');
const setUserIdBtn = document.getElementById('setUserIdBtn');
const galleryLink = document.getElementById('galleryLink');
const uploadLink = document.getElementById('uploadLink');
const searchLink = document.getElementById('searchLink');
const galleryView = document.getElementById('galleryView');
const uploadView = document.getElementById('uploadView');
const searchView = document.getElementById('searchView');
const imageGallery = document.getElementById('imageGallery');
const imageFile = document.getElementById('imageFile');
const imagePreview = document.getElementById('imagePreview');
const uploadBtn = document.getElementById('uploadBtn');
const uploadProgress = document.getElementById('uploadProgress');
const uploadStatus = document.getElementById('uploadStatus');
const searchQuery = document.getElementById('searchQuery');
const searchBtn = document.getElementById('searchBtn');
const searchResults = document.getElementById('searchResults');

// Modal elements
const imageDetailModal = new bootstrap.Modal(document.getElementById('imageDetailModal'));
const modalImage = document.getElementById('modalImage');
const labelsList = document.getElementById('labelsList');
const textList = document.getElementById('textList');
const facesList = document.getElementById('facesList');

// State
let currentUserId = localStorage.getItem('userId') || '';
let currentView = 'gallery';

// Initialize the application
function init() {
    // Set the user ID from local storage if available
    if (currentUserId) {
        userIdInput.value = currentUserId;
        loadGallery();
    }

    // Set up event listeners
    setUserIdBtn.addEventListener('click', setUserId);
    galleryLink.addEventListener('click', showGalleryView);
    uploadLink.addEventListener('click', showUploadView);
    searchLink.addEventListener('click', showSearchView);
    imageFile.addEventListener('change', handleImagePreview);
    uploadBtn.addEventListener('click', uploadImage);
    searchBtn.addEventListener('click', searchImages);
}

// Set the user ID
function setUserId() {
    const userId = userIdInput.value.trim();
    if (userId) {
        currentUserId = userId;
        localStorage.setItem('userId', userId);
        loadGallery();
    } else {
        alert('Please enter a valid User ID');
    }
}

// Show the gallery view
function showGalleryView(e) {
    if (e) e.preventDefault();
    currentView = 'gallery';
    galleryView.style.display = 'block';
    uploadView.style.display = 'none';
    searchView.style.display = 'none';
    galleryLink.classList.add('active');
    uploadLink.classList.remove('active');
    searchLink.classList.remove('active');
    
    if (currentUserId) {
        loadGallery();
    }
}

// Show the upload view
function showUploadView(e) {
    if (e) e.preventDefault();
    currentView = 'upload';
    galleryView.style.display = 'none';
    uploadView.style.display = 'block';
    searchView.style.display = 'none';
    galleryLink.classList.remove('active');
    uploadLink.classList.add('active');
    searchLink.classList.remove('active');
}

// Show the search view
function showSearchView(e) {
    if (e) e.preventDefault();
    currentView = 'search';
    galleryView.style.display = 'none';
    uploadView.style.display = 'none';
    searchView.style.display = 'block';
    galleryLink.classList.remove('active');
    uploadLink.classList.remove('active');
    searchLink.classList.add('active');
}

// Handle image preview
function handleImagePreview(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            imagePreview.src = e.target.result;
            imagePreview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
}

// Load the user's image gallery
async function loadGallery() {
    if (!currentUserId) return;
    
    try {
        imageGallery.innerHTML = `
            <div class="loading">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>
        `;
        
        const response = await axios.get(`${API_URL}/images?userId=${currentUserId}`);
        const images = response.data;
        
        if (images.length === 0) {
            imageGallery.innerHTML = '<div class="col-12"><p>No images found. Upload some images to get started!</p></div>';
            return;
        }
        
        imageGallery.innerHTML = '';
        images.forEach(image => {
            const card = createImageCard(image);
            imageGallery.appendChild(card);
        });
    } catch (error) {
        console.error('Error loading gallery:', error);
        imageGallery.innerHTML = '<div class="col-12"><p>Error loading images. Please try again later.</p></div>';
    }
}

// Create an image card element
function createImageCard(image) {
    const col = document.createElement('div');
    col.className = 'col-md-4';
    
    const card = document.createElement('div');
    card.className = 'card image-card';
    
    const img = document.createElement('img');
    img.src = image.presignedUrl;
    img.className = 'card-img-top image-thumbnail';
    img.alt = 'Image';
    
    const cardBody = document.createElement('div');
    cardBody.className = 'card-body';
    
    const cardTitle = document.createElement('h5');
    cardTitle.className = 'card-title';
    cardTitle.textContent = formatDate(image.createdAt);
    
    const labelsDiv = document.createElement('div');
    labelsDiv.className = 'mt-2';
    
    // Add top 3 labels as badges
    if (image.labels) {
        image.labels.slice(0, 3).forEach(label => {
            const badge = document.createElement('span');
            badge.className = 'badge bg-info label-badge';
            badge.textContent = label.Name;
            labelsDiv.appendChild(badge);
        });
    }
    
    const viewBtn = document.createElement('button');
    viewBtn.className = 'btn btn-primary mt-2';
    viewBtn.textContent = 'View Analysis';
    viewBtn.addEventListener('click', () => viewImageDetails(image.imageId));
    
    cardBody.appendChild(cardTitle);
    cardBody.appendChild(labelsDiv);
    cardBody.appendChild(viewBtn);
    
    card.appendChild(img);
    card.appendChild(cardBody);
    
    col.appendChild(card);
    return col;
}

// Upload an image
async function uploadImage() {
    if (!currentUserId) {
        alert('Please set your User ID first');
        return;
    }
    
    const file = imageFile.files[0];
    if (!file) {
        alert('Please select an image to upload');
        return;
    }
    
    try {
        // Show upload progress
        uploadBtn.disabled = true;
        uploadProgress.style.display = 'block';
        const progressBar = uploadProgress.querySelector('.progress-bar');
        progressBar.style.width = '0%';
        uploadStatus.textContent = 'Getting upload URL...';
        
        // Get a presigned URL for uploading
        const response = await axios.get(`${API_URL}/upload-url?userId=${currentUserId}&filename=${file.name}`);
        const { uploadUrl, key } = response.data;
        
        // Upload the file to S3
        uploadStatus.textContent = 'Uploading image...';
        await axios.put(uploadUrl, file, {
            headers: {
                'Content-Type': file.type
            },
            onUploadProgress: (progressEvent) => {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                progressBar.style.width = `${percentCompleted}%`;
            }
        });
        
        // Update status
        uploadStatus.textContent = 'Processing image...';
        progressBar.style.width = '100%';
        
        // Wait a moment for the Lambda function to process the image
        setTimeout(() => {
            uploadBtn.disabled = false;
            uploadProgress.style.display = 'none';
            imageFile.value = '';
            imagePreview.style.display = 'none';
            alert('Image uploaded and processed successfully!');
            showGalleryView();
        }, 3000);
        
    } catch (error) {
        console.error('Error uploading image:', error);
        uploadBtn.disabled = false;
        uploadProgress.style.display = 'none';
        alert('Error uploading image. Please try again.');
    }
}

// Search for images
async function searchImages() {
    const query = searchQuery.value.trim();
    if (!query) {
        alert('Please enter a search query');
        return;
    }
    
    try {
        searchResults.innerHTML = `
            <div class="loading">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>
        `;
        
        const params = new URLSearchParams({
            query: query
        });
        
        if (currentUserId) {
            params.append('userId', currentUserId);
        }
        
        const response = await axios.get(`${API_URL}/search?${params.toString()}`);
        const images = response.data;
        
        if (images.length === 0) {
            searchResults.innerHTML = '<div class="col-12"><p>No images found matching your search.</p></div>';
            return;
        }
        
        searchResults.innerHTML = '';
        images.forEach(image => {
            const col = document.createElement('div');
            col.className = 'col-md-4';
            
            const card = document.createElement('div');
            card.className = 'card image-card';
            
            const img = document.createElement('img');
            img.src = image.presignedUrl;
            img.className = 'card-img-top image-thumbnail';
            img.alt = 'Image';
            
            const cardBody = document.createElement('div');
            cardBody.className = 'card-body';
            
            const cardTitle = document.createElement('h5');
            cardTitle.className = 'card-title';
            cardTitle.textContent = 'Match Found';
            
            const matchesDiv = document.createElement('div');
            matchesDiv.className = 'mt-2';
            
            // Add matching labels
            if (image.matchingLabels && image.matchingLabels.length > 0) {
                const labelTitle = document.createElement('p');
                labelTitle.className = 'mb-1';
                labelTitle.textContent = 'Matching objects:';
                matchesDiv.appendChild(labelTitle);
                
                image.matchingLabels.forEach(label => {
                    const badge = document.createElement('span');
                    badge.className = 'badge bg-success label-badge';
                    badge.textContent = label.name;
                    matchesDiv.appendChild(badge);
                });
            }
            
            // Add matching text
            if (image.matchingText && image.matchingText.length > 0) {
                const textTitle = document.createElement('p');
                textTitle.className = 'mb-1 mt-2';
                textTitle.textContent = 'Matching text:';
                matchesDiv.appendChild(textTitle);
                
                image.matchingText.forEach(text => {
                    const badge = document.createElement('span');
                    badge.className = 'badge bg-warning text-dark label-badge';
                    badge.textContent = text.text;
                    matchesDiv.appendChild(badge);
                });
            }
            
            const viewBtn = document.createElement('button');
            viewBtn.className = 'btn btn-primary mt-2';
            viewBtn.textContent = 'View Analysis';
            viewBtn.addEventListener('click', () => viewImageDetails(image.imageId));
            
            cardBody.appendChild(cardTitle);
            cardBody.appendChild(matchesDiv);
            cardBody.appendChild(viewBtn);
            
            card.appendChild(img);
            card.appendChild(cardBody);
            
            col.appendChild(card);
            searchResults.appendChild(col);
        });
    } catch (error) {
        console.error('Error searching images:', error);
        searchResults.innerHTML = '<div class="col-12"><p>Error searching images. Please try again later.</p></div>';
    }
}

// View image details
async function viewImageDetails(imageId) {
    try {
        const response = await axios.get(`${API_URL}/images/${imageId}`);
        const image = response.data;
        
        // Set the modal image
        modalImage.src = image.presignedUrl;
        
        // Populate labels tab
        labelsList.innerHTML = '';
        if (image.analysis.labels && image.analysis.labels.length > 0) {
            const table = document.createElement('table');
            table.className = 'table table-striped';
            
            const thead = document.createElement('thead');
            thead.innerHTML = `
                <tr>
                    <th>Label</th>
                    <th>Confidence</th>
                </tr>
            `;
            
            const tbody = document.createElement('tbody');
            image.analysis.labels.forEach(label => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${label.Name}</td>
                    <td>${label.Confidence.toFixed(2)}%</td>
                `;
                tbody.appendChild(tr);
            });
            
            table.appendChild(thead);
            table.appendChild(tbody);
            labelsList.appendChild(table);
        } else {
            labelsList.innerHTML = '<p>No labels detected</p>';
        }
        
        // Populate text tab
        textList.innerHTML = '';
        if (image.analysis.text && image.analysis.text.length > 0) {
            const table = document.createElement('table');
            table.className = 'table table-striped';
            
            const thead = document.createElement('thead');
            thead.innerHTML = `
                <tr>
                    <th>Text</th>
                    <th>Type</th>
                    <th>Confidence</th>
                </tr>
            `;
            
            const tbody = document.createElement('tbody');
            image.analysis.text.forEach(text => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${text.DetectedText}</td>
                    <td>${text.Type}</td>
                    <td>${text.Confidence.toFixed(2)}%</td>
                `;
                tbody.appendChild(tr);
            });
            
            table.appendChild(thead);
            table.appendChild(tbody);
            textList.appendChild(table);
        } else {
            textList.innerHTML = '<p>No text detected</p>';
        }
        
        // Populate faces tab
        facesList.innerHTML = '';
        if (image.analysis.faces && image.analysis.faces.length > 0) {
            image.analysis.faces.forEach((face, index) => {
                const faceCard = document.createElement('div');
                faceCard.className = 'card mb-3';
                
                const cardBody = document.createElement('div');
                cardBody.className = 'card-body';
                
                const cardTitle = document.createElement('h5');
                cardTitle.className = 'card-title';
                cardTitle.textContent = `Face ${index + 1}`;
                
                const ageRange = document.createElement('p');
                ageRange.innerHTML = `<strong>Age:</strong> ${face.AgeRange.Low} - ${face.AgeRange.High} years`;
                
                const gender = document.createElement('p');
                gender.innerHTML = `<strong>Gender:</strong> ${face.Gender.Value} (${face.Gender.Confidence.toFixed(2)}%)`;
                
                const emotions = document.createElement('div');
                emotions.innerHTML = '<strong>Emotions:</strong>';
                
                const emotionsList = document.createElement('ul');
                face.Emotions.forEach(emotion => {
                    const li = document.createElement('li');
                    li.textContent = `${emotion.Type}: ${emotion.Confidence.toFixed(2)}%`;
                    emotionsList.appendChild(li);
                });
                
                emotions.appendChild(emotionsList);
                
                cardBody.appendChild(cardTitle);
                cardBody.appendChild(ageRange);
                cardBody.appendChild(gender);
                cardBody.appendChild(emotions);
                
                faceCard.appendChild(cardBody);
                facesList.appendChild(faceCard);
            });
        } else {
            facesList.innerHTML = '<p>No faces detected</p>';
        }
        
        // Show the modal
        imageDetailModal.show();
    } catch (error) {
        console.error('Error loading image details:', error);
        alert('Error loading image details. Please try again.');
    }
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', init);
