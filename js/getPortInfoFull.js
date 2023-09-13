let connectButton = document.getElementById('connectButton');
let saveButton = document.getElementById('saveButton')
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

saveButton.addEventListener('click', function () {
    setPortConfig(connectIp.value, connectUsername.value, connectPassword.value, connectPort.value)
        .then(() => {
            // this code will be executed once the request has completed successfully
            console.log('Request completed successfully!');
        })
});

async function getPortInfoFull(ip, username, password, port) {
    const response = await fetch('http://5.149.127.105',
        {
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
            }),
            cache: "no-store"
        });

    if (!response.ok) {
        const message = `An error has occurred: ${response.status}`;
        throw new Error(message);
    }

    let data = ''
    data = await response.json();

    const parsedData = data.result;
    let errorMessage = document.getElementById('errorMessage')
    if (parsedData.error) {
        errorMessage.textContent = parsedData.error.data
    }

    console.log(parsedData)
    for (let key in parsedData) {
        let newDiv = document.createElement('div');
        newDiv.className = 'invisibleDiv'
        newDiv.setAttribute('id', key);
        newDiv.innerHTML = ''
        // newDiv.textContent = `${key}: ${JSON.stringify(parsedData[key], null, 2)}`;
        document.body.appendChild(newDiv);
    }

    if (parsedData) {
        // General info
        let ifName = document.getElementById('ifName')
        ifName.textContent = parsedData.ifName
        let ifType = document.getElementById('ifType')
        ifType.textContent = parsedData.ifType
        let ifAbbreviatedName = document.getElementById('ifAbbreviatedName')
        ifAbbreviatedName.textContent = parsedData.ifAbbreviatedName
        let description = document.getElementById('description')
        description.textContent = parsedData.description

        let adminStatus = document.getElementById('adminStatus');
        adminStatus.innerHTML = ''
        let currentAdmStatus = document.createElement('option')
        currentAdmStatus.value = parsedData.adminStatus;
        currentAdmStatus.textContent = parsedData.adminStatus;
        adminStatus.appendChild(currentAdmStatus)

        let statuses = ['AdmUp', 'AdmDown']

        for (let stat of statuses) {
            let option = document.createElement('option',)
            option.value = stat
            option.textContent = stat

            if (option.value !== currentAdmStatus.value) {
                adminStatus.appendChild(option)
            }
        }

        let operStatus = document.getElementById('operStatus')
        operStatus.textContent = ''
        operStatus.textContent = parsedData.operStatus
        let actualDuplex = document.getElementById('actualDuplex')
        actualDuplex.textContent = ''
        actualDuplex.textContent = parsedData.actualDuplex
        let bpduDropAny = document.getElementById('bpduDropAny')
        bpduDropAny.textContent = null
        bpduDropAny.textContent = parsedData.bpduDropAny

        // Speed
        let actualSpeed = document.getElementById('actualSpeed')
        actualSpeed.textContent = null
        actualSpeed.textContent = parsedData.actualSpeed
        let supportedIfSpeed = document.getElementById('supportedIfSpeed')
        supportedIfSpeed.textContent = null
        supportedIfSpeed.textContent = parsedData.supportedIfSpeed.join(', ');

        const speedList = data.result.supportedIfSpeed;
        let configSpeedSelect = document.getElementById('configSpeed');
        configSpeedSelect.innerHTML = ''

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
            optionAuto.value = '0';
            optionAuto.textContent = 'Auto';

            configSpeedSelect.appendChild(optionAuto);
        }

        // Statistics
        let inInterval = document.getElementById('inInterval')
        inInterval.textContent = ''
        inInterval.textContent = parsedData.statistics.interval
        let outInterval = document.getElementById('outInterval')
        outInterval.textContent = ''
        outInterval.textContent = parsedData.statistics.interval
        let inPackets = document.getElementById('inPackets')
        inPackets.textContent = ''
        inPackets.textContent = parsedData.statistics.inPackets
        let outPackets = document.getElementById('outPackets')
        outPackets.textContent = ''
        outPackets.textContent = parsedData.statistics.outPackets
        let inOctets = document.getElementById('inOctets')
        inOctets.textContent = ''
        inOctets.textContent = parsedData.statistics.inOctets
        let inUsage = document.getElementById('inUsage')
        inUsage.textContent = null
        inUsage.textContent = (parseInt(inOctets.textContent) * 8 / parseInt(inInterval.textContent) / parseInt(actualSpeed.textContent)).toFixed(2) + '%'
        let outOctets = document.getElementById('outOctets')
        outOctets.textContent = `${parsedData.statistics.outOctets}`;
        let outUsage = document.getElementById('outUsage')
        outUsage.textContent = null
        outUsage.textContent = (parseInt(outOctets.textContent) * 8 / parseInt(outInterval.textContent) / parseInt(actualSpeed.textContent)).toFixed(2) + '%'
        // let inBits = document.getElementById('inBits')
        // inBits.textContent = `${parsedData.statistics.inBits}`;
        // let outBits = document.getElementById('outBits')
        // outBits.textContent = `${parsedData.statistics.outBits}`;

        // VLAN
        let vlanLinkType = document.getElementById('linkType')
        vlanLinkType.innerHTML = ''
        let currentType = document.createElement('option')
        currentType.value = parsedData.vlan.linkType
        currentType.textContent = parsedData.vlan.linkType
        vlanLinkType.appendChild(currentType)

        let types = ['Trunk', 'Hybrid', 'Access']

        for (let type of types) {
            let option = document.createElement('option')
            option.value = type
            option.textContent = type

            if (option.value !== currentType.value) {
                vlanLinkType.appendChild(option)
            }
        }

        let pvid = document.getElementById('pvid')
        pvid.value = null
        pvid.value = parsedData.vlan.pvid;
        pvid.textContent = ''
        pvid.textContent = parsedData.vlan.pvid;
        let untaggedVlanList = document.getElementById('untaggedVlanList')
        untaggedVlanList.value = null
        untaggedVlanList.value = parsedData.vlan.untaggedVlanList.join(', ');
        untaggedVlanList.textContent = ''
        untaggedVlanList.textContent = parsedData.vlan.untaggedVlanList.join(', ');
        let taggedVlanList = document.getElementById('taggedVlanList')
        taggedVlanList.value = null
        taggedVlanList.value = parsedData.vlan.taggedVlanList.join(', ');
        taggedVlanList.textContent = ''
        taggedVlanList.textContent = parsedData.vlan.taggedVlanList.join(', ');
        let permitVlanList = document.getElementById('permitVlanList')
        permitVlanList.value = null
        permitVlanList.value = parsedData.vlan.permitVlanList.join(', ');
        permitVlanList.textContent = ''
        permitVlanList.textContent = parsedData.vlan.permitVlanList.join(', ');


        // MAC table
        const macTable = data.result.macTable;

        // Get the main container where you want to add your new elements
        let macContent = document.getElementById('macInfo')
        macContent.innerHTML = ''

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
        let broadcastUnit = document.getElementById('broadcastUnit')
        broadcastUnit.innerHTML = ''
        let broadcastCurrentUnit = document.createElement('option')
        broadcastCurrentUnit.value = parsedData.suppression.broadcast.unit
        broadcastCurrentUnit.textContent = parsedData.suppression.broadcast.unit
        broadcastUnit.appendChild(broadcastCurrentUnit)
        let multicastUnit = document.getElementById('multicastUnit')
        multicastUnit.innerHTML = ''
        let multicastCurrentUnit = document.createElement('option')
        multicastCurrentUnit.value = parsedData.suppression.multicast.unit
        multicastCurrentUnit.textContent = parsedData.suppression.multicast.unit
        multicastUnit.appendChild(multicastCurrentUnit)
        let unicastUnit = document.getElementById('unicastUnit')
        unicastUnit.innerHTML = ''
        let unicastCurrentUnit = document.createElement('option')
        unicastCurrentUnit.value = parsedData.suppression.unknownUnicast.unit
        unicastCurrentUnit.textContent = parsedData.suppression.unknownUnicast.unit
        unicastUnit.appendChild(unicastCurrentUnit)

        let units = ['Pps', 'Kbps', 'Ratio']
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

        broadcastUnit.addEventListener("change", function () {
            // Get the selected value
            let selectedValue = this.value;

            // Set the values of other select elements
            multicastUnit.value = selectedValue;
            unicastUnit.value = selectedValue;
        });

        multicastUnit.addEventListener("change", function () {
            // Get the selected value
            let selectedValue = this.value;

            // Set the values of other select elements
            broadcastUnit.value = selectedValue;
            unicastUnit.value = selectedValue;
        });

        unicastUnit.addEventListener("change", function () {
            // Get the selected value
            let selectedValue = this.value;

            // Set the values of other select elements
            multicastUnit.value = selectedValue;
            broadcastUnit.value = selectedValue;
        });

        // ARP filter sources
        let arpFilterSources = document.getElementById('arpSources')
        let sourcesList = parsedData.arpFilter.sources

        for (let i = 0; i < 8; i++) {
            let val = document.getElementById('arpInput' + i.toString())
            val.value = null
            val.textContent = ''
        }

        for (let i = 0; i < sourcesList.length; i++) {
            let inp = document.getElementById('arpInput' + i.toString())
            inp.value = sourcesList[i]
            inp.textContent = sourcesList[i]
        }

        // ACL
        if (parsedData.acl.inbound.length > 0) {
            let inboundAclName = document.getElementById('inboundAclName')
            inboundAclName.textContent = parsedData.acl.inbound[0].name
            let inboundAclType = document.getElementById('inboundAclType')
            inboundAclType.textContent = parsedData.acl.inbound[0].type
            let outboundAclName = document.getElementById('outboundAclName')
            outboundAclName.textContent = parsedData.acl.outbound[0].name
            let outboundAclType = document.getElementById('outboundAclType')
            outboundAclType.textContent = parsedData.acl.outbound[0].type
        } else {
            let inboundAclName = document.getElementById('inboundAclName')
            inboundAclName.textContent = ''
            let inboundAclType = document.getElementById('inboundAclType')
            inboundAclType.textContent = ''
            let outboundAclName = document.getElementById('outboundAclName')
            outboundAclName.textContent = ''
            let outboundAclType = document.getElementById('outboundAclType')
            outboundAclType.textContent = ''
        }
    }
}

async function setPortConfig(ip, username, password, port) {
    // General info
    let description = document.getElementById('description').textContent;
    let adminStatus = document.getElementById('adminStatus').value;

// Speed
    let configSpeed = parseInt(document.getElementById('configSpeed').value);

// VLAN
    let linkType = document.getElementById('linkType').value
    let pvid = parseInt(document.getElementById('pvid').value)
    let taggedVlanList = null
    let taggedVlanListCheck = document.getElementById('taggedVlanList').value.split(', ').map(Number)
    if (taggedVlanListCheck[0] === 0) {
        taggedVlanList = []
    } else {
        taggedVlanList = taggedVlanListCheck
    }

// Suppression
    let broadcastUnit = document.getElementById('broadcastUnit').value
    let broadcastValue = parseInt(document.getElementById('braodcastValue').value)
    let multicastUnit = document.getElementById('multicastUnit').value
    let multicastValue = parseInt(document.getElementById('multicastValue').value)
    let unicastUnit = document.getElementById('unicastUnit').value
    let unicastValue = parseInt(document.getElementById('unicastValue').value)

// ARP filter
    let sources = []

    for (let i = 0; i < 8; i++) {
        let val = document.getElementById('arpInput' + i.toString())
        if (val.value) {
            sources.push(val.value)
        } else {
            break
        }
    }

    const response = await fetch('http://5.149.127.105', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            jsonrpc: '2.0',
            method: 'comware.SetPortConfig',
            params: {
                target: {
                    ip: ip,
                    username: username,
                    password: password
                },
                ifIndex: parseInt(port),
                "config": {
                    "description": description,
                    "adminStatus": adminStatus,
                    "speed": configSpeed,
                    "vlan": {
                        "linkType": linkType,
                        "pvid": pvid,
                        "taggedVlanList": taggedVlanList
                    },
                    "suppression": {
                        "broadcast": {
                            "unit": broadcastUnit,
                            "value": broadcastValue
                        },
                        "multicast": {
                            "unit": multicastUnit,
                            "value": multicastValue
                        },
                        "unknownUnicast": {
                            "unit": unicastUnit,
                            "value": unicastValue
                        }
                    },
                    "bpduDropAny": true,
                    "arpFilter": {
                        "sources": sources
                    }
                }
            },
            id: '38276e9c-018d-498e-95af-ad8c019a000d'
        })
    });

    if (!response.ok) {
        const message = `An error has occurred: ${response.status}`;
        throw new Error(message);
    }

    const data = await response.json();

    if (data) {
        console.log(data)
        if (data?.error?.data?.errors?.config?.arpFilter?.sources[0]) {
            let errorMessage = data.error.data.errors.config.arpFilter.sources[0];
            window.alert(errorMessage);
        }
        if (data?.error?.data?.errors?.config?.suppression?.broadcast?.value[0]) {
            let errorMessage = data.error.data.errors.config.suppression.broadcast.value[0];
            window.alert(errorMessage);
        }
        if (data?.error?.data?.errors?.config?.suppression?.multicast?.value[0]) {
            let errorMessage = data.error.data.errors.config.suppression.multicast.value[0];
            window.alert(errorMessage);
        }
        if (data?.error?.data?.errors?.config?.suppression?.unknownUnicast?.value[0]) {
            let errorMessage = data.error.data.errors.config.suppression.unknownUnicast.value[0];
            window.alert(errorMessage);
        }
        if (data?.error?.data?.errors?.config?.vlan?.pvid[0]) {
            let errorMessage = data.error.data.errors.config.vlan?.pvid[0];
            window.alert(errorMessage);
        }
    }
    await getPortInfoFull(connectIp.value, connectUsername.value, connectPassword.value, connectPort.value)
}


