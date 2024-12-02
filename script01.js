function submitQuery() {
    var phoneNum = document.getElementById('phoneNumInput').value;

    AWS.config.update({
        accessKeyId: '',
        secretAccessKey: '',
        region: 'ap-southeast-1'
    });

    var dynamodb = new AWS.DynamoDB();

    var params = {
        TableName: 'BurgerOrder',
        Key: {
            'CustomerPhoneNum': { S: phoneNum }
        }
    };

    dynamodb.getItem(params, function (err, data) {
        if (err) {
            console.error('Error retrieving item from DynamoDB:', err);
            displayErrorMessage();
        } else {
            var item = data.Item;
            if (item) {
                displayItem(item);
            } else {
                displayNoItemFound();
            }
        }
    });

    return false;
}

function displayItem(item) {
    var resultsBody = document.getElementById('resultsBody');
    resultsBody.innerHTML = '';

    // Define the custom names and attribute mapping
    var columnOrder = {
        'Receipt ID': 'SessionId',
        'Customer Name': 'CustomerName',
        'Phone Number': 'CustomerPhoneNum',
        'Address': 'CustomerAddress',
        'Burger Type': 'BurgerType',
        'Burger Size': 'BurgerSize',
        'Burger Quantity': 'BurgerQuantity',
        'Drink Type': 'DrinkType',
        'Drink Quantity': 'DrinkQuantity',
        'Side Type': 'SideType',
        'Side Quantity': 'SideQuantity'
    };

    for (var customName in columnOrder) {
        var attributeName = columnOrder[customName];
        var value = item[attributeName].S;

        var row = document.createElement('tr');
        var attributeNameCell = document.createElement('td');
        attributeNameCell.textContent = customName;
        var valueCell = document.createElement('td');
        valueCell.textContent = value;

        row.appendChild(attributeNameCell);
        row.appendChild(valueCell);
        resultsBody.appendChild(row);
    }

    document.getElementById('resultsContainer').style.display = 'block';
}

function displayNoItemFound() {
    var resultsBody = document.getElementById('resultsBody');
    resultsBody.innerHTML = '<tr><td colspan="11">No matching item found.</td></tr>';
    document.getElementById('resultsContainer').style.display = 'block';
}

function displayErrorMessage() {
    var resultsBody = document.getElementById('resultsBody');
    resultsBody.innerHTML = '<tr><td colspan="11">An error occurred while retrieving the item.</td></tr>';
    document.getElementById('resultsContainer').style.display = 'block';
}