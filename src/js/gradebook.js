// src/js/gradebook.js
// Data + parsing + utilities for Gradebook Explorer

const table = $("#grades-table");
const tableBody = $("#table-body");

const testData = {
    headers: ["Student", "Lab 1", "Lab 2", "Midterm", "Final"],
    students: ["Johnson", "Adam Tam", "Suryansh Saroch"],
    grades: [["12", "23", "42", "21"], ["34", "12", "22", "33"], ["23", "34", "fake", "11"]]
}

function fillTableData() {
    // Fill header
    const headerRow = $("#header-row");
    for (let i = 0; i < testData.headers.length; i++) {
        const header = $(`<th>${testData.headers[i]}</th>`);
        if (i > 0) {
            header.on("click", () => selectCol(i-1)) // -1 because Student header shouldn't count
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
                ${grades.map((grade, index) => `<td class="col-${index} row-${i}">${grade}</td>`).join("")}
            </tr>
        `)
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
    updateSummary();
}

function selectCol(colId) {
    console.log(`Selecting column ${colId}.`);
    deselectAll();
    $(`.col-${colId}`).addClass("selected");
    updateSummary();
}

function updateSummary() {
    const data = readSelectedData();
    console.log(data)
    const mean = data.reduce((a, b) => a+b, 0)/data.length;
    const min = Math.min(data);
    const max = Math.max(data);

    $("#count").text(data.length);
    $("#mean").text(mean.toFixed(2));

}

function editCell() {
    claire
}

fillTableData()