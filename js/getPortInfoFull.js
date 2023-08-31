async function getPortInfoFull() {
    const response = await fetch('http://5.149.127.105', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            jsonrpc: '2.0',
            method: 'comware.GetPortInfoFull',
            params: {
                target: {
                    ip: '10.10.10.10',
                    username: 'netconf-user',
                    password: 'netconf-password'
                },
                ifIndex: 24
            },
            id: '38276e9c-018d-498e-95af-ad8c019a000d'
        })
    });

    if (!response.ok) {
        const message = `An error has occurred: ${response.status}`;
        throw new Error(message);
    }

    const data = await response.json();
    const parsedData = data.result;
    for (let key in parsedData) {
        let newDiv = document.createElement('div');
        newDiv.setAttribute('id', key);
        newDiv.textContent = `${key}: ${JSON.stringify(parsedData[key], null, 2)}`;
        document.body.appendChild(newDiv);
    }
}

window.onload = getPortInfoFull;