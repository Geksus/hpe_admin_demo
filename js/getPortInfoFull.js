let connectButton = document.getElementById('connectButton');
let saveButton = document.getElementById('saveButton')
let connectIp = document.getElementById('connectIp').value;
let connectUsername = document.getElementById('connectUsername').value;
let connectPassword = document.getElementById('connectPassword').value;
let connectPort = document.getElementById('connectPort').value;
let backupData = {}

async function getPortInfoFull(ip, username, password, port) {
    nowYouSeeMe()
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
        nowYouDont()
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
        if (operStatus.textContent === 'Up') {
            operStatus.style.color = 'green'
            operStatus.style.borderColor = 'green'
        } else {
            operStatus.style.color = 'red'
            operStatus.style.borderColor = 'red'
        }
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
        let inPackets = document.getElementById('inPackets')
        inPackets.textContent = ''
        inPackets.textContent = parsedData.statistics.inPackets
        let outPackets = document.getElementById('outPackets')
        outPackets.textContent = ''
        outPackets.textContent = parsedData.statistics.outPackets
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
        let linkType = parsedData.vlan.linkType
        let pvid = parsedData.vlan.pvid
        let existingTaggedVlans = document.getElementsByClassName('taggedVlan');
        for (let i=existingTaggedVlans.length-1; i >= 0; i--) {
            existingTaggedVlans[i].remove();
        }
        let taggedVlanList = parsedData.vlan.taggedVlanList
        let untaggedVlanList = parsedData.vlan.untaggedVlanList
        let accessTab = document.getElementById('v-pills-access-tab')
        accessTab.className = 'nav-link'
        let trunkTab = document.getElementById('v-pills-trunk-tab')
        trunkTab.className = 'nav-link'
        let hybridTab = document.getElementById('v-pills-hybrid-tab')
        hybridTab.className = 'nav-link'

        let accessTabContent = document.getElementById('v-pills-access')
        accessTabContent.className = 'tab-pane fade'
        let trunkTabContent = document.getElementById('v-pills-trunk')
        trunkTabContent.className = 'tab-pane fade'
        let hybridTabContent = document.getElementById('v-pills-hybrid')
        hybridTabContent.className = 'tab-pane fade'

        let accessPvid = document.getElementById('access-PVID')
        let trunkPvid = document.getElementById('trunk-PVID')
        let hybridPvid = document.getElementById('hybrid-PVID')

        switch (linkType) {
            case 'Access':
                accessTab.className = 'nav-link active'
                accessTabContent.className = 'tab-pane fade show active'
                accessPvid.value = null
                hybridPvid.value = null
                trunkPvid.value = null
                accessPvid.value = pvid
                break;

            case 'Trunk':
                trunkTab.className = 'nav-link active'
                trunkTabContent.className = 'tab-pane fade show active'
                accessPvid.value = null
                hybridPvid.value = null
                trunkPvid.value = null
                trunkPvid.value = pvid
                let trunkTaggedVlans = document.getElementById('taggedTrunkVlanGroup')
                for (let taggedVlan of taggedVlanList) {
                    let vlan = document.createElement('div')
                    vlan.className = 'form-control taggedVlan'
                    vlan.value = taggedVlan
                    vlan.textContent = taggedVlan
                    vlan.style.display = 'flex'
                    vlan.style.justifyContent = 'space-between'
                    let closeButton = document.createElement('button')
                    closeButton.className = 'btn-close'
                    closeButton.addEventListener('click', function() {
                        vlan.remove()
                    })
                    vlan.appendChild(closeButton)
                    trunkTaggedVlans.appendChild(vlan)
                }
                break;

            case 'Hybrid':
                hybridTab.className = 'nav-link active'
                hybridTabContent.className = 'tab-pane fade show active'
                accessPvid.value = null
                hybridPvid.value = null
                trunkPvid.value = null
                hybridPvid.value = pvid
                let hybridTaggedVlans = document.getElementById('taggedHybridVlanGroup')
                for (let taggedVlan of taggedVlanList) {
                    let vlan = document.createElement('div')
                    vlan.className = 'form-control taggedVlan'
                    vlan.value = taggedVlan
                    vlan.textContent = taggedVlan
                    vlan.style.display = 'flex'
                    vlan.style.justifyContent = 'space-between'
                    let closeButton = document.createElement('button')
                    closeButton.className = 'btn-close'
                    closeButton.addEventListener('click', function() {
                        vlan.remove()
                    })
                    vlan.appendChild(closeButton)
                    hybridTaggedVlans.appendChild(vlan)
                }
                let hybridUntaggedVlans = document.getElementById('untaggedVlans')
                hybridUntaggedVlans.textContent = untaggedVlanList.join(', ')
                break;
        }

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

        let bpduSwitchForm = document.getElementById('bpduSwitchForm')
        bpduSwitchForm.innerHTML = ''
        let bpduSwitchLabel = document.createElement('label')
        bpduSwitchLabel.className = 'form-check-label'
        bpduSwitchLabel.for = 'bpduSwitch'
        bpduSwitchLabel.textContent = 'BPDU drop any'
        let bpduSwitch = document.createElement('input')
        bpduSwitch.className = 'form-check-input'
        bpduSwitch.type = 'checkbox'
        bpduSwitch.role = 'switch'
        bpduSwitch.id = 'bpduSwitch'
        bpduSwitch.addEventListener('click', function () {
            if (bpduSwitch.hasAttribute('checked')) {
                bpduSwitch.removeAttribute('checked')
            } else {
                bpduSwitch.setAttribute('checked', '')
            }
        })
        let bpduValue = parsedData.bpduDropAny
        if (bpduValue === true) {
            bpduSwitch.setAttribute('checked', '')
        }
        bpduSwitchForm.appendChild(bpduSwitchLabel)
        bpduSwitchForm.appendChild(bpduSwitch)

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
        let inboundACL = document.getElementById('inboundACL')
        inboundACL.innerHTML = ''
        let outboundACL = document.getElementById('outboundACL')
        outboundACL.innerHTML = ''

        if (parsedData.acl.inbound.length > 0) {
            for (let inbound of parsedData.acl.inbound) {
                if (inbound.type === 'IPv4') {
                    let row = document.createElement('tr')
                    let inboundIpv4Header = document.createElement('td')
                    inboundIpv4Header.textContent = 'IPv4'
                    inboundIpv4Header.className = 'tableLeft'
                    let inboundIpv4Value = document.createElement('td')
                    inboundIpv4Value.textContent = inbound.name
                    inboundIpv4Value.style.cursor = 'pointer'
                    inboundIpv4Value.onclick = function() {
                        let modal = new bootstrap.Modal(document.getElementById('aclInfoModalWindow'))
                        aclInfoFull(connectIp, connectUsername, connectPassword, inboundIpv4Value.textContent, modal)
                    };
                    row.appendChild(inboundIpv4Header)
                    row.appendChild(inboundIpv4Value)
                    inboundACL.appendChild(row)
                }
                if (inbound.type === 'IPv6') {
                    let row = document.createElement('tr')
                    let inboundIpv6Header = document.createElement('td')
                    inboundIpv6Header.textContent = 'IPv6'
                    inboundIpv6Header.className = 'tableLeft'
                    let inboundIpv6Value = document.createElement('td')
                    inboundIpv6Value.textContent = inbound.name
                    inboundIpv6Value.style.cursor = 'pointer'
                    inboundIpv6Value.onclick = function() {
                        let modal = new bootstrap.Modal(document.getElementById('aclInfoModalWindow'))
                        aclInfoFull(connectIp, connectUsername, connectPassword, inboundIpv6Value.textContent, modal)
                    };
                    row.appendChild(inboundIpv6Header)
                    row.appendChild(inboundIpv6Value)
                    inboundACL.appendChild(row)
                }
                if (inbound.type === 'MAC') {
                    let row = document.createElement('tr')
                    let inboundMacHeader = document.createElement('td')
                    inboundMacHeader.textContent = 'MAC'
                    inboundMacHeader.className = 'tableLeft'
                    let inboundMacValue = document.createElement('td')
                    inboundMacValue.textContent = inbound.name
                    inboundMacValue.style.cursor = 'pointer'
                    inboundMacValue.onclick = function() {
                        let modal = new bootstrap.Modal(document.getElementById('aclInfoModalWindow'))
                        aclInfoFull(connectIp, connectUsername, connectPassword, inboundMacValue.textContent, modal)
                    };
                    row.appendChild(inboundMacHeader)
                    row.appendChild(inboundMacValue)
                    inboundACL.appendChild(row)
                }
            }
        }

        if (parsedData.acl.outbound.length > 0) {
            for (let outbound of parsedData.acl.outbound) {
                if (outbound.type === 'IPv4') {
                    let row = document.createElement('tr')
                    let outboundIpv4Header = document.createElement('td')
                    outboundIpv4Header.textContent = 'IPv4'
                    outboundIpv4Header.className = 'tableLeft'
                    let outboundIpv4Value = document.createElement('td')
                    outboundIpv4Value.textContent = outbound.name
                    outboundIpv4Value.style.cursor = 'pointer'
                    outboundIpv4Value.onclick = function() {
                        let modal = new bootstrap.Modal(document.getElementById('aclInfoModalWindow'))
                        aclInfoFull(connectIp, connectUsername, connectPassword, outboundIpv4Value.textContent, modal)
                    };
                    row.appendChild(outboundIpv4Header)
                    row.appendChild(outboundIpv4Value)
                    outboundACL.appendChild(row)
                }
                if (outbound.type === 'IPv6') {
                    let row = document.createElement('tr')
                    let outboundIpv6Header = document.createElement('td')
                    outboundIpv6Header.textContent = 'IPv6'
                    outboundIpv6Header.className = 'tableLeft'
                    let outboundIpv6Value = document.createElement('td')
                    outboundIpv6Value.textContent = outbound.name
                    outboundIpv6Value.style.cursor = 'pointer'
                    outboundIpv6Value.onclick = function() {
                        let modal = new bootstrap.Modal(document.getElementById('aclInfoModalWindow'))
                        aclInfoFull(connectIp, connectUsername, connectPassword, outboundIpv6Value.textContent, modal)
                    };
                    row.appendChild(outboundIpv6Header)
                    row.appendChild(outboundIpv6Value)
                    outboundACL.appendChild(row)
                }
                if (outbound.type === 'MAC') {
                    let row = document.createElement('tr')
                    let outboundMacHeader = document.createElement('td')
                    outboundMacHeader.textContent = 'MAC'
                    outboundMacHeader.className = 'tableLeft'
                    let outboundMacValue = document.createElement('td')
                    outboundMacValue.textContent = outbound.name
                    outboundMacValue.style.cursor = 'pointer'
                    outboundMacValue.onclick = function() {
                        let modal = new bootstrap.Modal(document.getElementById('aclInfoModalWindow'))
                        aclInfoFull(connectIp, connectUsername, connectPassword, outboundMacValue.textContent, modal)
                    };
                    row.appendChild(outboundMacHeader)
                    row.appendChild(outboundMacValue)
                    outboundACL.appendChild(row)
                }
            }
        }
    }
    backupData = backupFormData()
    adjustWidth()

}

//setPortConfig

async function setPortConfig(ip, username, password, port) {

    // General info
    let description = document.getElementById('description').textContent;
    let adminStatus = document.getElementById('adminStatus').value;

// Speed
    let configSpeed = parseInt(document.getElementById('configSpeed').value);

// VLAN
    let linkType = document.getElementsByClassName('nav-link active')[0].textContent.trim()
    let pvid = null
    let taggedVlanList = []
    let taggedVlanItems = null
    switch (linkType) {
        case 'Access':
            pvid = parseInt(document.getElementById('access-PVID').value)
            taggedVlanList = null
            break;
        case 'Trunk':
            pvid = parseInt(document.getElementById('trunk-PVID').value)
            taggedVlanItems = document.getElementsByClassName('taggedVlan')
            for (let vlan of taggedVlanItems) {
                if (vlan.value) {
                    taggedVlanList.push(parseInt(vlan.value))
                }
            }
            break;
        case 'Hybrid':
            pvid = parseInt(document.getElementById('hybrid-PVID').value)
            taggedVlanItems = document.getElementsByClassName('taggedVlan')
            for (let vlan of taggedVlanItems) {
                if (vlan.value) {
                    taggedVlanList.push(parseInt(vlan.value))
                }
            }
            break;
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
    let bpduSwitchElement = document.getElementById('bpduSwitch')
    let bpduSwitch = false
    if (bpduSwitchElement.hasAttribute('checked')) {
        bpduSwitch = true
    }


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

    nowYouSeeMe()
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
                    "bpduDropAny": bpduSwitch,
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
            window.alert(data.error.data.message)
        }
    }
    await getPortInfoFull(connectIp.value, connectUsername.value, connectPassword.value, connectPort.value)
}

