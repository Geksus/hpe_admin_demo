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
    aclRuleTable.id = 'aclRuleTable'
    let rules = parsedData.rules

    // Iterating over rules
    if (rules.length > 0) {
        for (let i = 0; i < rules.length; i++) {
            console.log(rules[i])
            let row = document.createElement('tr')
            row.id = i.toString()
            row.className = 'ruleRow'


            let ruleNumber = document.createElement('td')
            ruleNumber.style.width = '5em'
            let ruleNumberDiv = document.createElement('div')
            let ruleNumberInput = document.createElement('input')
            ruleNumberInput.id = row.id + 'ruleNumberInput'
            ruleNumberInput.className = 'form-control acRuleNumber'
            ruleNumberInput.type = 'text'
            ruleNumberInput.value = rules[i].ruleID
            ruleNumberDiv.appendChild(ruleNumberInput)
            ruleNumber.appendChild(ruleNumberDiv)


            let ruleAction = document.createElement('td')
            ruleAction.style.width = '8em'
            let ruleActionDiv = document.createElement('div')
            let ruleActionSelect = document.createElement('select')
            ruleActionSelect.className = 'form-select table-select aclRuleAction'
            ruleActionSelect.id = row.id + 'ruleActionSelect'
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
            ruleProtocol.style.width = '6em'
            let ruleProtocolDiv = document.createElement('div')
            let ruleProtocolSelect = document.createElement('select')
            ruleProtocolSelect.className = 'form-select table-select aclRuleProtocol'
            ruleProtocolSelect.id = row.id + 'ruleProtocolSelect'
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
            ruleProtocolSelect.addEventListener('change', function (event) {
                if (event.target.value === 'TCP' || event.target.value === 'UDP') {
                    ruleSrcPortOperationSelect.style.visibility = 'visible'
                    ruleSrcPortValue1Input.style.visibility = 'visible'
                    if (ruleSrcPortOperationSelect.value === 'Range') {
                        ruleSrcPortValue2Input.style.visibility = 'visible'
                    }
                    ruleDstPortOperationSelect.style.visibility = 'visible'
                    ruleDstPortValue1Input.style.visibility = 'visible'
                    if (ruleDstPortOperationSelect.value === 'Range') {
                        ruleDstPortValue2Input.style.visibility = 'visible'
                    }
                } else {
                    ruleSrcPortOperationSelect.style.visibility = 'hidden'
                    ruleSrcPortValue1Input.style.visibility = 'hidden'
                    ruleSrcPortValue2Input.style.visibility = 'hidden'
                    ruleDstPortOperationSelect.style.visibility = 'hidden'
                    ruleDstPortValue1Input.style.visibility = 'hidden'
                    ruleDstPortValue2Input.style.visibility = 'hidden'
                }
            })
            ruleProtocolDiv.appendChild(ruleProtocolSelect)
            ruleProtocol.appendChild(ruleProtocolDiv)


            let ruleSrcIP = document.createElement('td')
            ruleSrcIP.style.width = '12em'
            let ruleSrcIPDiv = document.createElement('div')
            let ruleSrcIPInput = document.createElement('input')
            ruleSrcIPInput.id = row.id + 'ruleSrcIPInput'
            ruleSrcIPInput.className = 'form-control aclRuleSrcIp'
            ruleSrcIPInput.type = 'text'
            ruleSrcIPInput.value = rules[i].srcIP
            ruleSrcIPDiv.appendChild(ruleSrcIPInput)
            ruleSrcIP.appendChild(ruleSrcIPDiv)


            let ruleSrcPortOperation = document.createElement('td')
            ruleSrcPortOperation.style.width = '8em'
            let ruleSrcPortOperationDiv = document.createElement('div')
            let ruleSrcPortOperationSelect = document.createElement('select')
            ruleSrcPortOperationSelect.id = row.id + 'ruleSrcPortOperationSelect'
            ruleSrcPortOperationSelect.className = 'form-select table-select aclRuleSrcPortOp'
            let ruleSrcOperationCurrent = document.createElement('option')
            ruleSrcOperationCurrent.textContent = 'Range'
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
            ruleSrcPortOperationSelect.addEventListener('change', function(event) {
                if (event.target.value !== 'Range') {
                    ruleSrcPortValue2Input.style.visibility = 'hidden'
                } else {
                    ruleSrcPortValue2Input.style.visibility = 'visible'
                }
            })
            ruleSrcPortOperationDiv.appendChild(ruleSrcPortOperationSelect)
            ruleSrcPortOperation.appendChild(ruleSrcPortOperationDiv)


            let ruleSrcPortValue1 = document.createElement('td')
            ruleSrcPortValue1.style.width = '6em'
            let ruleSrcPortValue1Div = document.createElement('div')
            let ruleSrcPortValue1Input = document.createElement('input')
            ruleSrcPortValue1Input.id = row.id + 'ruleSrcPortValue1Input'
            ruleSrcPortValue1Input.className = 'form-control ruleSrcPortValue1'
            ruleSrcPortValue1Input.type = 'text'
            if (rules[i].srcPort !== null) {
                ruleSrcPortValue1Input.value = rules[i].srcPort.value1
            } else {
                ruleSrcPortValue1Input.value = '1'
            }
            ruleSrcPortValue1Div.appendChild(ruleSrcPortValue1Input)
            ruleSrcPortValue1.appendChild(ruleSrcPortValue1Div)


            let ruleSrcPortValue2 = document.createElement('td')
            ruleSrcPortValue2.style.width = '6em'
            let ruleSrcPortValue2Div = document.createElement('div')
            let ruleSrcPortValue2Input = document.createElement('input')
            ruleSrcPortValue2Input.id = row.id + 'ruleSrcPortValue2Input'
            ruleSrcPortValue2Input.className = 'form-control ruleSrcPortValue2'
            ruleSrcPortValue2Input.type = 'text'
            if (rules[i].srcPort !== null && ruleSrcOperationCurrent.textContent !== 'Range') {
                ruleSrcPortValue2Input.style.visibility = 'hidden'
            }
            if (rules[i].srcPort !== null && ruleSrcOperationCurrent.textContent === 'Range') {
                ruleSrcPortValue2Input.value = rules[i].srcPort.value2
            }
            if (rules[i].srcPort === null && ruleSrcOperationCurrent.textContent === 'Range') {
                ruleSrcPortValue2Input.value = '65535'
            }
            ruleSrcPortValue2Div.appendChild(ruleSrcPortValue2Input)
            ruleSrcPortValue2.appendChild(ruleSrcPortValue2Div)


            let ruleDstIP = document.createElement('td')
            ruleDstIP.style.width = '12em'
            let ruleDstIPDiv = document.createElement('div')
            let ruleDstIPInput = document.createElement('input')
            ruleDstIPInput.id = row.id + 'ruleDstIPInput'
            ruleDstIPInput.className = 'form-control aclRuleDstIp'
            ruleDstIPInput.type = 'text'
            ruleDstIPInput.value = rules[i].dstIP
            ruleDstIPDiv.appendChild(ruleDstIPInput)
            ruleDstIP.appendChild(ruleDstIPDiv)


            let ruleDstPortOperation = document.createElement('td')
            ruleDstPortOperation.style.width = '8em'
            let ruleDstPortOperationDiv = document.createElement('div')
            let ruleDstPortOperationSelect = document.createElement('select')
            ruleDstPortOperationSelect.id = row.id + 'ruleDstPortOperationSelect'
            ruleDstPortOperationSelect.className = 'form-select table-select aclRuleDstPortOp'
            let ruleDstOperationCurrent = document.createElement('option')
            ruleDstOperationCurrent.textContent = 'Range'
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
            ruleDstPortOperationSelect.addEventListener('change', function(event) {
                if (event.target.value !== 'Range') {
                    ruleDstPortValue2Input.style.visibility = 'hidden'
                } else {
                    ruleDstPortValue2Input.style.visibility = 'visible'
                }
            })
            ruleDstPortOperationDiv.appendChild(ruleDstPortOperationSelect)
            ruleDstPortOperation.appendChild(ruleDstPortOperationDiv)


            let ruleDstPortValue1 = document.createElement('td')
            ruleDstPortValue1.style.width = '6em'
            let ruleDstPortValue1Div = document.createElement('div')
            let ruleDstPortValue1Input = document.createElement('input')
            ruleDstPortValue1Input.id = row.id + 'ruleDstPortValue1Input'
            ruleDstPortValue1Input.className = 'form-control ruleDstPortValue1'
            ruleDstPortValue1Input.type = 'text'
            if (rules[i].dstPort !== null) {
                ruleDstPortValue1Input.value = rules[i].dstPort.value1
            } else {
                ruleDstPortValue1Input.value = '1'
            }
            ruleDstPortValue1Div.appendChild(ruleDstPortValue1Input)
            ruleDstPortValue1.appendChild(ruleDstPortValue1Div)


            let ruleDstPortValue2 = document.createElement('td')
            ruleDstPortValue2.style.width = '6em'
            let ruleDstPortValue2Div = document.createElement('div')
            let ruleDstPortValue2Input = document.createElement('input')
            ruleDstPortValue2Input.id = row.id + 'ruleDstPortValue2Input'
            ruleDstPortValue2Input.className = 'form-control ruleDstPortValue2'
            ruleDstPortValue2Input.type = 'text'
            if (rules[i].dstPort !== null && ruleDstOperationCurrent.textContent !== 'Range') {
                ruleDstPortValue2Input.style.visibility = 'hidden'
            }
            if (rules[i].dstPort !== null && ruleDstOperationCurrent.textContent === 'Range') {
                ruleDstPortValue2Input.value = rules[i].dstPort.value2
            }
            if (rules[i].dstPort === null && ruleDstOperationCurrent.textContent === 'Range') {
                ruleDstPortValue2Input.value = '65535'
            }
            ruleDstPortValue2Div.appendChild(ruleDstPortValue2Input)
            ruleDstPortValue2.appendChild(ruleDstPortValue2Div)

            let addRuleBefore = document.createElement('td')
            addRuleBefore.style.width = ' 7em'
            let addRuleBeforeDiv = document.createElement('div')
            let  addRuleBeforeButton = document.createElement('button')
             addRuleBeforeButton.textContent = 'Add before'
             addRuleBeforeButton.className = 'btn btn-success before'
             addRuleBeforeButton.style.width = ' 7em'
             addRuleBeforeButton.addEventListener('click', addRuleBeforeFunction)
            addRuleBeforeDiv.appendChild(addRuleBeforeButton)
            addRuleBefore.appendChild(addRuleBeforeDiv)

            let addRuleAfter = document.createElement('td')
            addRuleAfter.style.width = ' 7em'
            let addRuleAfterDiv = document.createElement('div')
            let addRuleAfterButton = document.createElement('button')
            addRuleAfterButton.textContent = 'Add after'
            addRuleAfterButton.className = 'btn btn-success after'
            addRuleAfterButton.style.width = ' 7em'
            addRuleAfterButton.addEventListener('click', addRuleAfterFunction)
            addRuleAfterDiv.appendChild(addRuleAfterButton)
            addRuleAfter.appendChild(addRuleAfterDiv)

            let removeRule = document.createElement('td')
            removeRule.style.width = ' 7em'
            let removeRuleDiv = document.createElement('div')
            let removeRuleButton = document.createElement('button')
            removeRuleButton.className = 'btn btn-danger'
            removeRuleButton.style.width = ' 7em'
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
            row.appendChild(addRuleBefore)
            row.appendChild(addRuleAfter)
            row.appendChild(removeRule)
            aclRuleTable.appendChild(row)
        }
    }

}