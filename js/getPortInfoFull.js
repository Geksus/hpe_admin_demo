let portSelector = document.getElementById('portSelect');

if(portSelector) {
    for (let i = 1; i < 24; i++) {
        let option = document.createElement('option');
        option.value = i;
        option.textContent = i;

        portSelector.appendChild(option);
    }

    // Add event listener for the change event
    portSelector.addEventListener('change', function() {
        // Call the function when the selected option changes
        getPortInfoFull(this.value);
    });
}

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
                ifIndex: 23
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

    let ifName = document.getElementById('ifName')
    ifName.textContent = `${parsedData.ifName}`;
    let ifType = document.getElementById('ifType')
    ifType.textContent = `${parsedData.ifType}`;
    let ifAbbreviatedName = document.getElementById('ifAbbreviatedName')
    ifAbbreviatedName.textContent = `${parsedData.ifAbbreviatedName}`;
    let description = document.getElementById('description')
    description.textContent = `${parsedData.description}`;
    let adminStatus = document.getElementById('adminStatus');
    adminStatus.value = parsedData.adminStatus;
    adminStatus.textContent = parsedData.adminStatus;
    let notAdminStatus = document.getElementById('notAdminStatus')
    if (adminStatus.textContent === 'AdmUp') {
        notAdminStatus.value = 'AdmDown'
        notAdminStatus.textContent = 'AdmDown'
    } else {
        notAdminStatus.value = 'AdmUp'
        notAdminStatus.textContent = 'AdmUp'
    }
    let operStatus = document.getElementById('operStatus')
    operStatus.textContent = parsedData.operStatus
    let actualDuplex = document.getElementById('actualDuplex')
    actualDuplex.textContent = `${parsedData.actualDuplex}`
    let bpduDropAny = document.getElementById('bpduDropAny')
    bpduDropAny.textContent = `${parsedData.bpduDropAny}`
    let actualSpeed = document.getElementById('actualSpeed')
    actualSpeed.textContent = `${parsedData.actualSpeed}`
    let supportedIfSpeed = document.getElementById('supportedIfSpeed')
    supportedIfSpeed.textContent = `${parsedData.supportedIfSpeed}`
    let inInterval = document.getElementById('inInterval')
    inInterval.textContent = `${parsedData.statistics.interval}`;
    let outInterval = document.getElementById('outInterval')
    outInterval.textContent = `${parsedData.statistics.interval}`;
    let inPackets = document.getElementById('inPackets')
    inPackets.textContent = `${parsedData.statistics.inPackets}`;
    let outPackets = document.getElementById('outPackets')
    outPackets.textContent = `${parsedData.statistics.outPackets}`;
    let inOctets = document.getElementById('inOctets')
    inOctets.textContent = `${parsedData.statistics.inOctets}`;
    let inUsage = document.getElementById('inUsage')
    inUsage.textContent = (parseInt(inOctets.textContent) * 8 / parseInt(inInterval.textContent) / parseInt(actualSpeed.textContent)).toFixed(2) + '%'
    let outOctets = document.getElementById('outOctets')
    outOctets.textContent = `${parsedData.statistics.outOctets}`;
    let outUsage = document.getElementById('outUsage')
    outUsage.textContent = (parseInt(outOctets.textContent) * 8 / parseInt(outInterval.textContent) / parseInt(actualSpeed.textContent)).toFixed(2) + '%'
    // let inBits = document.getElementById('inBits')
    // inBits.textContent = `${parsedData.statistics.inBits}`;
    // let outBits = document.getElementById('outBits')
    // outBits.textContent = `${parsedData.statistics.outBits}`;
    let linkType = document.getElementById('linkType')
    linkType.value = `${parsedData.vlan.linkType}`;
    let pvid = document.getElementById('pvid')
    pvid.value = `${parsedData.vlan.pvid}`;
    let untaggedVlanList = document.getElementById('untaggedVlanList')
    untaggedVlanList.value = `${parsedData.vlan.untaggedVlanList}`;
    let taggedVlanList = document.getElementById('taggedVlanList')
    taggedVlanList.value = `${parsedData.vlan.taggedVlanList}`;
    let permitVlanList = document.getElementById('permitVlanList')
    permitVlanList.value = `${parsedData.vlan.permitVlanList}`;

    const macTable = data.result.macTable;

    // Get the main container where you want to add your new elements
    let macContent = document.querySelector('.mac-content');

    // Iterate over 'macTable' to create new elements for each object
    for (let i = 0; i < macTable.length; i++) {
        // Create new elements with corresponding data
        let row = document.createElement('div');
        row.className = "row";

        let vlanCard = document.createElement('div');
        vlanCard.className = "card bg-primary";
        vlanCard.textContent = macTable[i].vlan;

        let macCard = document.createElement('div');
        macCard.className = "card card-outline card-danger uneditable";
        macCard.textContent = macTable[i].mac;

        // Append new elements to the row
        row.appendChild(vlanCard);
        row.appendChild(macCard);

        // Append the row to the main-content div
        macContent.appendChild(row);
    }


    const speedList = data.result.supportedIfSpeed;


    let configSpeedSelect = document.getElementById('configSpeed');

    let optionZero = document.createElement('option');
    optionZero.value = parsedData.configSpeed;
    if (optionZero.value === '0') {
        optionZero.textContent = 'Auto';
    } else {
        optionZero.value = parsedData.configSpeed;
        optionZero.textContent = parsedData.configSpeed;
    }

    configSpeedSelect.appendChild(optionZero);

    for (let i = 0; i < speedList.length; i++) {
        // Create new option with corresponding data
        let option = document.createElement('option');

        // assign speedList value to option.value
        option.value = speedList[i];
        option.textContent = speedList[i];

        // Now check the condition
        if (option.value !== optionZero.value) {
            configSpeedSelect.appendChild(option);
        }
    }

    if (optionZero.value !== '0') {
        let optionAuto = document.createElement('option');
        optionAuto.value = 0;
        optionAuto.textContent = 'Auto';

        configSpeedSelect.appendChild(optionAuto);
    }
}

window.onload = getPortInfoFull;