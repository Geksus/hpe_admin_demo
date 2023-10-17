const saveAcl = document.getElementById('editAcl')
// const aclType = document.getElementById('aclType').textContent
// const aclName = document.getElementById('aclName').textContent

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

async function addAclRules(ip, username, password, name, type) {
    nowYouSeeMe()
    let aclRules = []
    let rows = document.getElementsByClassName('ruleRow')
    for (let row of rows) {
        let ruleID = parseInt(document.getElementById(row.id.toString() + 'ruleNumberInput').value)
        let action = document.getElementById(row.id.toString() + 'ruleActionSelect').value
        let protocol = antiProtocol[document.getElementById(row.id.toString() + 'ruleProtocolSelect').value]
        let srcIP = document.getElementById(row.id.toString() + 'ruleSrcIPInput').value
        let srcPort = null
        if (protocol === 17 || protocol === 6) {
            srcPort = {}
            srcPort['operation'] = document.getElementById(row.id.toString() + 'ruleSrcPortOperationSelect').value
            srcPort['value1'] = parseInt(document.getElementById(row.id.toString() + 'ruleSrcPortValue1Input').value)
            srcPort['value2'] = 0
            if (srcPort['operation'] === 'Range') {
                srcPort['value2'] = parseInt(document.getElementById(row.id.toString() + 'ruleSrcPortValue2Input').value)
            }
        }
        let dstIP = document.getElementById(row.id.toString() + 'ruleDstIPInput').value
        let dstPort = null
        if (protocol === 17 || protocol === 6) {
            dstPort = {}
            dstPort['operation'] = document.getElementById(row.id.toString() + 'ruleDstPortOperationSelect').value
            dstPort['value1'] = parseInt(document.getElementById(row.id.toString() + 'ruleDstPortValue1Input').value)
            dstPort['value2'] = 0
            if (dstPort['operation'] === 'Range') {
                dstPort['value2'] = parseInt(document.getElementById(row.id.toString() + 'ruleDstPortValue2Input').value)
            }
        }
        let newRule = {
            'ruleID': ruleID,
            'comment': 'This is the description',
            'action': action,
            'protocol': protocol,
            'srcIP': srcIP,
            'srcPort': srcPort,
            'dstIP': dstIP,
            'dstPort': dstPort
        }

        aclRules.push(newRule)
    }
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
                    method: 'comware.AddACLRules',
                    params: {
                        target: {
                            ip: ip,
                            username: username,
                            password: password
                        },
                        acl: {
                            name: document.getElementById('aclName').textContent,
                            type: document.getElementById('aclType').textContent,
                            rules: aclRules
                        }
                    },
                    id: '38276e9c-018d-498e-95af-ad8c019a000d'
                }
            )
        }
    )
    console.log(aclRules)


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

    let modal = new bootstrap.Modal(document.getElementById('aclInfoModalWindow'))
    await aclInfoFull(connectIp.value, connectUsername.value, connectPassword.value, aclName, modal)

}