let connectButton = document.getElementById('connectButton');
let saveButton = document.getElementById('saveButton')
let connectIp = document.getElementById('connectIp');
let connectUsername = document.getElementById('connectUsername');
let connectPassword = document.getElementById('connectPassword');
let connectPort = document.getElementById('connectPort');
let backupData = {}

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
        currentAdmStatus.id = 'currentAdmStatus';
        currentAdmStatus.value = parsedData.adminStatus;
        currentAdmStatus.textContent = parsedData.adminStatus;
        currentAdmStatus.style.backgroundColor = 'white'
        currentAdmStatus.style.color = 'black'

        if (currentAdmStatus.value === 'AdmUp') {
            adminStatus.style.color = 'green'
            adminStatus.style.borderColor = 'green'
        } else {
            adminStatus.style.color = 'red'
            adminStatus.style.borderColor = 'red'
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
        operStatus.value = parsedData.operStatus
        let actualDuplex = document.getElementById('actualDuplex')
        actualDuplex.textContent = ''
        actualDuplex.textContent = parsedData.actualDuplex
        if (actualDuplex.textContent === 'Full') {
            actualDuplex.style.color = 'green'
            actualDuplex.style.borderColor = 'green'
        } else {
            actualDuplex.style.color = 'red'
            actualDuplex.style.borderColor = 'red'
        }
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
        inInterval.textContent = 'Interval: ' + parsedData.statistics.interval + ' seconds'
        inInterval.value = parsedData.statistics.interval
        // let outInterval = document.getElementById('outInterval')
        // outInterval.textContent = ''
        // outInterval.textContent = parsedData.statistics.interval
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
        inUsage.textContent = (parseInt(inBits.textContent) / parseInt(inInterval.value) / (parseInt(actualSpeed.textContent) * 1000)).toFixed(3) + '%'
        // let outOctets = document.getElementById('outOctets')
        // outOctets.textContent = ''
        // outOctets.textContent = parsedData.statistics.outOctets
        let outBits = document.getElementById('outBits')
        outBits.textContent = ''
        outBits.textContent = parsedData.statistics.outBits
        let outUsage = document.getElementById('outUsage')
        outUsage.textContent = null
        outUsage.textContent = (parseInt(outBits.textContent) / parseInt(inInterval.value) / (parseInt(actualSpeed.textContent) * 1000)).toFixed(3) + '%'

        // VLAN
        linkTypeLayout(parsedData.vlan.linkType, parsedData)

        // MAC table
        const macTable = data.result.macTable;

        // Get the main container where you want to add your new elements
        let macContent = document.getElementById('mac-row')
        macContent.innerHTML = ''

        // Iterate over 'macTable' to create new elements for each object
        for (let i = 0; i < macTable.length; i++) {
            // Create new elements with corresponding data
            let row = document.createElement('tr');

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

        let units = ['Pps', 'Kbps', 'Ratio']
        let broadcastSelect = document.getElementById('broadcastUnit')
        // let multicastSelect = document.getElementById('multicastUnit')
        // let unicastSelect = document.getElementById('unicastUnit')

        for (let unit of units) {
            let option = document.createElement('option')

            option.value = unit
            option.textContent = unit

            if (option.value !== broadcastUnit.value) {
                broadcastSelect.appendChild(option)
            }
        }

        let bpduSwitch = document.getElementById('bpduSwitch')
        bpduSwitch.setAttribute('checked', parsedData.bpduDropAny)

        // ARP filter sources
        let sourcesList = parsedData.arpFilter.sources

        for (let i = 0; i < 8; i++) {
            let source = document.getElementById('arpSource-' + i.toString())
            source.value = null
            source.textContent = ''

            if (sourcesList[i]) {
                source.value = sourcesList[i]
                source.textContent = sourcesList[i]
            }
        }

        // ACL
        if (parsedData.acl.inbound.length > 0) {
            let inboundACL = document.getElementById('inboundACL')
            inboundACL.innerHTML = ''

            for (let inbound of parsedData.acl.inbound) {
                if (inbound.type === 'IPv4') {
                    let row = document.createElement('tr')
                    let inboundIpv4Header = document.createElement('td')
                    inboundIpv4Header.textContent = 'IPv4'
                    let inboundIpv4Value = document.createElement('td')
                    inboundIpv4Value.textContent = inbound.name
                    row.appendChild(inboundIpv4Header)
                    row.appendChild(inboundIpv4Value)
                    inboundACL.appendChild(row)
                }
                if (inbound.type === 'IPv6') {
                    let row = document.createElement('tr')
                    let inboundIpv6Header = document.createElement('td')
                    inboundIpv6Header.textContent = 'IPv6'
                    let inboundIpv6Value = document.createElement('td')
                    inboundIpv6Value.textContent = inbound.name
                    row.appendChild(inboundIpv6Header)
                    row.appendChild(inboundIpv6Value)
                    inboundACL.appendChild(row)
                }
                if (inbound.type === 'MAC') {
                    let row = document.createElement('tr')
                    let inboundMacHeader = document.createElement('td')
                    inboundMacHeader.textContent = 'MAC'
                    let inboundMacValue = document.createElement('td')
                    inboundMacValue.textContent = inbound.name
                    row.appendChild(inboundMacHeader)
                    row.appendChild(inboundMacValue)
                    inboundACL.appendChild(row)
                }
            }
        }

        if (parsedData.acl.outbound.length > 0) {
            let outboundACL = document.getElementById('outboundACL')
            outboundACL.innerHTML = ''

            for (let outbound of parsedData.acl.outbound) {
                if (outbound.type === 'IPv4') {
                    let row = document.createElement('tr')
                    let outboundIpv4Header = document.createElement('td')
                    outboundIpv4Header.textContent = 'IPv4'
                    let outboundIpv4Value = document.createElement('td')
                    outboundIpv4Value.textContent = outbound.name
                    row.appendChild(outboundIpv4Header)
                    row.appendChild(outboundIpv4Value)
                    outboundACL.appendChild(row)
                }
                if (outbound.type === 'IPv6') {
                    let row = document.createElement('tr')
                    let outboundIpv6Header = document.createElement('td')
                    outboundIpv6Header.textContent = 'IPv6'
                    let outboundIpv6Value = document.createElement('td')
                    outboundIpv6Value.textContent = outbound.name
                    row.appendChild(outboundIpv6Header)
                    row.appendChild(outboundIpv6Value)
                    outboundACL.appendChild(row)
                }
                if (outbound.type === 'MAC') {
                    let row = document.createElement('tr')
                    let outboundMacHeader = document.createElement('td')
                    outboundMacHeader.textContent = 'MAC'
                    let outboundMacValue = document.createElement('td')
                    outboundMacValue.textContent = outbound.name
                    row.appendChild(outboundMacHeader)
                    row.appendChild(outboundMacValue)
                    outboundACL.appendChild(row)
                }
            }
        }
    }
    backupData = backupFormData()

}

//setPortConfig

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
        let taggedVlanItems = document.getElementsByClassName('taggedVlan')
        for (let vlan of taggedVlanItems) {
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
    let multicastUnit = document.getElementById('broadcastUnit').value
    let multicastValue = parseInt(document.getElementById('multicastValue').value)
    if (!suppressionRange(multicastUnit, multicastValue, 'Multicast')) {
        return
    }
    let unicastUnit = document.getElementById('broadcastUnit').value
    let unicastValue = parseInt(document.getElementById('unicastValue').value)
    if (!suppressionRange(unicastUnit, unicastValue, 'Unicast')) {
        return
    }
    let bpduSwitch = document.getElementById('bpduSwitch')


// ARP filter
    let sources = []

    let values = document.getElementsByClassName('arpIp')
    for (let val of values) {
        if (val.textContent) {
            if (isValidIP(val.value)) {
                sources.push(val.value)
            } else {
                window.alert("Invalid IP address: " + val.value)
                return;
            }
        } else {
            break;
        }

    }

    // const loader = document.getElementById('loader-holder')
    // loader.style.display = 'flex'
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
                    "bpduDropAny": bpduSwitch.checked,
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
            window.alert(data.error)
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

function addTaggedVlanHandler(type) {
    let parentElement = document.getElementById(type);
    let taggedVlanItem = document.createElement('input');
    taggedVlanItem.className = 'form-control taggedVlan';
    taggedVlanItem.type = 'text'

    // insert new element right before the add button
    parentElement.appendChild(taggedVlanItem);
}

function backupFormData() {
    let data = {};
    data.adminStatus = document.getElementById('adminStatus').value
    data.bpduDropAny = document.getElementById('bpduDropAny').value
    data.configSpeed = document.getElementById('configSpeed').value
    data.broadcastUnit = document.getElementById('broadcastUnit').value
    data.broadcastValue = document.getElementById('broadcastValue').value
    data.multicastValue = document.getElementById('multicastValue').value
    data.unicastValue = document.getElementById('unicastValue').value
    data.sourcesOne = document.getElementById('arpSource-0').value
    data.sourcesTwo = document.getElementById('arpSource-1').value
    data.sourcesThree = document.getElementById('arpSource-2').value
    data.sourcesFour = document.getElementById('arpSource-3').value
    data.sourcesFive = document.getElementById('arpSource-4').value
    data.sourcesSix = document.getElementById('arpSource-5').value
    data.sourcesSeven = document.getElementById('arpSource-6').value
    data.sourcesEight = document.getElementById('arpSource-7').value

    return data;
}

function restoreFormData() {
    document.getElementById('adminStatus').value = backupData.adminStatus
    document.getElementById('bpduDropAny').value = backupData.bpduDropAny
    document.getElementById('configSpeed').value = backupData.configSpeed
    document.getElementById('broadcastUnit').value = backupData.broadcastUnit
    document.getElementById('broadcastValue').value = backupData.broadcastValue
    document.getElementById('multicastValue').value = backupData.multicastValue
    document.getElementById('unicastValue').value = backupData.unicastValue
    document.getElementById('arpSource-0').value = backupData.sourcesOne
    document.getElementById('arpSource-1').value = backupData.sourcesTwo
    document.getElementById('arpSource-2').value = backupData.sourcesThree
    document.getElementById('arpSource-3').value = backupData.sourcesFour
    document.getElementById('arpSource-4').value = backupData.sourcesFive
    document.getElementById('arpSource-5').value = backupData.sourcesSix
    document.getElementById('arpSource-6').value = backupData.sourcesSeven
    document.getElementById('arpSource-7').value = backupData.sourcesEight
}

function linkTypeLayout(type, data) {
    switch (type.value) {
        case 'Hybrid': {
            let hybridTab = document.getElementById('v-pills-hybrid-tab')
            hybridTab.setAttribute('aria-selected', 'true')
            let untaggedVlanList = document.getElementById('untaggedVlans')
            untaggedVlanList.value = null
            untaggedVlanList.value = data.vlan.untaggedVlanList.join(', ');
            untaggedVlanList.textContent = ''
            untaggedVlanList.textContent = data.vlan.untaggedVlanList.join(', ');
            let hybridPvid = document.getElementById('hybrid-PVID')
            hybridPvid.value = data.vlan.pvid
            hybridPvid.textContent = data.vlan.pvid.toString()
            let taggedVlanList = data.vlan.taggedVlanList;
            let taggedVlansForm = document.getElementById('taggedHybridVlanGroup')

            let taggedArray = Array.from(taggedVlanList)
            for (let element of taggedArray) {
                element.remove()
            }

            for (let tVlan of taggedVlanList) {
                let item = document.createElement('div')
                item.className = "form-control taggedVlan"
                item.type = 'text'
                // item.aria-describedby = 'basic-addon3 basic-addon4'
                item.value = tVlan
                item.textContent = tVlan
                item.style.display = 'flex'
                item.style.justifyContent = 'space-between'

                let closeButton = document.createElement('button')
                closeButton.className = 'btn-close'
                item.appendChild(closeButton)
                taggedVlansForm.appendChild(item)

                // On click, remove the div
                closeButton.addEventListener('click', function () {
                    this.parentElement.remove();
                });
            }
            break;
        }
        case 'Trunk': {
            let trunkTab = document.getElementById('v-pills-trunk-tab')
            trunkTab.setAttribute('aria-selected', 'true')
            let trunkPvid = document.getElementById('trunk-PVID')
            trunkPvid.value = data.vlan.pvid
            trunkPvid.textContent = data.vlan.pvid.toString()
            let taggedVlanList = data.vlan.taggedVlanList;
            let taggedVlansForm = document.getElementById('taggedTrunkVlanGroup')

            let taggedArray = Array.from(taggedVlanList)
            for (let element of taggedArray) {
                element.remove()
            }

            for (let tVlan of taggedVlanList) {
                let item = document.createElement('div')
                item.className = "form-control taggedVlan"
                item.type = 'text'
                // item.aria-describedby = 'basic-addon3 basic-addon4'
                item.value = tVlan
                item.textContent = tVlan
                item.style.display = 'flex'
                item.style.justifyContent = 'space-between'

                let closeButton = document.createElement('button')
                closeButton.className = 'btn-close'
                item.appendChild(closeButton)
                taggedVlansForm.appendChild(item)

                // On click, remove the div
                closeButton.addEventListener('click', function () {
                    this.parentElement.remove();
                });
            }
            break;
        }
        case 'Access': {
            let accessTab = document.getElementById('v-pills-access-tab')
            accessTab.setAttribute('aria-selected', 'true')
            let accessPvid = document.getElementById('access-PVID')
            accessPvid.value = data.vlan.pvid
            accessPvid.textContent = data.vlan.pvid.toString()
            break;
        }
    }
}

window.onload = function () {
    adjustWidth()
}