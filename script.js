let journalEntries = JSON.parse(localStorage.getItem('journalEntries')) || {};
const currentYear = new Date().getFullYear(); // This gets the current year dynamically (e.g., 2024)

// Function to display only the current year (or any year that has been manually added)
function displayEntries() {
    const entriesList = document.getElementById('journalEntries');
    entriesList.innerHTML = ''; // Clear the list

    // Show the current year only, or manually added years
    if (journalEntries[currentYear] || Object.keys(journalEntries).length > 0) {
        const yearDiv = document.createElement('div');
        yearDiv.classList.add('year');

        // Create header for the current year (2024)
        const yearHeader = document.createElement('h3');
        yearHeader.textContent = currentYear;
        yearHeader.addEventListener('click', () => toggleVisibility(`year-${currentYear}`)); // Toggle visibility of months
        yearDiv.appendChild(yearHeader);

        const monthsDiv = document.createElement('div');
        monthsDiv.id = `year-${currentYear}`;
        monthsDiv.style.display = 'none'; // Initially hidden

        // Check if the current year has journal entries and display months accordingly
        if (journalEntries[currentYear]) {
            for (const month in journalEntries[currentYear]) {
                const monthDiv = document.createElement('div');
                monthDiv.classList.add('month');
                
                // Month header (collapsible)
                const monthHeader = document.createElement('h4');
                monthHeader.textContent = getMonthName(month);
                monthHeader.addEventListener('click', () => toggleVisibility(`month-${currentYear}-${month}`));
                monthDiv.appendChild(monthHeader);

                const daysDiv = document.createElement('div');
                daysDiv.id = `month-${currentYear}-${month}`;
                daysDiv.style.display = 'none'; // Initially hidden

                // Show days with journal entries for each month
                journalEntries[currentYear][month].forEach(entry => {
                    const dayItem = document.createElement('li');
                    dayItem.innerHTML = `
                        <strong>${entry.date}</strong>: ${entry.content} <br>
                        <button onclick="editEntry('${currentYear}', '${month}', '${entry.date}')">Edit</button>
                        <button onclick="deleteEntry('${currentYear}', '${month}', '${entry.date}')">Delete</button>
                    `;
                    daysDiv.appendChild(dayItem);
                });

                monthDiv.appendChild(daysDiv);
                monthsDiv.appendChild(monthDiv);
            }
        }

        yearDiv.appendChild(monthsDiv);
        entriesList.appendChild(yearDiv);
    }
}

// Helper function to toggle visibility of sections
function toggleVisibility(id) {
    const element = document.getElementById(id);
    element.style.display = element.style.display === 'none' ? 'block' : 'none';
}

// Save a new journal entry
document.getElementById('saveButton').addEventListener('click', () => {
    const dateInput = document.getElementById('entryDate').value;
    const contentInput = document.getElementById('entryContent').value;
    const tagsInput = document.getElementById('entryTags').value;
    const moodInput = document.getElementById('entryMood').value;

    // Validation to ensure date and content are provided
    if (!dateInput || !contentInput) {
        alert('Please fill out the date and content fields.');
        return;
    }

    // Convert date to "day-month-year"
    const dateParts = dateInput.split('-');
    const formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
    const year = dateParts[0]; // This should be the current year
    const month = dateParts[1]; // MM

    // Ensure the entry is saved only for the current year
    if (year !== String(currentYear)) {
        alert(`You can only add entries for the current year (${currentYear}).`);
        return;
    }

    if (!journalEntries[year]) {
        journalEntries[year] = {};
    }
    if (!journalEntries[year][month]) {
        journalEntries[year][month] = [];
    }

    // Update or add new entry
    const existingEntryIndex = journalEntries[year][month].findIndex(entry => entry.date === formattedDate);
    if (existingEntryIndex > -1) {
        journalEntries[year][month][existingEntryIndex] = {
            date: formattedDate,
            content: contentInput,
            tags: tagsInput,
            mood: moodInput,
        };
    } else {
        journalEntries[year][month].push({
            date: formattedDate,
            content: contentInput,
            tags: tagsInput,
            mood: moodInput,
        });
    }

    localStorage.setItem('journalEntries', JSON.stringify(journalEntries));
    displayEntries();
    clearInputFields();
});

// Edit existing entry
function editEntry(year, month, date) {
    const entryToEdit = journalEntries[year][month].find(entry => entry.date === date);
    if (entryToEdit) {
        const dateParts = entryToEdit.date.split('-');
        document.getElementById('entryDate').value = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`; // Reformat to YYYY-MM-DD
        document.getElementById('entryContent').value = entryToEdit.content;
        document.getElementById('entryTags').value = entryToEdit.tags;
        document.getElementById('entryMood').value = entryToEdit.mood;
        deleteEntry(year, month, date); // Remove entry after editing
    }
}

// Delete entry
function deleteEntry(year, month, date) {
    journalEntries[year][month] = journalEntries[year][month].filter(entry => entry.date !== date);
    if (journalEntries[year][month].length === 0) {
        delete journalEntries[year][month];
    }
    if (Object.keys(journalEntries[year]).length === 0) {
        delete journalEntries[year];
    }
    localStorage.setItem('journalEntries', JSON.stringify(journalEntries));
    displayEntries();
}

// Helper function to clear input fields
function clearInputFields() {
    document.getElementById('entryDate').value = '';
    document.getElementById('entryContent').value = '';
    document.getElementById('entryTags').value = '';
    document.getElementById('entryMood').value = 'happy';
}

// Helper function to get month names
function getMonthName(monthNumber) {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return monthNames[parseInt(monthNumber) - 1];
}

// Initial display of entries (current year only)
displayEntries();
