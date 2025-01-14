document.getElementById('calculateBtn').addEventListener('click', function() {
    var lamdaWeekend = parseFloat(document.getElementById('lamda_weekend').value);
    var lamdaWeekday = parseFloat(document.getElementById('lamda_weekday').value);
    var kValues = document.getElementById('k').value.split('\n').map(function(k) {
        return parseInt(k.trim());
    }).filter(function(k) { return !isNaN(k); });

    // Validasi input untuk λ
    if (lamdaWeekend < 0 || lamdaWeekday < 0) {
        alert('Harap masukkan nilai positif untuk Lambda');
        return;
    }

    if (isNaN(lamdaWeekend) || isNaN(lamdaWeekday) || kValues.length === 0) {
        alert('Harap masukkan nilai yang valid untuk Lambda dan k');
        return;
    }

    var data = {
        lamda_weekend: lamdaWeekend,
        lamda_weekday: lamdaWeekday,
        k_values: kValues
    };

    fetch('/calculate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        // Langkah Penyelesaian
        var stepsContainer = document.getElementById('calculation_steps');
        stepsContainer.innerHTML = '';

        var stepsHTML = '<ul>';
        result.steps.forEach((step, index) => {
            stepsHTML += `<li>Langkah ${index + 1}: ${step}</li>`;
        });
        stepsHTML += '</ul>';
        stepsContainer.innerHTML = stepsHTML;

        // Tabel Perbandingan
        var comparisonTable = document.getElementById('comparison_table');
        comparisonTable.innerHTML = '';

        var labels = result.k_values;
        var weekendData = result.weekend_results;
        var weekdayData = result.weekday_results;

        var tableHTML = `<table>
                            <thead>
                                <tr>
                                    <th>k</th>
                                    <th>Probabilitas Akhir Pekan</th>
                                    <th>Probabilitas Hari Biasa</th>
                                </tr>
                            </thead>
                            <tbody>`;
        labels.forEach((k, index) => {
            tableHTML += `<tr>
                            <td>${k}</td>
                            <td>${weekendData[index].toFixed(6)}</td>
                            <td>${weekdayData[index].toFixed(6)}</td>
                          </tr>`;
        });
        tableHTML += '</tbody></table>';
        comparisonTable.innerHTML = tableHTML;

        // Grafik
        var ctx = document.getElementById('chart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Akhir Pekan',
                        data: weekendData,
                        backgroundColor: 'rgba(75, 192, 192, 0.6)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1
                    },
                    {
                        label: 'Hari Biasa',
                        data: weekdayData,
                        backgroundColor: 'rgba(153, 102, 255, 0.6)',
                        borderColor: 'rgba(153, 102, 255, 1)',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                }
            }
        });
    })
    .catch(error => {
        console.error('Error:', error);
    });
});
