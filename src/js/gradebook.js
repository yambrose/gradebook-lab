// src/js/gradebook.js
// Data + parsing + utilities for Gradebook Explorer

const table = $("#grades-table");
const tableBody = $("#table-body");

let selectedDirection = null;
let selectedName = null;
let isEditing = false;

async function readDataFromCSV() {
    let updatedData = {
        headers: [],
        students: [],
        grades: []
    };

    await fetch("http://localhost:8000/src/data/grades.csv")
        .then(response => response.text())
        .then(data => data.trim().split('\n').map((row) => row.split(',')))
        .then(data => {
            console.log(data);
            updatedData.headers = data[0];
            for (let i = 1; i < data.length; i++) {
                updatedData.students.push((data[i][0]))
                updatedData.grades.push(data[i].slice(1));
            }
            fillTableData(updatedData);
        }
        )

    console.log(updatedData);
    return updatedData;
}

function fillTableData(data) {
    // Fill header
    const headerRow = $("#header-row");
    for (let i = 0; i < data.headers.length; i++) {
        const header = $(`<th>${data.headers[i]}</th>`);
        if (i > 0) {
            header.on("click", () => selectColumn(i-1, data)) // -1 because Student header shouldn't count
            header.addClass("clickable")
        }
        headerRow.append(header);
    }

    // Fill body
    for (let i = 0; i < data.students.length; i++) {
        const student = data.students[i];
        const grades = data.grades[i];
        tableBody.append(
            `<tr>
                <td class="student-name clickable">${student}</td>
                ${grades.map((grade, index) => `<td class="col-${index} row-${i} cell">${grade}</td>`).join("")}
            </tr>
        `)
        $(`tr:last-child .cell`).on("click", editCell);
        $(`tr:last-child .student-name`).on("click",() => selectRow(i, data));
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

function selectRow(rowId, data) {
    console.log(`Selecting row ${rowId}.`);
    deselectAll();
    $(`.row-${rowId}`).addClass("selected");

    selectedDirection = "Row";
    selectedName = data.students[rowId];
    updateSummary("Row", data.students[rowId]);
}

function selectColumn(colId, data) {
    console.log(`Selecting column ${colId}.`);
    deselectAll();
    $(`.col-${colId}`).addClass("selected");
    selectedDirection = "Column";
    selectedName = data.headers[colId+1];
    updateSummary();
}

function updateSummary() {
    const selected = readSelectedData();
    const hasSelection = selected && selected.length > 0;

    const mean = hasSelection ? (selected.reduce((a, b) => a+b, 0)/selected.length).toFixed(2) : 0;
    const min = hasSelection ? Math.min(...selected).toFixed(2) : 0;
    const max = hasSelection ? Math.max(...selected).toFixed(2) : 0;

    $("#selected").text(`${selectedDirection}: ${selectedName}`)
    $("#count").text(selected.length);
    $("#mean").text(mean > 0 ? mean : 0);
    $("#min").text(min > 0 ? min : "-");
    $("#max").text(max > 0 ? max : "-");

}

function updateCell(cell, newValue, originalValue) {
    if (/^\d+(?:\.+\d*)?$/.test(newValue) &&
        newValue.length > 0 &&
        parseFloat(newValue) >= 0 &&
        newValue !== originalValue
    ) {
        cell.text(parseFloat(newValue));
    } else {
        cell.text(originalValue);
    }
    updateSummary();
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
            updateCell(cell, newValue, originalValue);
            $("#edit-input").remove();
            isEditing = false;
        }
    });
    input.val(originalValue);
    cell.text("").append(input);
    input.focus();
}

// TODO: Write the data to the csv, then reread it to update the table
function writeDataToCSV() {

}


readDataFromCSV();
