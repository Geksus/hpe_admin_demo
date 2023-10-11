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

function addRuleListeners() {
    let addButtons = document.getElementsByClassName('btn-success');  // replace 'addButton' with your actual button's class
    for (let i = 0; i < addButtons.length; i++) {
        addButtons[i].addEventListener('click', addRow);
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

function addRow(event) {
    let target = event.target;
    let currentRow = target.parentElement.parentElement.parentElement;  // assuming the structure is button -> td -> tr

    // Clone the row
    let newRow = currentRow.cloneNode(true);

    // Insert the cloned row after the current row
    currentRow.parentNode.insertBefore(newRow, currentRow.nextSibling);
    addRuleListeners()
    removeRuleListeners()
}

window.onload = function () {
    adjustWidth()
}