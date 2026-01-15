// 1. Enhanced Data Structure with more realistic data
const resources = [
    { 
        id: 1,
        title: "2023 Mathematics PYQ", 
        category: "pyq", 
        link: "https://example.com/math2023.pdf",
        description: "Complete previous year question paper with solutions",
        semester: "Semester 4",
        subject: "Mathematics",
        uploadDate: "2024-01-15",
        downloads: 1250,
        size: "2.4 MB",
        type: "pdf",
        tags: ["mathematics", "engineering", "calculus"]
    },
    { 
        id: 2,
        title: "Java OOPs Complete Notes", 
        category: "notes", 
        link: "https://example.com/java-oops.pdf",
        description: "Detailed Object Oriented Programming concepts in Java",
        semester: "Semester 3",
        subject: "Computer Science",
        uploadDate: "2024-01-10",
        downloads: 890,
        size: "1.8 MB",
        type: "pdf",
        tags: ["java", "programming", "oops"]
    },
    { 
        id: 3,
        title: "Physics Assignment 1 Solutions", 
        category: "assignment", 
        link: "https://example.com/physics-assignment.pdf",
        description: "Solved problems from Modern Physics",
        semester: "Semester 2",
        subject: "Physics",
        uploadDate: "2024-01-12",
        downloads: 560,
        size: "1.2 MB",
        type: "pdf",
        tags: ["physics", "quantum", "mechanics"]
    },
    { 
        id: 4,
        title: "Chemistry Important Questions", 
        category: "important", 
        link: "#",
        description: "Most important questions for semester exams",
        semester: "Semester 1",
        subject: "Chemistry",
        uploadDate: "2024-01-08",
        downloads: 2100,
        size: "0.9 MB",
        type: "doc",
        tags: ["chemistry", "organic", "inorganic"]
    },
    { 
        id: 5,
        title: "2022 Computer Science PYQ", 
        category: "pyq", 
        link: "#",
        description: "Previous year question paper with marking scheme",
        semester: "Semester 5",
        subject: "Computer Science",
        uploadDate: "2024-01-05",
        downloads: 1780,
        size: "3.1 MB",
        type: "pdf",
        tags: ["algorithms", "datastructures", "computerscience"]
    }
];

// 2. Category configuration with colors and icons
const categories = {
    pyq: { name: "Previous Year Questions", color: "#34a853", icon: "fas fa-file-alt" },
    notes: { name: "Study Notes", color: "#1a73e8", icon: "fas fa-book" },
    assignment: { name: "Assignments", color: "#ea4335", icon: "fas fa-tasks" },
    important: { name: "Important Questions", color: "#fbbc04", icon: "fas fa-star" },
    books: { name: "Reference Books", color: "#673ab7", icon: "fas fa-book-open" }
};

// 3. Function to create resource card HTML
function createResourceCard(item) {
    const category = categories[item.category] || categories.notes;
    
    return `
        <div class="card" data-id="${item.id}" data-category="${item.category}" data-semester="${item.semester}">
            <div class="card-header">
                <span class="badge" style="background-color: ${category.color}">
                    <i class="${category.icon}"></i> ${category.name}
                </span>
                ${item.downloads > 1000 ? '<span class="badge popular"><i class="fas fa-fire"></i> Popular</span>' : ''}
            </div>
            <div class="card-body">
                <h3 class="card-title">${item.title}</h3>
                <p class="card-description">${item.description}</p>
                <div class="card-meta">
                    <span><i class="fas fa-graduation-cap"></i> ${item.semester}</span>
                    <span><i class="fas fa-book"></i> ${item.subject}</span>
                    <span><i class="fas fa-download"></i> ${formatNumber(item.downloads)}</span>
                </div>
                <div class="card-tags">
                    ${item.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            </div>
            <div class="card-footer">
                <div class="file-info">
                    <i class="fas fa-file-${item.type}"></i>
                    <span>${item.size.toUpperCase()}</span>
                </div>
                <div class="card-actions">
                    <a href="${item.link}" class="btn btn-view" target="_blank">
                        <i class="fas fa-eye"></i> View
                    </a>
                    <button class="btn btn-download" onclick="downloadResource(${item.id})">
                        <i class="fas fa-download"></i> Download
                    </button>
                </div>
            </div>
        </div>
    `;
}

// 4. Enhanced display function with sorting and filtering
function displayResources(filter = "all", sortBy = "downloads") {
    const grid = document.getElementById('resourceGrid');
    const status = document.getElementById('resourceStatus');
    
    // Filter resources
    let filteredItems = filter === "all" 
        ? [...resources] 
        : resources.filter(item => item.category === filter);
    
    // Sort resources
    filteredItems.sort((a, b) => {
        switch(sortBy) {
            case 'downloads': return b.downloads - a.downloads;
            case 'date': return new Date(b.uploadDate) - new Date(a.uploadDate);
            case 'title': return a.title.localeCompare(b.title);
            default: return 0;
        }
    });
    
    // Clear and update grid
    grid.innerHTML = "";
    
    if (filteredItems.length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-search fa-3x"></i>
                <h3>No resources found</h3>
                <p>Try adjusting your filters or search term</p>
            </div>
        `;
        status.textContent = "Showing 0 resources";
        return;
    }
    
    // Create cards
    filteredItems.forEach(item => {
        grid.innerHTML += createResourceCard(item);
    });
    
    // Update status
    status.textContent = `Showing ${filteredItems.length} of ${resources.length} resources`;
}

// 5. Enhanced search with debouncing
let searchTimeout;
function searchResources() {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
        const cards = document.querySelectorAll('.card');
        let visibleCount = 0;
        
        cards.forEach(card => {
            const title = card.querySelector('.card-title').innerText.toLowerCase();
            const description = card.querySelector('.card-description').innerText.toLowerCase();
            const tags = Array.from(card.querySelectorAll('.tag')).map(tag => tag.innerText.toLowerCase());
            
            const matches = title.includes(searchTerm) || 
                          description.includes(searchTerm) ||
                          tags.some(tag => tag.includes(searchTerm));
            
            card.style.display = matches ? "block" : "none";
            if (matches) visibleCount++;
        });
        
        updateSearchStatus(visibleCount, cards.length, searchTerm);
    }, 300); // 300ms debounce
}

// 6. Advanced filtering system
function applyAdvancedFilters() {
    const semesterFilter = document.getElementById('semesterFilter').value;
    const subjectFilter = document.getElementById('subjectFilter').value.toLowerCase();
    const typeFilter = document.getElementById('typeFilter').value;
    const minDownloads = parseInt(document.getElementById('downloadFilter').value) || 0;
    
    const cards = document.querySelectorAll('.card');
    let visibleCount = 0;
    
    cards.forEach(card => {
        const semester = card.dataset.semester;
        const subject = card.querySelector('.card-meta span:nth-child(2)').innerText.toLowerCase();
        const type = card.querySelector('.file-info i').className.includes('pdf') ? 'pdf' : 'doc';
        const downloads = parseInt(card.querySelector('.card-meta span:nth-child(3)').innerText.replace(/,/g, ''));
        
        const semesterMatch = !semesterFilter || semester === semesterFilter;
        const subjectMatch = !subjectFilter || subject.includes(subjectFilter);
        const typeMatch = !typeFilter || type === typeFilter;
        const downloadsMatch = downloads >= minDownloads;
        
        const shouldShow = semesterMatch && subjectMatch && typeMatch && downloadsMatch;
        card.style.display = shouldShow ? "block" : "none";
        if (shouldShow) visibleCount++;
    });
    
    document.getElementById('resourceStatus').textContent = 
        `Showing ${visibleCount} filtered resources`;
}

// 7. Download tracking function
function downloadResource(resourceId) {
    const resource = resources.find(r => r.id === resourceId);
    if (!resource) return;
    
    // Update download count
    resource.downloads++;
    
    // Save to localStorage
    const downloads = JSON.parse(localStorage.getItem('downloadHistory') || '[]');
    downloads.push({
        id: resourceId,
        title: resource.title,
        downloadedAt: new Date().toISOString()
    });
    localStorage.setItem('downloadHistory', JSON.stringify(downloads));
    
    // Show notification
    showNotification(`Downloading: ${resource.title}`);
    
    // Update the displayed card
    const card = document.querySelector(`.card[data-id="${resourceId}"]`);
    if (card) {
        const downloadCount = card.querySelector('.card-meta span:nth-child(3)');
        downloadCount.innerHTML = `<i class="fas fa-download"></i> ${formatNumber(resource.downloads)}`;
    }
    
    // Actual download logic (replace with your implementation)
    window.open(resource.link, '_blank');
}

// 8. Utility functions
function formatNumber(num) {
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
}

function updateSearchStatus(visible, total, term) {
    const status = document.getElementById('resourceStatus');
    if (term) {
        status.textContent = `Found ${visible} results for "${term}"`;
    } else {
        status.textContent = `Showing ${visible} of ${total} resources`;
    }
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 10);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// 9. Initialize with event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Initial display
    displayResources('all', 'downloads');
    
    // Setup event listeners
    document.getElementById('searchInput').addEventListener('input', searchResources);
    
    // Category filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            displayResources(e.target.dataset.filter);
        });
    });
    
    // Sort dropdown
    document.getElementById('sortSelect').addEventListener('change', (e) => {
        const currentFilter = document.querySelector('.filter-btn.active')?.dataset.filter || 'all';
        displayResources(currentFilter, e.target.value);
    });
    
    // Advanced filters
    document.getElementById('applyFilters').addEventListener('click', applyAdvancedFilters);
    document.getElementById('resetFilters').addEventListener('click', () => {
        document.getElementById('semesterFilter').value = '';
        document.getElementById('subjectFilter').value = '';
        document.getElementById('typeFilter').value = '';
        document.getElementById('downloadFilter').value = '';
        displayResources('all', 'downloads');
    });
    
    // Load user's download history
    loadDownloadHistory();
});

// 10. Load user download history
function loadDownloadHistory() {
    const history = JSON.parse(localStorage.getItem('downloadHistory') || '[]');
    if (history.length > 0) {
        console.log('Download History:', history);
        // You could display this in a user profile section
    }
}

// 11. Additional CSS needed for new features
const additionalCSS = `
/* Notification */
.notification {
    position: fixed;
    top: 20px;
    right: 20px;
    background: var(--secondary-green);
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    display: flex;
    align-items: center;
    gap: 10px;
    box-shadow: var(--shadow);
    transform: translateX(150%);
    transition: transform 0.3s ease;
    z-index: 2000;
}

.notification.show {
    transform: translateX(0);
}

/* Card enhancements */
.card-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 1rem;
}

.card-body {
    flex-grow: 1;
}

.card-title {
    margin: 0 0 0.5rem 0;
    font-size: 1.2rem;
}

.card-description {
    color: #666;
    font-size: 0.9rem;
    margin-bottom: 1rem;
    line-height: 1.4;
}

.card-meta {
    display: flex;
    gap: 1rem;
    font-size: 0.8rem;
    color: #777;
    margin-bottom: 1rem;
}

.card-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 1rem;
}

.tag {
    background: #f0f0f0;
    padding: 0.2rem 0.6rem;
    border-radius: 12px;
    font-size: 0.75rem;
}

.card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid #eee;
    padding-top: 1rem;
}

.file-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #666;
}

.card-actions {
    display: flex;
    gap: 0.5rem;
}

.btn-download {
    background: var(--secondary-green);
}

.btn-download:hover {
    background: #2e8b47;
}

/* Empty state */
.empty-state {
    grid-column: 1 / -1;
    text-align: center;
    padding: 3rem;
    color: #666;
}

.empty-state i {
    margin-bottom: 1rem;
    opacity: 0.5;
}

/* Filter controls */
.filter-controls {
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
    flex-wrap: wrap;
}

.filter-btn.active {
    background: var(--primary-blue);
    color: white;
}

/* Advanced filters panel */
.advanced-filters {
    background: white;
    padding: 1.5rem;
    border-radius: 8px;
    margin-bottom: 2rem;
    box-shadow: var(--shadow);
}

.filter-group {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-bottom: 1rem;
}

.filter-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
}

.filter-group input,
.filter-group select {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
}

.filter-actions {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
}
`;

// Add the CSS to the page
const styleSheet = document.createElement("style");
styleSheet.textContent = additionalCSS;
document.head.appendChild(styleSheet);