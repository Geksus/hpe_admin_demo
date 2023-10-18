connectButton.addEventListener('click', function () {
    getPortInfoFull(connectIp, connectUsername, connectPassword, connectPort)
        .then(() => {
            // this code will be executed once the request has completed successfully
            console.log('Request completed successfully!');
        })
});

saveButton.addEventListener('click', function () {
    setPortConfig(connectIp, connectUsername, connectPassword, connectPort.value)
        .then(() => {
            // this code will be executed once the request has completed successfully
            console.log('Save completed successfully!');
        })
});

connectPort.addEventListener('keyup', function (event) {
    if (event.key === "Enter") {
        getPortInfoFull(connectIp, connectUsername, connectPassword, connectPort.value)
            .then(() => {
                // this code will be executed once the request has completed successfully
                console.log('Request completed successfully!');
            })
    }
});

saveAcl.addEventListener('click', function () {
    addAclRules(connectIp, connectUsername, connectPassword, aclType, aclName)
        .then(() => {
            // this code will be executed once the request has completed successfully
            console.log('Save completed successfully!');
        })
});
