const API_URL = '/api/students';

// State
let students = [];
let currentPage = 1;
let limit = 5;
let totalStudents = 0;
let searchQuery = '';
let courseChart = null;
let deleteStudentId = null;

// DOM Elements
const studentBody = document.getElementById('studentBody');
const totalStudentsEl = document.getElementById('totalStudents');
const activeCoursesEl = document.getElementById('activeCourses');
const topCourseEl = document.getElementById('topCourse');
const searchInput = document.getElementById('searchInput');
const studentModal = document.getElementById('studentModal');
const deleteModal = document.getElementById('deleteModal');
const studentForm = document.getElementById('studentForm');
const modalTitle = document.getElementById('modalTitle');
const addStudentBtn = document.getElementById('addStudentBtn');
const cancelBtn = document.getElementById('cancelBtn');
const closeModal = document.querySelector('.close-modal');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const pageInfo = document.getElementById('pageInfo');
const toastContainer = document.getElementById('toastContainer');
const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

async function initApp() {
    renderSkeletons();
    await Promise.all([fetchStudents(), fetchStats()]);
}

// --- API Functions ---
async function fetchStudents() {
    try {
        const response = await fetch(`${API_URL}?search=${searchQuery}&page=${currentPage}&limit=${limit}`);
        const result = await response.json();
        
        if (result.success) {
            students = result.data;
            totalStudents = result.total;
            renderTable();
            updatePagination();
        }
    } catch (err) {
        console.error('Error fetching students:', err);
        showToast('Failed to load students', 'error');
    }
}

async function fetchStats() {
    try {
        const response = await fetch(`${API_URL}/stats`);
        const result = await response.json();
        
        if (result.success) {
            const { totalStudents, activeCourses, topCourse, courseDistribution } = result.data;
            totalStudentsEl.textContent = totalStudents;
            activeCoursesEl.textContent = activeCourses;
            topCourseEl.textContent = topCourse;
            updateChart(courseDistribution);
        }
    } catch (err) {
        console.error('Error fetching stats:', err);
    }
}

async function saveStudent(data) {
    const isEdit = !!data._id;
    const url = isEdit ? `${API_URL}/${data._id}` : API_URL;
    const method = isEdit ? 'PUT' : 'POST';

    try {
        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        if (result.success) {
            showToast(isEdit ? 'Student information updated' : 'New student added successfully', 'success');
            hideModal();
            refreshData();
        } else {
            showToast(result.message || 'Validation failed. Please check your input.', 'error');
        }
    } catch (err) {
        console.error('Error saving student:', err);
        showToast('Connection error. Please try again.', 'error');
    }
}

async function performDelete() {
    if (!deleteStudentId) return;

    try {
        const response = await fetch(`${API_URL}/${deleteStudentId}`, { method: 'DELETE' });
        const result = await response.json();
        
        if (result.success) {
            showToast('Student record deleted permanently', 'success');
            hideDeleteModal();
            refreshData();
        }
    } catch (err) {
        showToast('Failed to delete student', 'error');
    } finally {
        deleteStudentId = null;
    }
}

// --- UI Rendering ---
function renderTable() {
    studentBody.innerHTML = students.map(student => `
        <tr class="fade-in">
            <td>
                <div class="user-info">
                    <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=random&color=fff" alt="">
                    <span>${student.name}</span>
                </div>
            </td>
            <td>${student.age}</td>
            <td><span class="course-badge">${student.course}</span></td>
            <td>${new Date(student.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</td>
            <td>
                <div class="action-btns">
                    <button class="btn-icon" onclick="editStudent('${student._id}')" title="Edit"><i class="fas fa-edit"></i></button>
                    <button class="btn-icon delete" onclick="confirmDelete('${student._id}')" title="Delete"><i class="fas fa-trash"></i></button>
                </div>
            </td>
        </tr>
    `).join('');

    if (students.length === 0) {
        studentBody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:60px;"><div style="opacity:0.5"><i class="fas fa-folder-open" style="font-size:32px; margin-bottom:12px;"></i><p>No student records found</p></div></td></tr>';
    }
}

function renderSkeletons() {
    studentBody.innerHTML = Array(limit).fill(0).map(() => `
        <tr>
            <td colspan="5"><div class="skeleton skeleton-row"></div></td>
        </tr>
    `).join('');
}

function updatePagination() {
    const totalPages = Math.ceil(totalStudents / limit) || 1;
    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage >= totalPages;
}

function updateChart(data) {
    const ctx = document.getElementById('courseChart').getContext('2d');
    
    const labels = data.map(d => d._id);
    const counts = data.map(d => d.count);

    if (courseChart) {
        courseChart.destroy();
    }

    courseChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: counts,
                backgroundColor: ['#6366f1', '#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899'],
                borderWidth: 0,
                hoverOffset: 15
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: { color: '#94a3b8', font: { family: 'Outfit', size: 12 }, usePointStyle: true, padding: 20 }
                }
            },
            cutout: '70%'
        }
    });
}

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
    
    toast.innerHTML = `
        <i class="fas ${icon}"></i>
        <span>${message}</span>
    `;
    
    toastContainer.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => toast.remove(), 400);
    }, 4000);
}

// --- Event Listeners ---
let searchTimer;
searchInput.addEventListener('input', (e) => {
    clearTimeout(searchTimer);
    searchQuery = e.target.value;
    searchTimer = setTimeout(() => {
        currentPage = 1;
        fetchStudents();
    }, 500);
});

addStudentBtn.addEventListener('click', () => {
    modalTitle.textContent = 'Add New Student';
    studentForm.reset();
    document.getElementById('studentId').value = '';
    showModal();
});

studentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = {
        name: document.getElementById('name').value,
        age: parseInt(document.getElementById('age').value),
        course: document.getElementById('course').value
    };
    const id = document.getElementById('studentId').value;
    if (id) data._id = id;
    saveStudent(data);
});

prevBtn.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        fetchStudents();
    }
});

nextBtn.addEventListener('click', () => {
    const totalPages = Math.ceil(totalStudents / limit);
    if (currentPage < totalPages) {
        currentPage++;
        fetchStudents();
    }
});

confirmDeleteBtn.addEventListener('click', performDelete);
cancelDeleteBtn.addEventListener('click', hideDeleteModal);

// --- Helpers ---
function refreshData() {
    fetchStudents();
    fetchStats();
}

function showModal() { studentModal.style.display = 'block'; }
function hideModal() { studentModal.style.display = 'none'; }

function confirmDelete(id) {
    deleteStudentId = id;
    deleteModal.style.display = 'block';
}
function hideDeleteModal() { deleteModal.style.display = 'none'; }

window.editStudent = (id) => {
    const student = students.find(s => s._id === id);
    if (!student) return;
    
    modalTitle.textContent = 'Edit Student Details';
    document.getElementById('studentId').value = student._id;
    document.getElementById('name').value = student.name;
    document.getElementById('age').value = student.age;
    document.getElementById('course').value = student.course;
    showModal();
};

closeModal.onclick = hideModal;
cancelBtn.onclick = hideModal;

window.onclick = (e) => {
    if (e.target == studentModal) hideModal();
    if (e.target == deleteModal) hideDeleteModal();
};
