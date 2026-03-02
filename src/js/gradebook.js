// src/js/gradebook.js
// Data + parsing + utilities for Gradebook Explorer

const table = $("#grades-table");
const tableBody = $("#table-body");

const testData = {
    headers: ["Student", "Lab 1", "Lab 2", "Midterm", "Final"],
    students: ["Johnson", "Adam Tam", "Suryansh Saroch"],
    grades: [[12, 23, 42, 21], [34, 12, 22, 33], [23, 34, 12, 11]]
}

function fillTableData() {
    // Fill header
    const headerRow = $("#header-row");
    for (let i = 0; i < testData.headers.length; i++) {
        const header = $(`<th class=col-"${i}">${testData.headers[i-1]}</th>`);  // TODO fix this -1 is too hacky
        if (i > 0) { header.on("click", selectCol) }
        headerRow.append(header);

    }

    // Fill body
    for (let i = 0; i < testData.students.length; i++) {
        const student = testData.students[i];
        const grades = testData.grades[i];
        tableBody.append(
            `<tr>
                <td class="student-name">${student}</td>
                ${grades.map((grade, index) => `<td class="col-${index} row-${i}">${grade}</td>`).join("")}
            </tr>
        `)
        $(`tr:last-child .student-name`).on("click",() => selectRow(i));
    }
}

function readSelectedData() {
    const selected = $(".selected").get();
    console.log(selected);
}

function deselectAll() {
    $(".selected").removeClass("selected");
}

function selectRow(rowId) {
    console.log(`Selecting row ${rowId}.`);
    deselectAll();
    $(`.row-${rowId}`).addClass("selected");
}

function selectCol() {
    console.log("asdad")
}

function editCell() {

}

fillTableData()