connectButton.addEventListener('click', function () {
    getPortInfoFull(connectIp.value, connectUsername.value, connectPassword.value, connectPort.value)
        .then(() => {
            // this code will be executed once the request has completed successfully
            console.log('Request completed successfully!');
        })
});

// saveButton.addEventListener('click', function () {
//     setPortConfig(connectIp.value, connectUsername.value, connectPassword.value, connectPort.value)
//         .then(() => {
//             // this code will be executed once the request has completed successfully
//             console.log('Request completed successfully!');
//         })
// });

connectPort.addEventListener('keyup', function (event) {
    if (event.key === "Enter") {
        getPortInfoFull(connectIp.value, connectUsername.value, connectPassword.value, connectPort.value)
            .then(() => {
                // this code will be executed once the request has completed successfully
                console.log('Request completed successfully!');
            })
    }
});

// let broadcastUnit = document.getElementById('broadcastUnit')
// let multicastUnit = document.getElementById('multicastUnit')
// let unicastUnit = document.getElementById('unicastUnit')
// broadcastUnit.addEventListener("change", function () {
//     // Get the selected value
//     let selectedValue = this.value;
//
//     // Set the values of other select elements
//     multicastUnit.value = selectedValue;
//     unicastUnit.value = selectedValue;
// });
//
// multicastUnit.addEventListener("change", function () {
//     // Get the selected value
//     let selectedValue = this.value;
//
//     // Set the values of other select elements
//     broadcastUnit.value = selectedValue;
//     unicastUnit.value = selectedValue;
// });
//
// unicastUnit.addEventListener("change", function () {
//     // Get the selected value
//     let selectedValue = this.value;
//
//     // Set the values of other select elements
//     multicastUnit.value = selectedValue;
//     broadcastUnit.value = selectedValue;
// });

// let addTaggedVlanButton = document.getElementById('addTaggedVlanButton')
// addTaggedVlanButton.addEventListener("click", function (event) {
//     addTaggedVlanHandler(event)
// })
