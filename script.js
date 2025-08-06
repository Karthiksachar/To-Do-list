document.addEventListener('DOMContentLoaded', () => {
    // Sidebar icon click logic
    const sidebarIcons = document.querySelectorAll('.sidebar-icon');
    const sidebarTopic = document.getElementById('sidebar-topic');

    sidebarIcons.forEach(icon => {
        icon.addEventListener('click', (e) => {
            const topic = icon.getAttribute('data-topic');
            if (sidebarTopic) {
                sidebarTopic.textContent = topic;
                sidebarTopic.style.display = 'flex';
            }
        });
    });

    // Hide topic when clicking outside
    document.addEventListener('click', (e) => {
        if (sidebarTopic && !e.target.classList.contains('sidebar-icon')) {
            sidebarTopic.style.display = 'none';
        }
    });
    // Welcome overlay sign-in logic
    const welcomeOverlay = document.getElementById('welcome-overlay');
    const mainApp = document.getElementById('main-app');
    const mainLayout = document.getElementById('main-layout');
    const welcomeSignInBtn = document.getElementById('welcome-signin-btn');
    const signinForm = document.getElementById('signin-form');
    const usernameInput = document.getElementById('username-input');

    if (welcomeSignInBtn && signinForm) {
        welcomeSignInBtn.addEventListener('click', () => {
            welcomeSignInBtn.style.display = 'none';
            signinForm.style.display = 'block';
            usernameInput.focus();
        });
    }

    if (signinForm) {
        signinForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = usernameInput.value.trim();
            if (username) {
                if (welcomeOverlay) {
                    welcomeOverlay.classList.add('fade-out');
                    setTimeout(() => {
                        welcomeOverlay.style.display = 'none';
                        if (mainLayout) {
                            mainLayout.style.display = 'flex';
                            mainApp.classList.add('fade-in');
                        }
                    }, 700);
                } else if (mainLayout) {
                    mainLayout.style.display = 'flex';
                    mainApp.classList.add('fade-in');
                }
                // Optionally, display username somewhere in the app
            } else {
                usernameInput.focus();
            }
        });
    }
    // Select the necessary DOM elements
    const taskInput = document.getElementById('task-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');

    // Store tasks in an array
    let tasks = [];
    let currentTopic = null; // null means show all

    // Function to render pending tasks by topic
    function renderTasks() {
        taskList.innerHTML = '';
        let filtered = tasks.filter(task => !task.completed);
        if (currentTopic) {
            filtered = filtered.filter(task => task.topic === currentTopic);
        }
        filtered.forEach((task, idx) => {
            const listItem = document.createElement('li');
            listItem.className = 'task-item';

            const taskSpan = document.createElement('span');
            taskSpan.textContent = task.text;

            // Mark as complete button
            const completeBtn = document.createElement('button');
            completeBtn.textContent = 'Mark as Complete';
            completeBtn.className = 'complete-btn';

            // Remove button
            const removeBtn = document.createElement('button');
            removeBtn.textContent = 'Remove';
            removeBtn.className = 'remove-btn';

            listItem.appendChild(taskSpan);
            listItem.appendChild(completeBtn);
            listItem.appendChild(removeBtn);

            // Mark as complete event
            completeBtn.addEventListener('click', () => {
                // Find the correct index in the main tasks array
                const realIdx = tasks.findIndex(t => t === task);
                if (realIdx !== -1) tasks[realIdx].completed = true;
                renderTasks();
            });

            // Remove event
            removeBtn.addEventListener('click', () => {
                const realIdx = tasks.findIndex(t => t === task);
                if (realIdx !== -1) tasks.splice(realIdx, 1);
                renderTasks();
            });

            taskList.appendChild(listItem);
        });
    }

    // Add new task
    function addTask() {
        const taskText = taskInput.value.trim();
        let topic = currentTopic || 'Work'; // Default to 'Work' if no topic selected
        if (taskText !== '') {
            tasks.push({ text: taskText, completed: false, topic });
            taskInput.value = '';
            renderTasks();
        }
    }

    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            addTask();
        }
    });

    // Sidebar icon click logic (update to filter by topic)
    const sidebarTopicTitle = document.getElementById('sidebar-topic-title');
    const sidebarFeatureList = document.getElementById('sidebar-feature-list');

    // Example features for each topic
    const topicFeatures = {
        Work: ["View pending work tasks", "Add new work task", "Set deadlines"],
        Personal: ["View personal reminders", "Add personal notes", "Track habits"],
        Shopping: ["View shopping list", "Add items to buy", "Mark items as bought"]
    };

    sidebarIcons.forEach(icon => {
        icon.addEventListener('click', (e) => {
            const topic = icon.getAttribute('data-topic');
            currentTopic = topic;
            renderTasks();
            if (sidebarTopic) {
                sidebarTopic.style.display = 'flex';
                if (sidebarTopicTitle) sidebarTopicTitle.textContent = topic;
                if (sidebarFeatureList) {
                    sidebarFeatureList.innerHTML = '';
                    (topicFeatures[topic] || []).forEach(feature => {
                        const li = document.createElement('li');
                        li.textContent = feature;
                        sidebarFeatureList.appendChild(li);
                    });
                }
            }
        });
    });

    // Hide topic when clicking outside (reset filter)
    document.addEventListener('click', (e) => {
        if (sidebarTopic && !e.target.classList.contains('sidebar-icon')) {
            sidebarTopic.style.display = 'none';
            currentTopic = null;
            renderTasks();
        }
    });

    // Initial render
    renderTasks();
});