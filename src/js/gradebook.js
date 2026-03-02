// src/js/gradebook.js
// Data + parsing + utilities for Gradebook Explorer

const table = $("#grades-table");
const tableBody = $("#table-body");
let isEditing = false;

const testData = {
    headers: ["Student", "Lab 1", "Lab 2", "Midterm", "Final"],
    students: ["Johnson", "Adam Tam", "Suryansh"],
    grades: [["12", "23", "42", "21"], ["34", "12", "22", "33"], ["23", "34", "fake", "11"]]
}

function fillTableData() {
    // Fill header
    const headerRow = $("#header-row");
    for (let i = 0; i < testData.headers.length; i++) {
        const header = $(`<th>${testData.headers[i]}</th>`);
        if (i > 0) {
            header.on("click", () => selectColumn(i-1)) // -1 because Student header shouldn't count
            header.addClass("clickable")
        }
        headerRow.append(header);
    }

    // Fill body
    for (let i = 0; i < testData.students.length; i++) {
        const student = testData.students[i];
        const grades = testData.grades[i];
        tableBody.append(
            `<tr>
                <td class="student-name clickable">${student}</td>
                ${grades.map((grade, index) => `<td class="col-${index} row-${i} cell">${grade}</td>`).join("")}
            </tr>
        `)
        $(`tr:last-child .cell`).on("click", editCell);
        $(`tr:last-child .student-name`).on("click",() => selectRow(i));
    }
}

function readSelectedData() {
    return $(".selected").toArray().map((item) => {
        console.log(item.textContent)
        if (/^\d+/.test(item.textContent)) {
            return parseFloat(item.textContent);
        }
    }).filter(Boolean);
}

function deselectAll() {
    $(".selected").removeClass("selected");
}

function selectRow(rowId) {
    console.log(`Selecting row ${rowId}.`);
    deselectAll();
    $(`.row-${rowId}`).addClass("selected");
    updateSummary("Row", testData.students[rowId]);
}

function selectColumn(colId) {
    console.log(`Selecting column ${colId}.`);
    deselectAll();
    $(`.col-${colId}`).addClass("selected");
    updateSummary("Column", testData.headers[colId+1]);
}

function updateSummary(direction, selectedName) {
    const data = readSelectedData();
    const hasSelection = data && data.length > 0;

    const mean = hasSelection ? (data.reduce((a, b) => a+b, 0)/data.length).toFixed(2) : 0;
    const min = hasSelection ? Math.min(...data).toFixed(2) : 0;
    const max = hasSelection ? Math.max(...data).toFixed(2) : 0;

    $("#selected").text(`${direction}: ${selectedName}`)
    $("#count").text(data.length);
    $("#mean").text(mean > 0 ? mean : 0);
    $("#min").text(min > 0 ? min : "-");
    $("#max").text(max > 0 ? max : "-");

}

function updateCell() {

}

function updateCell(newValue, originalValue) {
    if (/^\d+$/.test(newValue) && newValue !== originalValue) {
        //update the data and the csv
    }
}


// This thing is buggy need to fix
function editCell() {
    if (isEditing) return;
    isEditing = true;
    const cell = $(this);
    const originalValue = cell.text();
    const input = $("<input type='tel' id='edit-input'>")

    input.on("keydown", (e) => {
        const newValue = input.val().trim();
        if (e.key === "Enter") {
            updateCell(newValue, originalValue);
            $("#edit-input").remove();
            cell.text(newValue);
            isEditing = false;
        }
    });
    input.val(originalValue);
    cell.text("").append(input);
    input.focus();
}

fillTableData()