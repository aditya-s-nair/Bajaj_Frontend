document.getElementById('submitBtn').addEventListener('click', function() {
    const jsonInput = document.getElementById('jsonInput').value;
    const errorDiv = document.getElementById('error');
    const responseDiv = document.getElementById('response');
    const options = document.getElementById('options');

    errorDiv.textContent = '';  // Clear any previous errors
    responseDiv.style.display = 'none'; // Hide previous responses

    let jsonData;
    try {
        jsonData = JSON.parse(jsonInput);  // Validate JSON
        if (!jsonData.data) {
            throw new Error("Invalid JSON format: Missing 'data' field");
        }
    } catch (e) {
        errorDiv.textContent = e.message;
        return;
    }

    // Call the backend API
    fetch('http://127.0.0.1:5000/api/process', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonData),
    })
    .then(response => response.json())
    .then(data => {
        if (data.is_success) {
            options.style.display = 'block';  // Show the multi-select dropdown
            options.onchange = () => {
                let selectedOptions = Array.from(options.selectedOptions).map(opt => opt.value);
                let displayData = {};

                selectedOptions.forEach(opt => {
                    if (data[opt]) {
                        displayData[opt] = data[opt];
                    }
                });

                responseDiv.textContent = JSON.stringify(displayData, null, 2);
                responseDiv.style.display = 'block';
            };
        } else {
            errorDiv.textContent = 'Error processing request';
        }
    })
    .catch(error => {
        errorDiv.textContent = 'Error: ' + error.message;
    });
});
