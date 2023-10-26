const saveAcl = document.getElementById('editAcl')

const antiProtocol = {
    'ICMP': 1,
    'IGMP': 2,
    'IP': 4,
    'TCP': 6,
    'UDP': 17,
    'GRE': 47,
    'IPv6esp': 50,
    'ICMPv6': 58,
    'Any': 256
}

let direction = 'Inbound'

async function addAclRules(ip, username, password) {
    let aclName = document.getElementById('aclName').textContent
    let aclType = document.getElementById('aclType').textContent
    let aclDescription = document.getElementById('aclDescription').textContent
    let aclRules = []
    let ruleNums = []
    let rows = document.getElementsByClassName('ruleRow')
    if (rows.length === 0) {
        window.alert('Please add at least one rule')
        return;
    }

    for (let row of rows) {
        let ruleID = parseInt(document.getElementById(row.id.toString() + 'ruleNumberInput').value)
        if (ruleNums.includes(ruleID)) {
            window.alert('Duplicate rule number: ' + ruleID.toString())
            nowYouDont()
            return
        } else {
            ruleNums.push(ruleID)
        }

        let action = document.getElementById(row.id.toString() + 'ruleActionSelect').value
        let protocol = antiProtocol[document.getElementById(row.id.toString() + 'ruleProtocolSelect').value]
        let srcIP = document.getElementById(row.id.toString() + 'ruleSrcIPInput').value
        if (!isValidCIDR(srcIP)) {
            window.alert("Invalid source IP address: " + srcIP)
            nowYouDont()
            return;
        }
        let srcPort = null
        if ((protocol === 17 || protocol === 6) && document.getElementById(row.id.toString() + 'ruleSrcPortOperationSelect').style.visibility !== 'hidden') {
            srcPort = {}
            srcPort['operation'] = document.getElementById(row.id.toString() + 'ruleSrcPortOperationSelect').value
            srcPort['value1'] = parseInt(document.getElementById(row.id.toString() + 'ruleSrcPortValue1Input').value)
            srcPort['value2'] = 0
            if (srcPort['operation'] === 'Range') {
                srcPort['value2'] = parseInt(document.getElementById(row.id.toString() + 'ruleSrcPortValue2Input').value)
                if (srcPort['value1'] === 1 && srcPort['value2'] === 65535) {
                    srcPort = null
                }
            }
        }
        let dstIP = document.getElementById(row.id.toString() + 'ruleDstIPInput').value
        if (!isValidCIDR(dstIP)) {
            window.alert("Invalid destination IP address: " + dstIP)
            nowYouDont()
            return;
        }

        let dstPort = null
        if ((protocol === 17 || protocol === 6) && document.getElementById(row.id.toString() + 'ruleDstPortOperationSelect').style.visibility !== 'hidden') {
            dstPort = {}
            dstPort['operation'] = document.getElementById(row.id.toString() + 'ruleDstPortOperationSelect').value
            dstPort['value1'] = parseInt(document.getElementById(row.id.toString() + 'ruleDstPortValue1Input').value)
            dstPort['value2'] = 0
            if (dstPort['operation'] === 'Range') {
                dstPort['value2'] = parseInt(document.getElementById(row.id.toString() + 'ruleDstPortValue2Input').value)
                if (dstPort['value1'] === 1 && dstPort['value2'] === 65535) {
                    dstPort = null
                }
            }
        }

        let newRule = {
            'ruleID': ruleID,
            'action': action,
            'protocol': protocol,
            'srcIP': srcIP,
            'srcPort': srcPort,
            'dstIP': dstIP,
            'dstPort': dstPort,
        }

        for (let rule of aclRules) {
            let { ruleID, ...ruleWithoutId } = rule;
            let { ruleID: newRuleID, ...newRuleWithoutId } = newRule;
            if (JSON.stringify(ruleWithoutId) === JSON.stringify(newRuleWithoutId)) {
                window.alert('Duplicate rule' + JSON.stringify(newRule))
                return
            }
        }

        aclRules.push(newRule);
    }

    let pfilters = []
    let newPfilter = {
        ifIndex: parseInt(connectPort.value),
        direction: direction,
        aclType: aclType,
        aclName: aclName
    }

    pfilters.push(newPfilter)

    nowYouSeeMe()
    await removeAcl(connectIp.value, connectUsername.value, connectPassword.value, aclName)

    const response = await fetch(
        'http://5.149.127.105',
        {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(
                {
                    jsonrpc: '2.0',
                    method: 'comware.CreateACL',
                    params: {
                        target: {
                            ip: ip,
                            username: username,
                            password: password
                        },
                        acl: {
                            name: aclName,
                            type: aclType,
                            description: aclDescription,
                            rules: aclRules
                        }
                    },
                    id: '38276e9c-018d-498e-95af-ad8c019a000d'
                }
            )
        }
    )

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

    await setPortAcl(connectIp.value, connectUsername.value, connectPassword.value, pfilters)

    let modal = new bootstrap.Modal(document.getElementById('aclInfoModalWindow'))
    await aclInfoFull(connectIp.value, connectUsername.value, connectPassword.value, aclName, modal)
}