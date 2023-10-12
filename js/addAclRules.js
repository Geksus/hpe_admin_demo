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

async function addAclRules(ip, username, password, name, type, rules) {
    nowYouSeeMe()
    let aclRules = []
    let rows = document.getElementsByClassName('ruleRow')
    for (let i = 0; i < rows.length; i++) {
        let ruleID = document.getElementById(i.toString() + 'ruleNumberInput').value
        let action = document.getElementById(i.toString() + 'ruleActionSelect').value
        let protocol = antiProtocol[document.getElementById(i.toString() + 'ruleProtocolSelect').value]
        let srcIP = document.getElementById(i.toString() + 'ruleSrcIPInput').value
        let srcPort = null
        // if (document.)
        let newRule = {
            'ruleID': ruleID,
            'action': action,
            'protocol': protocol,
            'srcIP': srcIP,
            'srcPort': srcPort,
        }
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
                    jsonrpc: 2.0,
                    method: 'comware.AddACLRules',
                    params: {
                        target: {
                            ip: ip,
                            username: username,
                            password: password
                        },
                        acl: {
                            name: name,
                            type: type,
                            rules: rules
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

    let modal = new bootstrap.Modal(document.getElementById('aclInfoModalWindow'))
    await aclInfoFull(ip, username, password, name, modal)


}