// src/js/gradebook.js
// Data + parsing + utilities for Gradebook Explorer

const testData = {
    headers: ["Student", "Lab 1", "Lab 2", "Midterm", "Final"],
    students: ["Johnson", "Adam Tam", "Suryansh Saroch"],
    marks: [[12, 23, 42, 21], [34, 12, 22, 33], [23, 34, 12, 11]]
}

function fillGradesTable() {
    $("#header-row").append(testData.headers.map((header, index) => `<th id="header-${index}">${header}</th>`).join(""));
    testData.headers.forEach((header, index) => {
        if (index > 0) {
            $(`#header-${index}`).click(() => selectAssignment(index));
        }
    });
    for (let i = 0; i < testData.students.length; i++) {
        const student = testData.students[i];
        const marks = testData.marks[i];
        $("#grades-table").append(`
            <tr class="data-row">
                <td id="student-${i}" class="student-name">${student}</td>
                ${marks.map(mark => `<td id="${student}-${headers[i]}">${mark}</td>`).join("")}
            </tr>
        `);
        $(`${student}-${headers[i]}`).click(() => selectCell(i));
        $(".student-name").last().click(() => selectStudent(i));
    }
}

function selectStudent(studentIndex) {
    console.log(`Selected student: ${testData.students[studentIndex]}`);
    deselectAll();
    const currentRow = $(`#student-${studentIndex}`).parent();
    for (let i = 0; i < testData.headers.length - 1; i++) {
        const cell = currentRow.children().eq(i + 1);
        cell.addClass("selected");
    }
    updateSummary()
}

function selectAssignment(assignmentId) {
    console.log(`Selected assignment: ${testData.headers[assignmentId]}`);
    deselectAll();
    for (let i = 0; i < testData.students.length; i++) {
        const cell = $(`#student-${i}`).parent().children().eq(assignmentId);
        cell.addClass("selected");
    }

}

function selectCell(id) {
    console.log(`Editing cell for ${testData.students[i]}: ${testData.headers[i]}`);
}

function deselectAll() {
    $(".selected").removeClass("selected");
}

function updateSummary() {
    //TODO
}

fillGradesTable()