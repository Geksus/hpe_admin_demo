async function removeAclRules(ip, username, password, name, type, rules) {
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
                    method: 'comware.RemoveACLRules',
                    params: {
                        target: {
                            ip: ip,
                            username: username,
                            password: password,
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
}