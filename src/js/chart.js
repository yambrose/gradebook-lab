// src/js/chart.js
// D3 charting for Gradebook Explorer

function buildGraphData(selectedData) {
    const total = selectedData.length;
    if (total === 0) return {A:0, B:0, C:0, D:0, F:0};

    let counts = {A: 0, B: 0, C: 0, D: 0, F: 0};

    for (grade of selectedData) {
        if (grade >= 90) counts.A++;
        else if (grade >= 80) counts.B++;
        else if (grade >= 70) counts.C++;
        else if (grade >= 60) counts.D++;
        else counts.F++;
    }
    console.log(counts);

    return {
        A: counts.A / total,
        B: counts.B / total,
        C: counts.C / total,
        D: counts.D / total,
        F: counts.F / total
    }
}

function createBarChart(xLab, yLab, data) {
    // Get the list of letter grades
    const letterGrades = buildGraphData(data)
    console.log(letterGrades);

    // Count the frequency of each letter grade

}

createBarChart("Letter Grade", "Frequency", [85, 92, 78, 65, 55, 90, 82, 73, 88, 95]);