let connectButton = document.getElementById('connectButton');
let connectIp = document.getElementById('connectIp');
let connectUsername = document.getElementById('connectUsername');
let connectPassword = document.getElementById('connectPassword');
let connectPort = document.getElementById('connectPort');

connectButton.addEventListener('click', function () {
    getPortInfoFull(connectIp.value, connectUsername.value, connectPassword.value, connectPort.value)
        .then(() => {
            // this code will be executed once the request has completed successfully
            console.log('Request completed successfully!');
        })
});

async function getPortInfoFull(ip, username, password, port) {
    let data = null
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
                    ip: ip,
                    username: username,
                    password: password
                },
                ifIndex: parseInt(port)
            },
            id: '38276e9c-018d-498e-95af-ad8c019a000d'
        })
    });

    if (!response.ok) {
        const message = `An error has occurred: ${response.status}`;
        throw new Error(message);
    }

    data = await response.json();
    console.log(data)

    const parsedData = data.result;
    for (let key in parsedData) {
        let newDiv = document.createElement('div');
        newDiv.setAttribute('id', key);
        newDiv.textContent = `${key}: ${JSON.stringify(parsedData[key], null, 2)}`;
        document.body.appendChild(newDiv);
    }

    if (parsedData) {
        // General info
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

        // Speed
        let actualSpeed = document.getElementById('actualSpeed')
        actualSpeed.textContent = `${parsedData.actualSpeed}`
        let supportedIfSpeed = document.getElementById('supportedIfSpeed')
        supportedIfSpeed.textContent = parsedData.supportedIfSpeed.join(', ');

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

        // Statistics
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

        // VLAN
        let currentType = document.getElementById('currentType')
        currentType.value = parsedData.vlan.linkType
        currentType.textContent = parsedData.vlan.linkType
        let pvid = document.getElementById('pvid')
        pvid.value = parsedData.vlan.pvid;
        let untaggedVlanList = document.getElementById('untaggedVlanList')
        untaggedVlanList.value = parsedData.vlan.untaggedVlanList.join(', ');
        let taggedVlanList = document.getElementById('taggedVlanList')
        taggedVlanList.value = parsedData.vlan.taggedVlanList.join(', ');
        let permitVlanList = document.getElementById('permitVlanList')
        permitVlanList.value = parsedData.vlan.permitVlanList.join(', ');

        let types = ['Trunk', 'Hybrid', 'Access']
        let typeSelect = document.getElementById('linkType')

        for (let type of types) {
            let option = document.createElement('option')

            option.value = type
            option.textContent = type

            if (option.value !== currentType.value) {
                typeSelect.appendChild(option)
            }
        }


        // MAC table
        const macTable = data.result.macTable;

        // Get the main container where you want to add your new elements
        let macContent = document.querySelector('.mac-content');

        // Iterate over 'macTable' to create new elements for each object
        for (let i = 0; i < macTable.length; i++) {
            // Create new elements with corresponding data
            let row = document.createElement('div');
            row.className = "row";
            row.innerHTML = '';

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

        // Suppression
        let broadcastValue = document.getElementById('braodcastValue')
        broadcastValue.value = parsedData.suppression.broadcast.configValue
        broadcastValue.textContent = parsedData.suppression.broadcast.configValue
        let multicastValue = document.getElementById('multicastValue')
        multicastValue.value = parsedData.suppression.multicast.configValue
        multicastValue.textContent = parsedData.suppression.multicast.configValue
        let unicastValue = document.getElementById('unicastValue')
        unicastValue.value = parsedData.suppression.unknownUnicast.configValue
        unicastValue.textContent = parsedData.suppression.unknownUnicast.configValue
        let broadcastUnit = document.getElementById('broadcastCurrentUnit')
        broadcastUnit.value = parsedData.suppression.broadcast.unit
        broadcastUnit.textContent = parsedData.suppression.broadcast.unit
        let multicastUnit = document.getElementById('multicastCurrentUnit')
        multicastUnit.value = parsedData.suppression.multicast.unit
        multicastUnit.textContent = parsedData.suppression.multicast.unit
        let unicastUnit = document.getElementById('unicastCurrentUnit')
        unicastUnit.value = parsedData.suppression.unknownUnicast.unit
        unicastUnit.textContent = parsedData.suppression.unknownUnicast.unit

        let units = ['Pps', 'Kbps', 'Rate']
        let broadcastSelect = document.getElementById('broadcastUnit')
        let multicastSelect = document.getElementById('multicastUnit')
        let unicastSelect = document.getElementById('unicastUnit')

        for (let unit of units) {
            let option = document.createElement('option')

            option.value = unit
            option.textContent = unit

            if (option.value !== broadcastUnit.value) {
                broadcastSelect.appendChild(option)
            }
        }

        for (let unit of units) {
            let option = document.createElement('option')

            option.value = unit
            option.textContent = unit

            if (option.value !== multicastSelect.value) {
                multicastSelect.appendChild(option)
            }
        }

        for (let unit of units) {
            let option = document.createElement('option')

            option.value = unit
            option.textContent = unit

            if (option.value !== unicastSelect.value) {
                unicastSelect.appendChild(option)
            }
        }

        // ARP filter sources
        let arpFilterSources = document.getElementById('arpFilterSources')
        arpFilterSources.value = parsedData.arpFilter.sources.join('\n');

        const textarea = document.getElementById('arpFilterSources');

        autosize(textarea);

        textarea.addEventListener('input', function () {
            autosize(this);
        });

        function autosize(textarea) {
            // Reset the textarea height in case its content has been deleted
            textarea.style.height = 'auto';
            // Set the textarea height to match its scroll height
            textarea.style.height = textarea.scrollHeight + 'px';
        }

        // ACL
        let inboundAclName = document.getElementById('inboundAclName')
        inboundAclName.textContent = parsedData.acl.inbound[0].name
        let inboundAclType = document.getElementById('inboundAclType')
        inboundAclType.textContent = parsedData.acl.inbound[0].type
        let outboundAclName = document.getElementById('outboundAclName')
        outboundAclName.textContent = parsedData.acl.outbound[0].name
        let outboundAclType = document.getElementById('outboundAclType')
        outboundAclType.textContent = parsedData.acl.outbound[0].type

    }
}