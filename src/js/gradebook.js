// src/js/gradebook.js
// Data + parsing + utilities for Gradebook Explorer

const testData = {
    headers: ["Student", "Lab 1", "Lab 2", "Midterm", "Final"],
    students: ["Johnson", "Adam Tam", "Suryansh Saroch"],
    marks: [
        [12, 23, 42, 21],
        [34, 12, 22, 33],
        [23, 34, 12, 11]
    ]
}

function fillGradesTable() {
    $("#header-row").append(testData.headers.map(h => `<th>${h}</th>`).join(""));
    for (let i = 0; i < testData.students.length; i++) {
        const student = testData.students[i];
        const marks = testData.marks[i];
        $("#grades-table").append(`
            <tr>
                <td class="student-name">${student}</td>
                ${marks.map(mark => `<td>${mark}</td>`).join("")}
            </tr>
        `);
    }
}

fillGradesTable()