let connectButton = document.getElementById('connectButton');
let saveButton = document.getElementById('saveButton')
let connectIp = document.getElementById('connectIp');
let connectUsername = document.getElementById('connectUsername');
let connectPassword = document.getElementById('connectPassword');
let connectPort = document.getElementById('connectPort');

async function getPortInfoFull(ip, username, password, port) {
    const loader = document.getElementById('loader-holder')
    loader.style.display = 'flex'

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

    let data = await response.json();
    if (data) {
        loader.style.display = 'none'
    }

    const parsedData = data.result;
    let errorMessage = document.getElementById('errorMessage')
    if (parsedData.error) {
        errorMessage.textContent = parsedData.error.data
    }

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
        // let inOctets = document.getElementById('inOctets')
        // inOctets.textContent = ''
        // inOctets.textContent = parsedData.statistics.inOctets
        let inBits = document.getElementById('inBits')
        inBits.textContent = ''
        inBits.textContent = parsedData.statistics.inBits
        let inUsage = document.getElementById('inUsage')
        inUsage.textContent = null
        inUsage.textContent = (parseInt(inBits.textContent) / parseInt(inInterval.textContent) / (parseInt(actualSpeed.textContent) * 1000)).toFixed(3) + '%'
        // let outOctets = document.getElementById('outOctets')
        // outOctets.textContent = ''
        // outOctets.textContent = parsedData.statistics.outOctets
        let outBits = document.getElementById('outBits')
        outBits.textContent = ''
        outBits.textContent = parsedData.statistics.outBits
        let outUsage = document.getElementById('outUsage')
        outUsage.textContent = null
        outUsage.textContent = (parseInt(outBits.textContent) / parseInt(outInterval.textContent) / (parseInt(actualSpeed.textContent) * 1000)).toFixed(3) + '%'

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

        switch (vlanLinkType.value) {
            case 'Hybrid': {
                let unRow = document.getElementById('untaggedVlans')
                unRow.innerHTML = ''
                let unLabel = document.createElement('div')
                unLabel.className = 'card card-outline bg-primary'
                unLabel.textContent = 'Untagged VLANs'
                let unVlan = document.createElement('input')
                unVlan.className = 'card card-outline card-danger'
                unVlan.id = 'untaggedVlanList'
                unRow.appendChild(unLabel)
                unRow.appendChild(unVlan)
                let tRow = document.getElementById('taggedVlans')
                tRow.innerHTML = ''
                let tLabel = document.createElement('div')
                tLabel.className = 'card card-outline bg-primary'
                tLabel.textContent = 'Tagged VLANs'
                tRow.appendChild(tLabel)
                break;
            }
            case 'Trunk': {
                let unRow = document.getElementById('untaggedVlans')
                unRow.innerHTML = ''
                let label = document.createElement('div')
                label.className = 'card card-outline bg-primary'
                label.textContent = 'Untagged VLANs'
                let unvLan = document.createElement('div')
                unvLan.className = 'card card-outline card-danger uneditable'
                unvLan.id = 'untaggedVlanList'
                unRow.appendChild(label)
                unRow.appendChild(unvLan)
                let tRow = document.getElementById('taggedVlans')
                tRow.innerHTML = ''
                let tLabel = document.createElement('div')
                tLabel.className = 'card card-outline bg-primary'
                tLabel.textContent = 'Tagged VLANs'
                tRow.appendChild(tLabel)
                break;
            }
            case 'Access': {
                let unRow = document.getElementById('untaggedVlans')
                unRow.innerHTML = ''
                let label = document.createElement('div')
                label.className = 'card card-outline bg-primary'
                label.textContent = 'Untagged VLANs'
                let unvLan = document.createElement('div')
                unvLan.className = 'card card-outline card-danger uneditable'
                unvLan.id = 'untaggedVlanList'
                unRow.appendChild(label)
                unRow.appendChild(unvLan)
                let tRow = document.getElementById('taggedVlans')
                tRow.innerHTML = ''
                let tLabel = document.createElement('div')
                tLabel.className = 'card card-outline bg-primary'
                tLabel.textContent = 'Tagged VLANs'
                tRow.appendChild(tLabel)
                break;
            }
        }

        let untaggedVlanList = document.getElementById('untaggedVlanList')
        untaggedVlanList.value = null
        untaggedVlanList.value = parsedData.vlan.untaggedVlanList.join(', ');
        untaggedVlanList.textContent = ''
        untaggedVlanList.textContent = parsedData.vlan.untaggedVlanList.join(', ');

        let taggedVlanList = document.getElementById('taggedVlans')
        taggedVlanList.value = parsedData.vlan.taggedVlanList;
        for (tVlan of taggedVlanList.value) {
            let input = document.createElement('div')
            input.className = "taggedVlanItem card card-outline card-danger uneditable deletable"
            input.value = tVlan
            input.textContent = tVlan
            taggedVlanList.appendChild(input)

            // On mouse over, change the text to 'Remove'
            input.addEventListener('mouseover', function() {
                this.textContent = 'Remove';
            });

            // On mouse out, change the text back to the original value
            input.addEventListener('mouseout', function() {
                this.textContent = this.value;
            });

            // On click, remove the div
            input.addEventListener('click', function() {
                this.parentElement.removeChild(this);
            });
        }
        let addTaggedVlan = document.createElement('button')
        addTaggedVlan.className = 'card taggedVlanItem addVlan'
        addTaggedVlan.id = 'addtaggedVlan'
        addTaggedVlan.textContent = '+ Add'
        addTaggedVlan.onclick = addTaggedVlanHandler
        taggedVlanList.insertBefore(addTaggedVlan, taggedVlanList.children[1])
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

        let legend = document.createElement('legend')
        legend.className = 'scheduler-border invisibleDiv'
        legend.textContent = 'S'

        macContent.appendChild(legend);

        // Iterate over 'macTable' to create new elements for each object
        for (let i = 0; i < macTable.length; i++) {
            // Create new elements with corresponding data
            let row = document.createElement('div');
            row.className = "row statRow";
            row.innerHTML = '';

            let vlanCard = document.createElement('label');
            vlanCard.className = "scheduler-border";
            vlanCard.for = "vlan" + macTable[i].vlan;
            vlanCard.textContent = macTable[i].vlan;

            let macCard = document.createElement('div');
            macCard.className = "statRight aclInfo";
            macCard.id = "vlan" + macTable[i].vlan;
            macCard.textContent = macTable[i].mac;

            let plug = document.createElement('div')
            plug.className = 'plug'



            // Append new elements to the row
            row.appendChild(vlanCard);
            row.appendChild(plug);
            row.appendChild(macCard);

            // Append the row to the main-content div
            macContent.appendChild(row);
        }

        // Suppression
        let broadcastValue = document.getElementById('broadcastValue')
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

        // ARP filter sources
        let arpFilterSources = document.getElementById('arpSources')
        arpFilterSources.innerHTML = ''

        let arpLegend = document.createElement('legend')
        arpLegend.className = 'scheduler-border'
        arpLegend.textContent = 'Sources'
        arpFilterSources.appendChild(arpLegend)

        let sourcesList = parsedData.arpFilter.sources

        for (let i = 0; i < sourcesList.length; i++) {
            let arpRow = document.createElement('div')
            arpRow.className = 'row statRow'

            let arpLabel = document.createElement('label')
            arpLabel.className = 'scheduler-border arpLeft'
            let arpPlug = document.createElement('div')
            arpPlug.className = 'plug'
            let arpIp = document.createElement('div')
            arpIp.className = 'statRight arpRight'
            arpIp.id = 'arpInput' + i.toString()
            arpIp.textContent = sourcesList[i]

            arpRow.appendChild(arpLabel)
            arpRow.appendChild(arpPlug)
            arpRow.appendChild(arpIp)

            arpFilterSources.appendChild(arpRow)
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
    adjustWidth()
}

async function setPortConfig(ip, username, password, port) {
    const loader = document.getElementById('loader-holder')
    loader.style.display = 'flex'
    // General info
    let description = document.getElementById('description').textContent;
    let adminStatus = document.getElementById('adminStatus').value;

// Speed
    let configSpeed = parseInt(document.getElementById('configSpeed').value);

// VLAN
    let linkType = document.getElementById('linkType').value
    let pvid = parseInt(document.getElementById('pvid').value)
    let taggedVlanList = []
    let taggedVlanItems = document.getElementsByClassName('taggedVlanItem')
    for (vlan of taggedVlanItems) {
        if (vlan.value) {
            taggedVlanList.push(parseInt(vlan.value))
        }
    }


// Suppression
    let broadcastUnit = document.getElementById('broadcastUnit').value
    let broadcastValue = parseInt(document.getElementById('broadcastValue').value)
    if (!suppressionRange(broadcastUnit, broadcastValue, 'Broadcast')) {
        return
    }
    let multicastUnit = document.getElementById('multicastUnit').value
    let multicastValue = parseInt(document.getElementById('multicastValue').value)
    if (!suppressionRange(multicastUnit, multicastValue, 'Multicast')) {
        return
    }
    let unicastUnit = document.getElementById('unicastUnit').value
    let unicastValue = parseInt(document.getElementById('unicastValue').value)
    if (!suppressionRange(unicastUnit, unicastValue, 'Unicast')) {
        return
    }


// ARP filter
    let sources = []

    for (let i = 0; i < 8; i++) {
        let val = document.getElementById('arpInput' + i.toString())
        if (val) {
            if (isValidIP(val.value)) {
                sources.push(val.value)
            } else {
                window.alert("Invalid IP address")
                return;
            }
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
        if (data.error) {
            window.alert('Please set the link type of the port to access first.')
        }
    }
    await getPortInfoFull(connectIp.value, connectUsername.value, connectPassword.value, connectPort.value)
}

function isValidIP(ipaddress) {
    // Regular expression for IP validation
    let ipformat = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

    return !!ipaddress.match(ipformat);


}

function suppressionRange(unit, value, type) {
    switch (unit) {
        case 'Pps':
            if (value < 0 || value > 14881000) {
                window.alert(type + " value must be in 0 - 14881000 range inclusive")
                return false;
            }
            break;
        case 'Kbps':
            if (value < 0 || value > 10000000) {
                window.alert(type + " value must be in 0 - 10000000 range inclusive")
                return false;
            }
            break;
        case 'Ratio':
            if (value < 0 || value > 100) {
                window.alert(type + " value must be in 0 - 100 range inclusive")
                return false;
            }
            break;
    }
    return true
}

function addTaggedVlanHandler() {
    let parentElement = document.getElementById('taggedVlans');
    let taggedVlanItem = document.createElement('input');
    taggedVlanItem.className = 'taggedVlanItem card card-outline card-danger';
    let button = document.getElementById('addTaggedVlanButton')

    // insert new element right before the add button
    parentElement.appendChild(taggedVlanItem);
}