let connectButton = document.getElementById('connectButton');
let saveButton = document.getElementById('saveButton')
let connectIp = document.getElementById('connectIp');
let connectUsername = document.getElementById('connectUsername');
let connectPassword = document.getElementById('connectPassword');
let connectPort = document.getElementById('connectPort');

async function getPortInfoFull(ip, username, password, port) {
    // const loader = document.getElementById('loader-holder')
    // loader.style.display = 'flex'

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
        // loader.style.display = 'none'
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
        currentAdmStatus.style.backgroundColor = 'white'
        currentAdmStatus.style.color = 'black'

        if (currentAdmStatus.value === 'AdmUp') {
            adminStatus.style.borderColor = 'green'
            adminStatus.style.backgroundColor = 'green'
            adminStatus.style.color = 'white'
        } else {
            adminStatus.style.borderColor = 'red'
            adminStatus.style.backgroundColor = 'red'
        }
        adminStatus.appendChild(currentAdmStatus)

        let statuses = ['AdmUp', 'AdmDown']

        for (let stat of statuses) {
            let option = document.createElement('option')
            option.value = stat
            option.textContent = stat
            option.style.backgroundColor = 'white'
            option.style.color = 'black'


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
        let bpduOption = document.createElement('option')
        let notBpduOption = document.createElement('option')
        bpduOption.textContent = null
        bpduOption.textContent = parsedData.bpduDropAny

        if (bpduOption.textContent === 'true') {
            notBpduOption.textContent = 'false'
        } else {
            notBpduOption.textContent = 'true'
        }

        bpduDropAny.appendChild(bpduOption)
        bpduDropAny.appendChild(notBpduOption)

        // Speed
        let actualSpeed = document.getElementById('actualSpeed')
        actualSpeed.textContent = null
        actualSpeed.textContent = parsedData.actualSpeed

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
                let unLabel = document.createElement('label')
                unLabel.className = 'scheduler-border vlanLeft'
                unLabel.for = 'untaggedVlanList'
                unLabel.textContent = 'Untagged VLANs'
                let unVlan = document.createElement('input')
                unVlan.className = 'statRight vlanRight'
                unVlan.id = 'untaggedVlanList'
                unRow.appendChild(unLabel)
                unRow.appendChild(unVlan)
                let tRow = document.getElementById('taggedLabelButton')
                tRow.innerHTML = ''
                let tLabel = document.createElement('label')
                tLabel.className = 'scheduler-border vlanLeft'
                tLabel.textContent = 'Tagged VLANs: '
                tRow.appendChild(tLabel)
                break;
            }
            case 'Trunk': {
                let unRowTrunck = document.getElementById('untaggedVlans')
                unRowTrunck.innerHTML = ''
                let label = document.createElement('label')
                label.className = 'scheduler-border vlanLeft'
                label.textContent = 'Untagged VLANs: '
                let unvLan = document.createElement('div')
                unvLan.className = 'statRight vlanRight'
                unvLan.id = 'untaggedVlanList'
                unRowTrunck.appendChild(label)
                unRowTrunck.appendChild(unvLan)
                let tRow = document.getElementById('taggedLabelButton')
                tRow.innerHTML = ''
                let tLabel = document.createElement('label')
                tLabel.className = 'scheduler-border vlanLeft'
                tLabel.textContent = 'Tagged VLANs: '
                tRow.appendChild(tLabel)
                break;
            }
            case 'Access': {
                let unRowAccess = document.getElementById('untaggedVlans')
                unRowAccess.innerHTML = ''
                let label = document.createElement('label')
                label.className = 'scheduler-border vlanLeft'
                label.textContent = 'Untagged VLANs: '
                let unvLan = document.createElement('div')
                unvLan.className = 'statRight vlanRight'
                unvLan.id = 'untaggedVlanList'
                unRowAccess.appendChild(label)
                unRowAccess.appendChild(unvLan)
                let tRow = document.getElementById('taggedLabelButton')
                tRow.innerHTML = ''
                let tLabel = document.createElement('label')
                tLabel.className = 'scheduler-border vlanLeft'
                tLabel.textContent = 'Tagged VLANs: '
                tRow.appendChild(tLabel)
                break;
            }
        }

        let untaggedVlanList = document.getElementById('untaggedVlanList')
        untaggedVlanList.value = null
        untaggedVlanList.value = parsedData.vlan.untaggedVlanList.join(', ');
        untaggedVlanList.textContent = ''
        untaggedVlanList.textContent = parsedData.vlan.untaggedVlanList.join(', ');

        let taggedVlanList = document.getElementById('taggedVlanItems')
        taggedVlanList.value = parsedData.vlan.taggedVlanList;

        for (let tVlan of taggedVlanList.value) {
            let input = document.createElement('div')
            input.className = "statRight vlanItem"
            input.value = tVlan
            input.textContent = tVlan
            taggedVlanList.appendChild(input)

            // On mouse over, change the text to 'Remove'
            input.addEventListener('mouseover', function () {
                this.textContent = 'Remove';
            });

            // On mouse out, change the text back to the original value
            input.addEventListener('mouseout', function () {
                this.textContent = this.value;
            });

            // On click, remove the div
            input.addEventListener('click', function () {
                this.parentElement.removeChild(this);
            });
        }

        let taggedLabelButton = document.getElementById('taggedLabelButton')
        let addTaggedVlan = document.createElement('button')
        addTaggedVlan.className = 'statRight vlanRight arpAddButton'
        addTaggedVlan.id = 'addtaggedVlan'
        addTaggedVlan.textContent = '+ Add'
        // addTaggedVlan.addEventListener("click", function (event) {
        //     addTaggedVlanHandler(event)
        // })
        addTaggedVlan.onclick = addTaggedVlanHandler
        taggedLabelButton.appendChild(addTaggedVlan)

        let permitVlanList = document.getElementById('permitVlanList')
        permitVlanList.value = null
        permitVlanList.value = parsedData.vlan.permitVlanList.join(', ');
        permitVlanList.textContent = ''
        permitVlanList.textContent = parsedData.vlan.permitVlanList.join(', ');


        // MAC table
        const macTable = data.result.macTable;

        // Get the main container where you want to add your new elements
        let macContent = document.getElementById('mac-row')
        macContent.innerHTML = ''

        let headersRow = document.createElement('tr')
        let headersVlan = document.createElement('th')
        headersVlan.textContent = 'VLAN'
        let headersMac = document.createElement('th')
        headersMac.textContent = 'MAC'
        headersRow.appendChild(headersVlan)
        headersRow.appendChild(headersMac)

        macContent.appendChild(headersRow)

        // Iterate over 'macTable' to create new elements for each object
        for (let i = 0; i < macTable.length; i++) {
            // Create new elements with corresponding data
            let row = document.createElement('tr');
            row.className = 'macTr'
            if (i % 2 !== 0) {
                row.style.backgroundColor = 'darkgray'
            }

            let vlanCard = document.createElement('td');
            vlanCard.textContent = 'VLAN ' + macTable[i].vlan;

            let macCard = document.createElement('td');
            macCard.textContent = macTable[i].mac;

            // Append new elements to the row
            row.appendChild(vlanCard);
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

        let sourcesList = parsedData.arpFilter.sources

        let arpLegend = document.createElement('legend')
        arpLegend.className = 'scheduler-border'
        arpLegend.textContent = 'SOURCES'

        let arpAddRow = document.createElement('div')
        arpAddRow.className = 'row statRow'

        let arpAddLabel = document.createElement('label')
        arpAddLabel.className = 'scheduler-border arpLeft'

        let arpAddButton = document.createElement('button')
        arpAddButton.className = 'statRight arpRight arpAddButton'
        arpAddButton.id = 'arpAddButton'
        arpAddButton.textContent = '+ Add'
        if (sourcesList.length === 0) {
            arpAddButton.style.width = '160px'
        }
        arpAddButton.addEventListener("click", function (event) {
            if (arpFilterSources.children.length < 10) {
                arpAddHandler(event)
            } else {
                event.preventDefault();
                alert("Maximum number of elements reached.");
            }
        })

        arpFilterSources.appendChild(arpLegend)
        arpAddRow.appendChild(arpAddLabel)
        arpAddRow.appendChild(arpAddButton)
        arpFilterSources.appendChild(arpAddRow)

        for (let i = 0; i < sourcesList.length; i++) {
            let arpRow = document.createElement('div')
            arpRow.className = 'row statRow'

            let arpLabel = document.createElement('label')
            arpLabel.className = 'scheduler-border arpLeft'
            let arpIp = document.createElement('div')
            arpIp.className = 'statRight arpRight arpIp'
            arpIp.value = sourcesList[i]
            arpIp.textContent = sourcesList[i]

            // On mouse over, change the text to 'Remove'
            arpIp.addEventListener('mouseover', function () {
                this.textContent = 'Remove';
            });

            // On mouse out, change the text back to the original value
            arpIp.addEventListener('mouseout', function () {
                this.textContent = this.value;
            });

            // On click, remove the div
            arpIp.addEventListener('click', function () {
                this.parentElement.removeChild(this);
            });

            arpRow.appendChild(arpLabel)
            arpRow.appendChild(arpIp)

            arpFilterSources.appendChild(arpRow)
        }

        // ACL
        if (parsedData.acl.inbound.length > 0) {
            console.log(parsedData.acl)
            let inboundIpv4 = document.getElementById('inboundIpv4')
            inboundIpv4.textContent = ''
            let inboundIpv6 = document.getElementById('inboundIpv6')
            inboundIpv6.textContent = ''
            let inboundMac = document.getElementById('inboundMac')
            inboundMac.textContent = ''

            for (let inbound of parsedData.acl.inbound) {
                if (inbound.type === 'IPv4') {
                    inboundIpv4.textContent = inbound.name
                }
                if (inbound.type === 'IPv6') {
                    inboundIpv6.textContent = inbound.name
                }
                if (inbound.type === 'MAC') {
                    inboundMac.textContent = inbound.name
                }
            }
        }

        if (parsedData.acl.outbound.length > 0) {
            let outboundIpv4 = document.getElementById('outboundIpv4')
            outboundIpv4.textContent = ''
            let outboundIpv6 = document.getElementById('outboundIpv6')
            outboundIpv6.textContent = ''
            let outboundMac = document.getElementById('outboundMac')
            outboundMac.textContent = ''

            for (let outbound of parsedData.acl.outbound) {
                if (outbound.type === 'IPv4') {
                    outboundIpv4.textContent = outbound.name
                }
                if (outbound.type === 'IPv6') {
                    outboundIpv6.textContent = outbound.name
                }
                if (outbound.type === 'MAC') {
                    outboundMac.textContent = outbound.name
                }
            }
        }
    }
    adjustWidth()
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
    let taggedVlanList = []
    if (linkType === 'Access') {
        taggedVlanList = null
    } else {
        let taggedVlanItems = document.getElementsByClassName('taggedVlanItem')
        for (vlan of taggedVlanItems) {
            if (vlan.value) {
                taggedVlanList.push(parseInt(vlan.value))
            }
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

    let values = document.getElementsByClassName('arpIp')
    for (let val of values) {
        if (isValidIP(val.value)) {
            sources.push(val.value)
        } else {
            window.alert("Invalid IP address: " + val.value)
            return;
        }
    }

    const loader = document.getElementById('loader-holder')
    loader.style.display = 'flex'
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

function addTaggedVlanHandler(event) {
    event.preventDefault()
    let parentElement = document.getElementById('taggedVlanItems');
    let taggedVlanItem = document.createElement('input');
    taggedVlanItem.className = 'statRight vlanItem';
    taggedVlanItem.style.width = '60px'

    // insert new element right before the add button
    parentElement.appendChild(taggedVlanItem);
}

function arpAddHandler(event) {
    event.preventDefault()
    let parentElement = document.getElementById('arpSources');
    let arpAddNewRow = document.createElement('div')
    arpAddNewRow.className = 'row statRow'

    let arpAddLabel = document.createElement('label')
    arpAddLabel.className = 'scheduler-border arpLeft'

    let arpAddIp = document.createElement('input')
    arpAddIp.className = 'statRight arpRight arpIp'

    arpAddNewRow.appendChild(arpAddLabel)
    arpAddNewRow.appendChild(arpAddIp)
    parentElement.appendChild(arpAddNewRow)
    adjustWidth()
}