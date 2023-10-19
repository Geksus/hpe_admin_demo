function isValidIP(ipaddress) {
    // Regular expression for IP validation
    let ipformat = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

    return !!ipaddress.match(ipformat);
}

function isValidCIDR(cidr) {
    // Regular expression for CIDR validation
    let cidrFormat = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\/([0-9]|[1-2][0-9]|3[0-2])$/;

    return !!cidr.match(cidrFormat);
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

function nowYouSeeMe() {
    const loaders = document.getElementsByClassName('spinner-border')
    const classes = ['mb-3', 'input-group', 'table', 'nav-link', 'btn']
    for (let group of classes) {
        let classGroup = document.getElementsByClassName(group)
        for (let element of classGroup) {
            element.style.visibility = 'hidden'
        }
    }
    for (let loader of loaders) {
        loader.style.visibility = 'visible'
    }
}

function nowYouDont() {
    const loaders = document.getElementsByClassName('spinner-border')
    const classes = ['mb-3', 'input-group', 'table', 'nav-link', 'btn']
    for (let group of classes) {
        let classGroup = document.getElementsByClassName(group)
        for (let element of classGroup) {
            element.style.visibility = 'visible'
        }
    }
    for (let loader of loaders) {
        loader.style.visibility = 'hidden'
    }
}

function addRuleAfterListeners() {
    let addButtons = document.getElementsByClassName('after');  // replace 'addButton' with your actual button's class
    for (let i = 0; i < addButtons.length; i++) {
        addButtons[i].addEventListener('click', addRuleAfterFunction);
    }
}

function addRuleBeforeListeners() {
    let addButtons = document.getElementsByClassName('before');  // replace 'addButton' with your actual button's class
    for (let i = 0; i < addButtons.length; i++) {
        addButtons[i].addEventListener('click', addRuleBeforeFunction);
    }
}

function removeRuleListeners() {
    let removeButtons = document.getElementsByClassName('btn-danger')
    for (let i = 0; i < removeButtons.length; i++) {
        removeButtons[i].addEventListener('click', removeRow)
    }
}

function removeRow(event) {
    let target = event.target;
    let currentRow = target.parentElement.parentElement.parentElement;  // assuming the structure is button -> td -> tr

    currentRow.remove()
}

function addRuleAfterFunction(event) {
    let target = event.target;
    let currentRow = target.parentElement.parentElement.parentElement;  // assuming the structure is button -> td -> tr

    // Clone the row
    let newRow = currentRow.cloneNode(true);
    newRow.id = rowIdCreator() + 1
    aclDefaultRule(newRow)

    // Insert the cloned row after the current row
    currentRow.parentNode.insertBefore(newRow, currentRow.nextSibling);
    addRuleAfterListeners()
    addRuleBeforeListeners()
    removeRuleListeners()
}

function addRuleBeforeFunction(event) {
    let target = event.target;
    let currentRow = target.parentElement.parentElement.parentElement;  // assuming the structure is button -> td -> tr

    // Clone the row
    let newRow = currentRow.cloneNode(true);
    newRow.id = rowIdCreator() + 1
    aclDefaultRule(newRow)

    // Insert the cloned row after the current row
    currentRow.parentNode.insertBefore(newRow, currentRow);
    addRuleAfterListeners()
    addRuleBeforeListeners()
    removeRuleListeners()
}

function addNewRule() {
    let aclRuleTable = document.getElementById('aclRuleTable')
    let row = document.createElement('tr')
    row.id = '0'
    if (aclRulesIds.length > 0) {
        row.id = rowIdCreator() + 1
    }
    row.className = 'ruleRow'


    let ruleNumber = document.createElement('td')
    ruleNumber.style.width = '5em'
    let ruleNumberDiv = document.createElement('div')
    let ruleNumberInput = document.createElement('input')
    ruleNumberInput.id = row.id + 'ruleNumberInput'
    ruleNumberInput.className = 'form-control acRuleNumber'
    ruleNumberInput.type = 'text'
    aclRulesIds.push(parseInt(ruleNumberInput.value))
    ruleNumberDiv.appendChild(ruleNumberInput)
    ruleNumber.appendChild(ruleNumberDiv)


    let ruleAction = document.createElement('td')
    ruleAction.style.width = '8em'
    let ruleActionDiv = document.createElement('div')
    let ruleActionSelect = document.createElement('select')
    ruleActionSelect.className = 'form-select table-select aclRuleAction'
    ruleActionSelect.id = row.id + 'ruleActionSelect'
    let ruleActionCurrent = document.createElement('option')
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
    ruleProtocolDiv.appendChild(ruleProtocolSelect)
    ruleProtocol.appendChild(ruleProtocolDiv)


    let ruleSrcIP = document.createElement('td')
    ruleSrcIP.style.width = '12em'
    let ruleSrcIPDiv = document.createElement('div')
    let ruleSrcIPInput = document.createElement('input')
    ruleSrcIPInput.id = row.id + 'ruleSrcIPInput'
    ruleSrcIPInput.className = 'form-control aclRuleSrcIp'
    ruleSrcIPInput.type = 'text'
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

    ruleSrcPortOperationDiv.appendChild(ruleSrcPortOperationSelect)
    ruleSrcPortOperation.appendChild(ruleSrcPortOperationDiv)


    let ruleSrcPortValue1 = document.createElement('td')
    ruleSrcPortValue1.style.width = '6em'
    let ruleSrcPortValue1Div = document.createElement('div')
    let ruleSrcPortValue1Input = document.createElement('input')
    ruleSrcPortValue1Input.id = row.id + 'ruleSrcPortValue1Input'
    ruleSrcPortValue1Input.className = 'form-control ruleSrcPortValue1'
    ruleSrcPortValue1Input.type = 'text'

    ruleSrcPortValue1Div.appendChild(ruleSrcPortValue1Input)
    ruleSrcPortValue1.appendChild(ruleSrcPortValue1Div)


    let ruleSrcPortValue2 = document.createElement('td')
    ruleSrcPortValue2.style.width = '6em'
    let ruleSrcPortValue2Div = document.createElement('div')
    let ruleSrcPortValue2Input = document.createElement('input')
    ruleSrcPortValue2Input.id = row.id + 'ruleSrcPortValue2Input'
    ruleSrcPortValue2Input.className = 'form-control ruleSrcPortValue2'
    ruleSrcPortValue2Input.type = 'text'

    ruleSrcPortValue2Div.appendChild(ruleSrcPortValue2Input)
    ruleSrcPortValue2.appendChild(ruleSrcPortValue2Div)


    let ruleDstIP = document.createElement('td')
    ruleDstIP.style.width = '12em'
    let ruleDstIPDiv = document.createElement('div')
    let ruleDstIPInput = document.createElement('input')
    ruleDstIPInput.id = row.id + 'ruleDstIPInput'
    ruleDstIPInput.className = 'form-control aclRuleDstIp'
    ruleDstIPInput.type = 'text'
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
    ruleDstPortValue1Div.appendChild(ruleDstPortValue1Input)
    ruleDstPortValue1.appendChild(ruleDstPortValue1Div)


    let ruleDstPortValue2 = document.createElement('td')
    ruleDstPortValue2.style.width = '6em'
    let ruleDstPortValue2Div = document.createElement('div')
    let ruleDstPortValue2Input = document.createElement('input')
    ruleDstPortValue2Input.id = row.id + 'ruleDstPortValue2Input'
    ruleDstPortValue2Input.className = 'form-control ruleDstPortValue2'
    ruleDstPortValue2Input.type = 'text'
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

    aclDefaultRule(row)
}

function aclDefaultRule(row) {
    let aclRuleNumber = row.getElementsByClassName('acRuleNumber')
    aclRuleNumber[0].value = ''
    aclRuleNumber[0].id = row.id + 'ruleNumberInput'
    let aclRuleAction = row.getElementsByClassName('aclRuleAction')
    aclRuleAction[0].innerHTML = ''
    aclRuleAction[0].id = row.id + 'ruleActionSelect'
    for (let option of ['Permit', 'Deny']) {
        let action = document.createElement('option')
        action.textContent = option
        aclRuleAction[0].appendChild(action)
    }
    let aclRuleProtocol = row.getElementsByClassName('aclRuleProtocol')
    aclRuleProtocol[0].innerHTML = ''
    aclRuleProtocol[0].id = row.id + 'ruleProtocolSelect'
    for (let option of ["Any", "ICMP", "IGMP", "IP", "TCP", "UDP", "GRE", "IPv6esp", "ICMPv6"]) {
        let protocol = document.createElement('option')
        protocol.textContent = option
        aclRuleProtocol[0].appendChild(protocol)
    }
    let aclRuleSrcIp = row.getElementsByClassName('aclRuleSrcIp')
    aclRuleSrcIp[0].id = row.id + 'ruleSrcIPInput'
    aclRuleSrcIp[0].value = '0.0.0.0/0'
    let aclRuleSrcPortOp = row.getElementsByClassName('aclRuleSrcPortOp')
    aclRuleSrcPortOp[0].innerHTML = ''
    aclRuleSrcPortOp[0].id = row.id + 'ruleSrcPortOperationSelect'
    for (let option of ['Range', 'Equal', 'Less', 'Greater', 'NotEqual']) {
        let operation = document.createElement('option')
        operation.textContent = option
        aclRuleSrcPortOp[0].appendChild(operation)
    }
    aclRuleSrcPortOp[0].addEventListener('change', function(event) {
        if (event.target.value !== 'Range') {
            ruleSrcPortValue2[0].style.visibility = 'hidden'
        } else {
            ruleSrcPortValue2[0].style.visibility = 'visible'
        }
    })
    aclRuleSrcPortOp[0].style.visibility = 'hidden'
    let ruleSrcPortValue1 = row.getElementsByClassName('ruleSrcPortValue1')
    ruleSrcPortValue1[0].id = row.id + 'ruleSrcPortValue1Input'
    ruleSrcPortValue1[0].value = '1'
    ruleSrcPortValue1[0].style.visibility = 'hidden'
    let ruleSrcPortValue2 = row.getElementsByClassName('ruleSrcPortValue2')
    ruleSrcPortValue2[0].id = row.id + 'ruleSrcPortValue2Input'
    ruleSrcPortValue2[0].value = '65535'
    ruleSrcPortValue2[0].style.visibility = 'hidden'
    let aclRuleDstIp = row.getElementsByClassName('aclRuleDstIp')
    aclRuleDstIp[0].id = row.id + 'ruleDstIPInput'
    aclRuleDstIp[0].value = '0.0.0.0/0'
    let aclRuleDstPortOp = row.getElementsByClassName('aclRuleDstPortOp')
    aclRuleDstPortOp[0].innerHTML = ''
    aclRuleDstPortOp[0].id = row.id + 'ruleDstPortOperationSelect'
    for (let option of ['Range', 'Equal', 'Less', 'Greater', 'NotEqual']) {
        let operation = document.createElement('option')
        operation.textContent = option
        aclRuleDstPortOp[0].appendChild(operation)
    }
    aclRuleDstPortOp[0].addEventListener('change', function(event) {
        if (event.target.value !== 'Range') {
            ruleDstPortValue2[0].style.visibility = 'hidden'
        } else {
            ruleDstPortValue2[0].style.visibility = 'visible'
        }
    })
    aclRuleDstPortOp[0].style.visibility = 'hidden'
    let ruleDstPortValue1 = row.getElementsByClassName('ruleDstPortValue1')
    ruleDstPortValue1[0].id = row.id + 'ruleDstPortValue1Input'
    ruleDstPortValue1[0].value = '1'
    ruleDstPortValue1[0].style.visibility = 'hidden'
    let ruleDstPortValue2 = row.getElementsByClassName('ruleDstPortValue2')
    ruleDstPortValue2[0].id = row.id + 'ruleDstPortValue2Input'
    ruleDstPortValue2[0].value = '65535'
    ruleDstPortValue2[0].style.visibility = 'hidden'

    aclRuleProtocol[0].addEventListener('change', function (event) {
        if (event.target.value === 'TCP' || event.target.value === 'UDP') {
            aclRuleSrcPortOp[0].style.visibility = 'visible'
            ruleSrcPortValue1[0].style.visibility = 'visible'
            if (aclRuleSrcPortOp[0].value === 'Range') {
                ruleSrcPortValue2[0].style.visibility = 'visible'
            }
            aclRuleDstPortOp[0].style.visibility = 'visible'
            ruleDstPortValue1[0].style.visibility = 'visible'
            if (aclRuleDstPortOp[0].value === 'Range') {
                ruleDstPortValue2[0].style.visibility = 'visible'
            }
        } else {
            aclRuleSrcPortOp[0].style.visibility = 'hidden'
            ruleSrcPortValue1[0].style.visibility = 'hidden'
            ruleSrcPortValue2[0].style.visibility = 'hidden'
            aclRuleDstPortOp[0].style.visibility = 'hidden'
            ruleDstPortValue1[0].style.visibility = 'hidden'
            ruleDstPortValue2[0].style.visibility = 'hidden'
        }
    })
}

function rowIdCreator() {
    let rows = document.getElementsByClassName('ruleRow')
    let ids = []
    for (let row of rows) {
        ids.push(row.id)
    }
    return Math.max(...ids)
}

window.onload = function () {
    adjustWidth()
}