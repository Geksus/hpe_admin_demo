// ipv4BlockMail

const ipv4BlockMailRules = [
    {
        action: 'Deny',
        protocol: 'TCP',
        srcIP: '0.0.0.0/0',
        srcPort: {
            operation: 'Equal',
            value1: 25
        },
        dstIP: '0.0.0.0/0',
        dstPort: null
    },
    {
        action: 'Deny',
        protocol: 'TCP',
        srcIP: '0.0.0.0/0',
        srcPort: null,
        dstIP: '0.0.0.0/0',
        dstPort: {
            operation: 'Equal',
            value1: 25
        }
    },
    {
        action: 'Deny',
        protocol: 'TCP',
        srcIP: '0.0.0.0/0',
        srcPort: {
            operation: 'Equal',
            value1: 465
        },
        dstIP: '0.0.0.0/0',
        dstPort: null
    },
    {
        action: 'Deny',
        protocol: 'TCP',
        srcIP: '0.0.0.0/0',
        srcPort: null,
        dstIP: '0.0.0.0/0',
        dstPort: {
            operation: 'Equal',
            value1: 465
        }
    },
    {
        action: 'Deny',
        protocol: 'TCP',
        srcIP: '0.0.0.0/0',
        srcPort: {
            operation: 'Equal',
            value1: 587
        },
        dstIP: '0.0.0.0/0',
        dstPort: null
    },
    {
        action: 'Deny',
        protocol: 'TCP',
        srcIP: '0.0.0.0/0',
        srcPort: null,
        dstIP: '0.0.0.0/0',
        dstPort: {
            operation: 'Equal',
            value1: 587
        }
    },
    {
        
        action: 'Permit',
        protocol: 'Any',
        srcIP: '0.0.0.0/0',
        srcPort: null,
        dstIP: '0.0.0.0/0',
        dstPort: null
    }
]

const blockAllExceptHttp = [
    {
        action: "Permit",
        protocol: "TCP",
        srcIP: "0.0.0.0/0",
        srcPort: null,
        dstIP: "0.0.0.0/0",
        dstPort: {
            operation: "Equal",
            value1: 80
        }
    },
    {
        action: "Permit",
        protocol: "TCP",
        srcIP: "0.0.0.0/0",
        srcPort: null,
        dstIP: "0.0.0.0/0",
        dstPort: {
            operation: "Equal",
            value1: 443
        }
    },
    {
        ruleID: 1000,
        action: "Deny",
        protocol: 'Any',
        srcIP: "0.0.0.0/0",
        srcPort: null,
        dstIP: "0.0.0.0/0",
        dstPort: null
    }
]