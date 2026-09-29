// ================================
// GET HTML ELEMENTS
// ================================

const taskInput =
    document.getElementById("taskInput");

const taskDate =
    document.getElementById("taskDate");

const taskPriority =
    document.getElementById("taskPriority");

const taskCategory =
    document.getElementById("taskCategory");

const taskNotes =
    document.getElementById("taskNotes");

const addTaskBtn =
    document.getElementById("addTaskBtn");

const taskList =
    document.getElementById("taskList");

const totalTasks =
    document.getElementById("totalTasks");

const activeTasks =
    document.getElementById("activeTasks");

const completedTasks =
    document.getElementById("completedTasks");

const progressPercentage =
    document.getElementById("progressPercentage");

const progressText =
    document.getElementById("progressText");

const progressFill =
    document.getElementById("progressFill");

const searchInput =
    document.getElementById("searchInput");

const allTasksBtn =
    document.getElementById("allTasksBtn");

const activeTasksBtn =
    document.getElementById("activeTasksBtn");

const completedTasksBtn =
    document.getElementById("completedTasksBtn");

const priorityFilter =
    document.getElementById("priorityFilter");

const clearAllBtn =
    document.getElementById("clearAllBtn");

const darkModeBtn =
    document.getElementById("darkModeBtn");

const exportTasksBtn = document.getElementById("exportTasksBtn");
const importTasksBtn = document.getElementById("importTasksBtn");
const importFileInput = document.getElementById("importFileInput");
const completedBar = document.getElementById("completedBar");
const activeBar = document.getElementById("activeBar");
const completedSummary = document.getElementById("completedSummary");
const activeSummary = document.getElementById("activeSummary");
// ================================
// EDIT MODAL ELEMENTS
// ================================

const editModal =
    document.getElementById("editModal");

const editTaskInput =
    document.getElementById("editTaskInput");

const editTaskDate =
    document.getElementById("editTaskDate");

const editTaskPriority =
    document.getElementById("editTaskPriority");

const editTaskCategory =
    document.getElementById("editTaskCategory");

const editTaskNotes =
    document.getElementById("editTaskNotes");

const saveEditBtn =
    document.getElementById("saveEditBtn");

const cancelEditBtn =
    document.getElementById("cancelEditBtn");


// ================================
// LOAD TASKS
// ================================

let tasks =
    JSON.parse(localStorage.getItem("tasks")) || [];


// ================================
// CURRENT FILTERS
// ================================

let currentFilter = "all";

let currentPriorityFilter = "all";


// ================================
// EDITING TASK INDEX
// ================================

let editingTaskIndex = null;


// ================================
// EXPANDED TASKS
// ================================

let expandedTasks = new Set();


// ================================
// DISPLAY TASKS
// ================================

function displayTasks() {

    const searchText =
        searchInput.value
            .toLowerCase()
            .trim();


    taskList.innerHTML = "";


    // ================================
    // TASK STATISTICS
    // ================================

    const total =
        tasks.length;


    const completed =
        tasks.filter(
            task => task.completed
        ).length;


    const active =
        total - completed;


    const progress =
        total === 0
            ? 0
            : Math.round(
                (completed / total) * 100
            );


    totalTasks.textContent =
        total;

    activeTasks.textContent =
        active;

    completedTasks.textContent =
        completed;

    progressPercentage.textContent =
        progress + "%";

    progressText.textContent =
        progress + "%";

    progressFill.style.width =
        progress + "%";


    // ================================
    // NO TASKS
    // ================================

    if (tasks.length === 0) {

        const emptyMessage =
            document.createElement("li");

        emptyMessage.textContent =
            "No tasks yet. Add your first task!";

        emptyMessage.classList.add(
            "empty-message"
        );

        taskList.appendChild(
            emptyMessage
        );

        updateFilterButtons();

        return;
    }


    // ================================
    // FILTER TASKS
    // ================================

    const filteredTasks =
        tasks
            .map((task, index) => ({
                task: task,
                originalIndex: index
            }))

            .filter(item => {

                const task =
                    item.task;


                // Search
                const matchesSearch =
                    task.text
                        .toLowerCase()
                        .includes(searchText);


                // All / Active / Completed
                let matchesFilter = true;


                if (
                    currentFilter === "active"
                ) {

                    matchesFilter =
                        !task.completed;

                }


                if (
                    currentFilter === "completed"
                ) {

                    matchesFilter =
                        task.completed;

                }


                // Priority Filter
                let matchesPriority = true;


                if (
                    currentPriorityFilter !== "all"
                ) {

                    matchesPriority =
                        (
                            task.priority ||
                            "medium"
                        ) ===
                        currentPriorityFilter;

                }


                return (
                    matchesSearch &&
                    matchesFilter &&
                    matchesPriority
                );

            })


            // ================================
            // SORT BY DATE + PRIORITY
            // ================================

            .sort((a, b) => {

                if (
                    !a.task.date &&
                    b.task.date
                ) {

                    return 1;

                }


                if (
                    a.task.date &&
                    !b.task.date
                ) {

                    return -1;

                }


                if (
                    a.task.date &&
                    b.task.date
                ) {

                    const dateDifference =
                        a.task.date.localeCompare(
                            b.task.date
                        );


                    if (
                        dateDifference !== 0
                    ) {

                        return dateDifference;

                    }

                }


                const priorityOrder = {

                    high: 1,

                    medium: 2,

                    low: 3

                };


                const priorityA =
                    priorityOrder[
                        a.task.priority ||
                        "medium"
                    ];


                const priorityB =
                    priorityOrder[
                        b.task.priority ||
                        "medium"
                    ];


                return priorityA - priorityB;

            });


    // ================================
    // NO FILTER RESULT
    // ================================

    if (
        filteredTasks.length === 0
    ) {

        const noResultMessage =
            document.createElement("li");

        noResultMessage.textContent =
            "No matching tasks found.";

        noResultMessage.classList.add(
            "empty-message"
        );

        taskList.appendChild(
            noResultMessage
        );

        updateFilterButtons();

        return;
    }


    // ================================
    // CREATE TASK ITEMS
    // ================================

    filteredTasks.forEach(item => {

        const task =
            item.task;

        const index =
            item.originalIndex;


        // ================================
        // LI
        // ================================

        const li =
            document.createElement("li");


        // ================================
        // TASK CONTENT
        // ================================

        const taskContent =
            document.createElement("div");

        taskContent.classList.add(
            "task-content"
        );


        // ================================
        // TASK TEXT
        // ================================

        const taskText =
            document.createElement("span");

        taskText.textContent =
            task.text;


        if (task.completed) {

            taskText.classList.add(
                "completed"
            );

        }


        taskContent.appendChild(
            taskText
        );


        // ================================
        // NOTES
        // ================================

        if (task.notes) {

            // Details Button
            const detailsBtn =
                document.createElement("button");


            detailsBtn.classList.add(
                "task-details-btn"
            );


            // Notes Element
            const notesText =
                document.createElement("small");


            notesText.textContent =
                task.notes;


            notesText.classList.add(
                "task-notes"
            );


            // Check Expanded State
            if (
                expandedTasks.has(index)
            ) {

                detailsBtn.textContent =
                    "Hide Details";

                notesText.style.display =
                    "block";

            }
            else {

                detailsBtn.textContent =
                    "View Details";

                notesText.style.display =
                    "none";

            }


            // Details Button Event
            detailsBtn.addEventListener(
                "click",
                function () {

                    toggleTaskDetails(
                        index
                    );

                }
            );


            taskContent.appendChild(
                detailsBtn
            );


            taskContent.appendChild(
                notesText
            );

        }


        // ================================
        // DUE DATE
        // ================================

        if (task.date) {

            const dateText =
                document.createElement("small");


            dateText.textContent =
                "Due: " +
                formatDate(task.date);


            dateText.classList.add(
                "task-date"
            );


            const status =
                getTaskDateStatus(task);


            const statusText =
                document.createElement("small");


            statusText.textContent =
                status;


            statusText.classList.add(
                "task-status"
            );


            taskContent.appendChild(
                dateText
            );


            taskContent.appendChild(
                statusText
            );

        }


        // ================================
        // PRIORITY
        // ================================

        const priority =
            task.priority || "medium";


        const priorityText =
            document.createElement("small");


        if (
            priority === "high"
        ) {

            priorityText.textContent =
                "High Priority";

        }
        else if (
            priority === "low"
        ) {

            priorityText.textContent =
                "Low Priority";

        }
        else {

            priorityText.textContent =
                "Medium Priority";

        }


        priorityText.classList.add(
            "task-priority"
        );


        priorityText.classList.add(
            "priority-" + priority
        );


        taskContent.appendChild(
            priorityText
        );


        // ================================
        // CATEGORY
        // ================================

        const category =
            task.category || "personal";


        const categoryText =
            document.createElement("small");


        categoryText.textContent =
            category.charAt(0).toUpperCase() +
            category.slice(1);


        categoryText.classList.add(
            "task-category"
        );


        taskContent.appendChild(
            categoryText
        );


        // ================================
        // BUTTON CONTAINER
        // ================================

        const buttons =
            document.createElement("div");


        buttons.classList.add(
            "task-buttons"
        );


        // ================================
        // COMPLETE / UNDO
        // ================================

        const completeBtn =
            document.createElement("button");


        completeBtn.textContent =
            task.completed
                ? "Undo"
                : "Complete";


        completeBtn.addEventListener(
            "click",
            function () {

                toggleTask(index);

            }
        );


        // ================================
        // EDIT
        // ================================

        const editBtn =
            document.createElement("button");


        editBtn.textContent =
            "Edit";


        editBtn.addEventListener(
            "click",
            function () {

                openEditModal(index);

            }
        );


        // ================================
        // DELETE
        // ================================

        const deleteBtn =
            document.createElement("button");


        deleteBtn.textContent =
            "Delete";


        deleteBtn.addEventListener(
            "click",
            function () {

                deleteTask(index);

            }
        );


        // ================================
        // ADD BUTTONS
        // ================================

        buttons.appendChild(
            completeBtn
        );

        buttons.appendChild(
            editBtn
        );

        buttons.appendChild(
            deleteBtn
        );


        // ================================
        // ADD CONTENT
        // ================================

        li.appendChild(
            taskContent
        );

        li.appendChild(
            buttons
        );


        taskList.appendChild(
            li
        );

    });


    updateFilterButtons();

}


// ================================
// EXPAND / COLLAPSE DETAILS
// ================================

function toggleTaskDetails(index) {

    if (
        expandedTasks.has(index)
    ) {

        expandedTasks.delete(index);

    }
    else {

        expandedTasks.add(index);

    }


    displayTasks();

}


// ================================
// FORMAT DATE
// ================================

function formatDate(dateString) {

    const date =
        new Date(
            dateString + "T00:00:00"
        );


    return date.toLocaleDateString(
        "en-US",
        {
            year: "numeric",
            month: "short",
            day: "numeric"
        }
    );

}


// ================================
// TASK DATE STATUS
// ================================

function getTaskDateStatus(task) {

    if (
        task.completed
    ) {

        return "Completed";

    }


    if (
        !task.date
    ) {

        return "";

    }


    const today =
        new Date()
            .toISOString()
            .split("T")[0];


    if (
        task.date < today
    ) {

        return "Overdue";

    }


    if (
        task.date === today
    ) {

        return "Due Today";

    }


    return "Upcoming";

}


// ================================
// ADD TASK
// ================================

addTaskBtn.addEventListener(
    "click",
    addTask
);


taskInput.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Enter"
        ) {

            addTask();

        }

    }
);


// ================================
// ADD TASK FUNCTION
// ================================

function addTask() {

    const taskText =
        taskInput.value.trim();

    const selectedDate =
        taskDate.value;

    const selectedPriority =
        taskPriority.value;

    const selectedCategory =
        taskCategory.value;

    const selectedNotes =
        taskNotes.value.trim();


    if (
        taskText === ""
    ) {

        alert(
            "Please enter a task."
        );

        return;

    }


    tasks.push({

        text: taskText,

        completed: false,

        date: selectedDate,

        priority: selectedPriority,

        category: selectedCategory,

        notes: selectedNotes

    });


    saveTasks();


    taskInput.value = "";

    taskDate.value = "";

    taskPriority.value =
        "medium";

    taskCategory.value =
        "personal";

    taskNotes.value = "";


    taskInput.focus();

}


// ================================
// COMPLETE / UNDO
// ================================

function toggleTask(index) {

    tasks[index].completed =
        !tasks[index].completed;

    saveTasks();

}


// ================================
// OPEN EDIT MODAL
// ================================

function openEditModal(index) {

    editingTaskIndex =
        index;


    editTaskInput.value =
        tasks[index].text;

    editTaskDate.value =
        tasks[index].date || "";

    editTaskPriority.value =
        tasks[index].priority ||
        "medium";

    editTaskCategory.value =
        tasks[index].category ||
        "personal";

    editTaskNotes.value =
        tasks[index].notes ||
        "";


    editModal.classList.add(
        "show"
    );


    editTaskInput.focus();

}


// ================================
// SAVE EDIT
// ================================

saveEditBtn.addEventListener(
    "click",
    function () {

        if (
            editingTaskIndex === null
        ) {

            return;

        }


        const updatedTask =
            editTaskInput.value.trim();

        const updatedDate =
            editTaskDate.value;

        const updatedPriority =
            editTaskPriority.value;

        const updatedCategory =
            editTaskCategory.value;

        const updatedNotes =
            editTaskNotes.value.trim();


        if (
            updatedTask === ""
        ) {

            alert(
                "Task cannot be empty."
            );

            return;

        }


        tasks[editingTaskIndex].text =
            updatedTask;

        tasks[editingTaskIndex].date =
            updatedDate;

        tasks[editingTaskIndex].priority =
            updatedPriority;

        tasks[editingTaskIndex].category =
            updatedCategory;

        tasks[editingTaskIndex].notes =
            updatedNotes;


        saveTasks();

        closeEditModal();

    }
);


// ================================
// CANCEL EDIT
// ================================

cancelEditBtn.addEventListener(
    "click",
    function () {

        closeEditModal();

    }
);


// ================================
// CLOSE EDIT MODAL
// ================================

function closeEditModal() {

    editModal.classList.remove(
        "show"
    );

    editingTaskIndex =
        null;

}


// ================================
// DELETE TASK
// ================================

function deleteTask(index) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this task?"
        );


    if (
        !confirmDelete
    ) {

        return;

    }


    tasks.splice(
        index,
        1
    );


    // Remove expanded state
    expandedTasks.delete(index);


    saveTasks();

}


// ================================
// CLEAR ALL TASKS
// ================================

clearAllBtn.addEventListener(
    "click",
    function () {

        if (
            tasks.length === 0
        ) {

            alert(
                "There are no tasks to clear."
            );

            return;

        }


        const confirmClear =
            confirm(
                "Are you sure you want to delete all tasks?"
            );


        if (
            !confirmClear
        ) {

            return;

        }


        tasks = [];

        expandedTasks.clear();

        saveTasks();

    }
);


// ================================
// SEARCH
// ================================

searchInput.addEventListener(
    "input",
    function () {

        displayTasks();

    }
);


// ================================
// ALL TASKS
// ================================

allTasksBtn.addEventListener(
    "click",
    function () {

        currentFilter =
            "all";

        displayTasks();

    }
);


// ================================
// ACTIVE TASKS
// ================================

activeTasksBtn.addEventListener(
    "click",
    function () {

        currentFilter =
            "active";

        displayTasks();

    }
);


// ================================
// COMPLETED TASKS
// ================================

completedTasksBtn.addEventListener(
    "click",
    function () {

        currentFilter =
            "completed";

        displayTasks();

    }
);


// ================================
// PRIORITY FILTER
// ================================

priorityFilter.addEventListener(
    "change",
    function () {

        currentPriorityFilter =
            priorityFilter.value;

        displayTasks();

    }
);


// ================================
// UPDATE FILTER BUTTONS
// ================================

function updateFilterButtons() {

    allTasksBtn.classList.remove(
        "active"
    );

    activeTasksBtn.classList.remove(
        "active"
    );

    completedTasksBtn.classList.remove(
        "active"
    );


    if (
        currentFilter === "all"
    ) {

        allTasksBtn.classList.add(
            "active"
        );

    }


    if (
        currentFilter === "active"
    ) {

        activeTasksBtn.classList.add(
            "active"
        );

    }


    if (
        currentFilter === "completed"
    ) {

        completedTasksBtn.classList.add(
            "active"
        );

    }

}


// ================================
// SAVE TASKS
// ================================

function saveTasks() {

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );

    displayTasks();

}


// ================================
// DARK MODE
// ================================

darkModeBtn.addEventListener(
    "click",
    function () {

        document.body.classList.toggle(
            "dark-mode"
        );


        if (
            document.body.classList.contains(
                "dark-mode"
            )
        ) {

            darkModeBtn.textContent =
                "☀️ Light Mode";

            localStorage.setItem(
                "darkMode",
                "enabled"
            );

        }
        else {

            darkModeBtn.textContent =
                "🌙 Dark Mode";

            localStorage.setItem(
                "darkMode",
                "disabled"
            );

        }

    }
);


// ================================
// LOAD DARK MODE
// ================================

if (
    localStorage.getItem("darkMode") ===
    "enabled"
) {

    document.body.classList.add(
        "dark-mode"
    );

    darkModeBtn.textContent =
        "☀️ Light Mode";
}


// ================================
// INITIAL DISPLAY
// ================================

displayTasks();
// ================================
// EXPORT TASKS
// ================================

exportTasksBtn.addEventListener("click", function () {
    if (tasks.length === 0) {
        alert("There are no tasks to export.");
        return;
    }

    const data = JSON.stringify(tasks, null, 2);

    const blob = new Blob([data], {
        type: "application/json"
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "my-tasks-backup.json";

    link.click();

    URL.revokeObjectURL(url);
});


// ================================
// IMPORT TASKS
// ================================

importTasksBtn.addEventListener("click", function () {
    importFileInput.click();
});


importFileInput.addEventListener("change", function (event) {
    const file = event.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (e) {
        try {
            const importedTasks = JSON.parse(e.target.result);

            if (!Array.isArray(importedTasks)) {
                alert("Invalid backup file.");
                return;
            }

            const confirmImport = confirm(
                "Importing this backup will replace your current tasks. Continue?"
            );

            if (!confirmImport) return;

            tasks = importedTasks;
            expandedTasks.clear();

            saveTasks();

            alert("Tasks imported successfully!");

        } catch (error) {
            alert("Unable to read the backup file.");
        }

        importFileInput.value = "";
    };

    reader.readAsText(file);
});