import { ROLE } from "../core/constants";

export function getDisplayRole(role) {
    return {
        sysad: ROLE.sysad.display,
        dean: ROLE.dean.display,
        pstaff: ROLE.pstaff.display,
        company: ROLE.company.display,
        alumni: ROLE.alumni.display,
    }[role];
}