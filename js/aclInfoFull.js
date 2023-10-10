async function aclInfoFull(ip, username, password, name, modal) {
    nowYouSeeMe()
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
                    method: 'comware.GetACLInfoFull',
                    params: {
                        target: {
                            ip: ip,
                            username: username,
                            password: password,
                        },
                        acl: {
                            name: name
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
    const parsedData = data.result;
    console.log(parsedData)
    modal.show()
    nowYouDont()

    let aclRuleTable = document.getElementById('aclRuleTable')
    let rules = parsedData.rules
    for (let i = 0; i < rules.length; i++) {
        let row = document.createElement('tr')
        let ruleNumber = document.createElement('td')
        ruleNumber.textContent = rules[i].ruleID
        let ruleAction = document.createElement('td')
        ruleAction.textContent = rules[i].action
        let ruleProtocol = document.createElement('td')
        ruleProtocol.textContent = rules[i].protocol
        let ruleSrcIP = document.createElement('td')
        ruleSrcIP.textContent = rules[i].srcIP
        let ruleSrcPortOperation = document.createElement('td')
        let ruleSrcPortValue1 = document.createElement('td')
        let ruleSrcPortValue2 = document.createElement('td')
        if (rules[i].srcPort !== null) {
            ruleSrcPortOperation.textContent = rules[i].srcPort.operation
            ruleSrcPortValue1.textContent = rules[i].srcPort.value1
            if (ruleSrcPortOperation.textContent === 'Range') {
                ruleSrcPortValue2.textContent = rules[i].srcPort.value2
            }
        }


        row.appendChild(ruleNumber)
        row.appendChild(ruleAction)
        row.appendChild(ruleProtocol)
        row.appendChild(ruleSrcIP)
        row.appendChild(ruleSrcPortOperation)
        row.appendChild(ruleSrcPortValue1)
        row.appendChild(ruleSrcPortValue2)
        aclRuleTable.appendChild(row)
    }
    console.log(parsedData)

}