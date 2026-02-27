import { goto } from "$app/navigation";
import { API_BASE_URL, ROLE } from "../core/constants";

export function apiPath(path) {
    return API_BASE_URL + path;
}

export async function onCall(res, data, onSuccess, onFail) {
    if (res.ok) {
        if (onSuccess !== undefined && onSuccess !== null) {
            await onSuccess(data, res.status);
        }
    } else {
        if (onFail !== undefined && onFail !== null) {
            await onFail(data, res.status);
        }
    }
}

export function goToDashboard(role) {
    switch (role) {
        case ROLE.sysad.value:
            goto("/users/sysad");
            break;
        case ROLE.dean.value:
            goto("/users/dean");
            break;
        case ROLE.pstaff.value:
            goto("/users/pstaff");
            break;
        case ROLE.company.value:
            goto("/users/company");
            break;
        case ROLE.alumni.value:
            goto("/users/alumni");
            break;
    }
}