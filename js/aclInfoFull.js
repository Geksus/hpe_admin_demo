const protocols = {
    1: 'ICMP',
    2: 'IGMP',
    4: 'IP',
    6: 'TCP',
    17: 'UDP',
    47: 'GRE',
    50: 'IPv6esp',
    58: 'ICMPv6',
    256: 'Any'
};

const operations = ['Equal', 'Less', 'Greater', 'NotEqual', 'Range']

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

    // ACL header
    let aclType = document.getElementById('aclType')
    aclType.textContent = ''
    aclType.textContent = parsedData.type
    let aclName = document.getElementById('aclName')
    aclName.textContent = ''
    aclName.textContent = parsedData.name
    let aclDescription = document.getElementById('aclDescription')
    aclDescription.textContent = ''
    aclDescription.textContent = parsedData.description

    //ACL full info
    let aclRuleTable = document.getElementById('aclRuleTable')
    aclRuleTable.innerHTML = ''
    let rules = parsedData.rules

    // Iterating over rules
    if (rules.length > 0) {
        for (let i = 0; i < rules.length; i++) {
            let row = document.createElement('tr')
            let ruleNumber = document.createElement('td')
            ruleNumber.style.width = '5em'
            let ruleNumberDiv = document.createElement('div')
            let ruleNumberInput = document.createElement('input')
            ruleNumberInput.className = 'form-control'
            ruleNumberInput.type = 'text'
            ruleNumberInput.value = rules[i].ruleID
            ruleNumberDiv.appendChild(ruleNumberInput)
            ruleNumber.appendChild(ruleNumberDiv)


            let ruleAction = document.createElement('td')
            let ruleActionDiv = document.createElement('div')
            let ruleActionSelect = document.createElement('select')
            ruleActionSelect.className = 'form-select table-select'
            let ruleActionCurrent = document.createElement('option')
            ruleActionCurrent.textContent = rules[i].action
            ruleActionSelect.appendChild(ruleActionCurrent)
            for (let action of ['Permit', 'Deny']) {
                let option = document.createElement('option')
                option.textContent = action
                if (option.textContent !== ruleActionCurrent.textContent) {
                    ruleActionSelect.appendChild(option)
                }
            }
            ruleActionDiv.appendChild(ruleActionSelect)
            ruleAction.appendChild(ruleActionDiv)


            let ruleProtocol = document.createElement('td')
            let ruleProtocolDiv = document.createElement('div')
            let ruleProtocolSelect = document.createElement('select')
            ruleProtocolSelect.className = 'form-select table-select'
            let ruleProtocolCurrent = document.createElement('option')
            ruleProtocolCurrent.textContent = rules[i].protocol
            for (let key of Object.keys(protocols)) {
                if (parseInt(key) === rules[i].protocol) {
                    ruleProtocolCurrent.textContent = protocols[rules[i].protocol]
                    break;
                }
            }
            ruleProtocolSelect.appendChild(ruleProtocolCurrent)
            for (let key of Object.keys(protocols)) {
                let option = document.createElement('option')
                option.textContent = protocols[key]
                if (option.textContent !== ruleProtocolCurrent.textContent) {
                    ruleProtocolSelect.appendChild(option)
                }
            }
            ruleProtocolDiv.appendChild(ruleProtocolSelect)
            ruleProtocol.appendChild(ruleProtocolDiv)

            let ruleSrcIP = document.createElement('td')
            ruleSrcIP.style.width = '11em'
            let ruleSrcIPDiv = document.createElement('div')
            let ruleSrcIPInput = document.createElement('input')
            ruleSrcIPInput.className = 'form-control'
            ruleSrcIPInput.type = 'text'
            ruleSrcIPInput.value = rules[i].srcIP
            ruleSrcIPDiv.appendChild(ruleSrcIPInput)
            ruleSrcIP.appendChild(ruleSrcIPDiv)

            let ruleSrcPortOperation = document.createElement('td')
            let ruleSrcPortOperationDiv = document.createElement('div')
            let ruleSrcPortOperationSelect = document.createElement('select')
            ruleSrcPortOperationSelect.className = 'form-select table-select'
            let ruleSrcOperationCurrent = document.createElement('option')
            ruleSrcOperationCurrent.textContent = ''
            if (rules[i].srcPort !== null) {
                ruleSrcOperationCurrent.textContent = rules[i].srcPort.operation
            }
            ruleSrcPortOperationSelect.appendChild(ruleSrcOperationCurrent)
            for (let operation of operations) {
                let option = document.createElement('option')
                option.textContent = operation
                if (option.textContent !== ruleSrcOperationCurrent.textContent) {
                    ruleSrcPortOperationSelect.appendChild(option)
                }
            }
            ruleSrcPortOperationDiv.appendChild(ruleSrcPortOperationSelect)
            ruleSrcPortOperation.appendChild(ruleSrcPortOperationDiv)


            let ruleSrcPortValue1 = document.createElement('td')
            ruleSrcPortValue1.style.width = '6em'
            let ruleSrcPortValue1Div = document.createElement('div')
            let ruleSrcPortValue1Input = document.createElement('input')
            ruleSrcPortValue1Input.className = 'form-control'
            ruleSrcPortValue1Input.type = 'text'
            if (rules[i].srcPort !== null) {
                ruleSrcPortValue1Input.value = rules[i].srcPort.value1
            }
            ruleSrcPortValue1Div.appendChild(ruleSrcPortValue1Input)
            ruleSrcPortValue1.appendChild(ruleSrcPortValue1Div)


            let ruleSrcPortValue2 = document.createElement('td')
            ruleSrcPortValue2.style.width = '6em'
            let ruleSrcPortValue2Div = document.createElement('div')
            let ruleSrcPortValue2Input = document.createElement('input')
            ruleSrcPortValue2Input.className = 'form-control'
            ruleSrcPortValue2Input.type = 'text'
            if (ruleSrcOperationCurrent.textContent === 'Range') {
                ruleSrcPortValue1Input.value = rules[i].srcPort.value2
            }
            ruleSrcPortValue2Div.appendChild(ruleSrcPortValue2Input)
            ruleSrcPortValue2.appendChild(ruleSrcPortValue2Div)


            let ruleDstIP = document.createElement('td')
            ruleDstIP.style.width = '11em'
            let ruleDstIPDiv = document.createElement('div')
            let ruleDstIPInput = document.createElement('input')
            ruleDstIPInput.className = 'form-control'
            ruleDstIPInput.type = 'text'
            ruleDstIPInput.value = rules[i].dstIP
            ruleDstIPDiv.appendChild(ruleDstIPInput)
            ruleDstIP.appendChild(ruleDstIPDiv)


            let ruleDstPortOperation = document.createElement('td')
            let ruleDstPortOperationDiv = document.createElement('div')
            let ruleDstPortOperationSelect = document.createElement('select')
            ruleDstPortOperationSelect.className = 'form-select table-select'
            let ruleDstOperationCurrent = document.createElement('option')
            ruleDstOperationCurrent.textContent = ''
            if (rules[i].dstPort !== null) {
                ruleDstOperationCurrent.textContent = rules[i].dstPort.operation
            }
            ruleDstPortOperationSelect.appendChild(ruleDstOperationCurrent)
            for (let operation of operations) {
                let option = document.createElement('option')
                option.textContent = operation
                if (option.textContent !== ruleDstOperationCurrent.textContent) {
                    ruleDstPortOperationSelect.appendChild(option)
                }
            }
            ruleDstPortOperationDiv.appendChild(ruleDstPortOperationSelect)
            ruleDstPortOperation.appendChild(ruleDstPortOperationDiv)


            let ruleDstPortValue1 = document.createElement('td')
            ruleDstPortValue1.style.width = '6em'
            let ruleDstPortValue1Div = document.createElement('div')
            let ruleDstPortValue1Input = document.createElement('input')
            ruleDstPortValue1Input.className = 'form-control'
            ruleDstPortValue1Input.type = 'text'
            if (rules[i].dstPort !== null) {
                ruleDstPortValue1Input.value = rules[i].dstPort.value1
            }
            ruleDstPortValue1Div.appendChild(ruleDstPortValue1Input)
            ruleDstPortValue1.appendChild(ruleDstPortValue1Div)


            let ruleDstPortValue2 = document.createElement('td')
            ruleDstPortValue2.style.width = '6em'
            let ruleDstPortValue2Div = document.createElement('div')
            let ruleDstPortValue2Input = document.createElement('input')
            ruleDstPortValue2Input.className = 'form-control'
            ruleDstPortValue2Input.type = 'text'
            if (ruleDstOperationCurrent.textContent === 'Range') {
                ruleDstPortValue1Input.value = rules[i].dstPort.value2
            }
            ruleDstPortValue2Div.appendChild(ruleDstPortValue2Input)
            ruleDstPortValue2.appendChild(ruleDstPortValue2Div)

            let addRule = document.createElement('td')
            addRule.style.width = '10em'
            let addRuleDiv = document.createElement('div')
            let addRuleButton = document.createElement('button')
            addRuleButton.textContent = 'Add rule'
            addRuleButton.className = 'btn btn-success'
            addRuleButton.style.width = '10em'
            addRuleButton.addEventListener('click', addRow)
            addRuleDiv.appendChild(addRuleButton)
            addRule.appendChild(addRuleDiv)

            let removeRule = document.createElement('td')
            removeRule.style.width = '10em'
            let removeRuleDiv = document.createElement('div')
            let removeRuleButton = document.createElement('button')
            removeRuleButton.className = 'btn btn-danger'
            removeRuleButton.style.width = '10em'
            removeRuleButton.textContent = 'Delete rule'
            removeRuleButton.addEventListener('click', function() {
                row.remove()
            })
            removeRuleDiv.appendChild(removeRuleButton)
            removeRule.appendChild(removeRuleDiv)



            row.appendChild(ruleNumber)
            row.appendChild(ruleAction)
            row.appendChild(ruleProtocol)
            row.appendChild(ruleSrcIP)
            row.appendChild(ruleSrcPortOperation)
            row.appendChild(ruleSrcPortValue1)
            row.appendChild(ruleSrcPortValue2)
            row.appendChild(ruleDstIP)
            row.appendChild(ruleDstPortOperation)
            row.appendChild(ruleDstPortValue1)
            row.appendChild(ruleDstPortValue2)
            row.appendChild(addRule)
            row.appendChild(removeRule)
            aclRuleTable.appendChild(row)
        }
    }

}