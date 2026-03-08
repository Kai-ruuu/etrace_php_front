const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
export const API_BASE_URL = `http://${hostname}:8000`;

export const ROLE = {
    sysad: {
        value: "sysad",
        display: "System Administrator"
    },
    dean: {
        value: "dean",
        display: "Dean"
    },
    pstaff: {
        value: "pstaff",
        display: "PESO Staff" 
    },
    company: {
        value: "company",
        display: "Company"
    },
    alumni: {
        value: "alumni",
        display: "Alumni"
    },
};