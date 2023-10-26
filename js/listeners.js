connectButton.addEventListener('click', function () {
    getPortInfoFull(connectIp.value, connectUsername.value, connectPassword.value, connectPort.value)
        .then(() => {
            // this code will be executed once the request has completed successfully
            console.log('Request completed successfully!');
        })
});

saveButton.addEventListener('click', function () {
    setPortConfig(connectIp.value, connectUsername.value, connectPassword.value, connectPort.value)
        .then(() => {
            // this code will be executed once the request has completed successfully
            console.log('Save completed successfully!');
        })
});

connectPort.addEventListener('keyup', function (event) {
    if (event.key === "Enter") {
        getPortInfoFull(connectIp.value, connectUsername.value, connectPassword.value, connectPort.value)
            .then(() => {
                // this code will be executed once the request has completed successfully
                console.log('Request completed successfully!');
            })
    }
});

saveAcl.addEventListener('click', function () {
    addAclRules(connectIp.value, connectUsername.value, connectPassword.value, aclType, aclName)
        .then(() => {
            // this code will be executed once the request has completed successfully
            console.log('Save completed successfully!');
        })
});
