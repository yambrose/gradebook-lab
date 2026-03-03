// src/js/gradebook.js
// Data + parsing + utilities for Gradebook Explorer

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

function writeDataToCSV() {

}

readDataFromCSV();