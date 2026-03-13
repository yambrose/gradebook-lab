// src/js/spreadsheet.js
// DOM generation + jQuery interactivity + editing + summary updates

const table = $("#grades-table");
const tableBody = $("#table-body");

let selectedDirection = null;
let selectedName = null;
let isEditing = false;

function fillTableData(data) {
    // Fill header
    const headerRow = $("#header-row");
    for (let i = 0; i < data.headers.length; i++) {
        const header = $(`<th class="clickable">${data.headers[i]}</th>`);
        if (i > 0) {
            header.attr("tabindex", 0)
                .on("click", () => selectColumn(i - 1, data)) // -1 because Student header shouldn't count
                .on("blur", deselectAll);
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
        $(`tr:last-child .cell`).on("click", function() {editCell($(this), data)});
        $(`tr:last-child .student-name`).attr("tabindex", 0)
            .on("click", () => selectRow(i, data))
            .on("blur", deselectAll);
    }
}

function readSelectedData() {
    return $(".selected").toArray().map((item) => {
        if (/^\d+/.test(item.textContent)) {
            return parseFloat(item.textContent);
        }
    }).filter((item) => item !== undefined);
}

function deselectAll() {
    selectedDirection = null;
    selectedName = null;
    $(".selected").removeClass("selected");
    removeInput();
    $("#no-data-message").removeClass("none");
    d3.select("#chart").selectAll("*").remove();
}

function selectRow(rowId, data) {
    console.log(`Selecting row ${rowId}.`);
    $(`.row-${rowId}`).addClass("selected");

    selectedDirection = "Row";
    selectedName = data.students[rowId];
    updateSummary("Row", data.students[rowId]);
    buildNewGraph("Letter Grade", "Frequency", readSelectedData());
    $("#no-data-message").addClass("none");
}

function selectColumn(colId, data) {
    console.log(`Selecting column ${colId}.`);
    $(`.col-${colId}`).addClass("selected");
    selectedDirection = "Column";
    selectedName = data.headers[colId + 1];
    updateSummary();
    buildNewGraph("Letter Grade", "Frequency", readSelectedData());
    $("#no-data-message").addClass("none");
}

function updateSummary() {
    const selected = readSelectedData();
    const hasSelection = selected && selected.length > 0;

    const mean = hasSelection ? (selected.reduce((a, b) => a + b, 0) / selected.length).toFixed(2) : 0;
    const min = hasSelection ? Math.min(...selected).toFixed(2) : 0;
    const max = hasSelection ? Math.max(...selected).toFixed(2) : 0;

    $("#selected").text(`${selectedDirection}: ${selectedName}`)
    $("#count").text(selected.length);
    $("#mean").text(mean > 0 ? mean : 0);
    $("#min").text(min > 0 ? min : "-");
    $("#max").text(max > 0 ? max : "-");

}

function updateCell(cell, newValue, originalValue, data) {
    const colIndex = cell.attr('class').split(' ')[0].split('col-')[1];
    const rowIndex = cell.attr('class').split(' ')[1].split('row-')[1];

    if (!isEditing) return;
    if (/^\d+(?:\.+\d*)?$/.test(newValue) &&
        newValue.length > 0 &&
        parseFloat(newValue) >= 0 &&
        newValue !== originalValue
    ) {
        cell.text(parseFloat(newValue));
        data.grades[rowIndex][colIndex] = newValue;
    } else {
        cell.text(originalValue);
    }

    if (selectedDirection) {
        updateSummary();
        buildNewGraph("Letter Grade", "Frequency", readSelectedData());
    }

    console.log(data);
    removeInput();
}

function removeInput() {
    $('#edit-input').remove();
    isEditing = false;
}

function editCell(cell, data) {
    if (isEditing) return;
    isEditing = true;
    const originalValue = cell.text();
    const input = $("<input type='tel' id='edit-input'>")
        .val(originalValue)
        .on("blur", function() { updateCell(cell, this.value.trim(), originalValue, data); })
        .on("keydown", function(e) {
            if (e.key === "Enter") updateCell(cell, this.value.trim(), originalValue, data);
        })
        .appendTo(cell)
        .focus();
}



// Issue(s)
// - chart doesn't update on window resize
