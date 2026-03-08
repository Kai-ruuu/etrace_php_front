import { apiPath, onCall } from "$lib/app/utils/api";

export class PlatformService {
    static async all(onSuccess, onFail) {
        try {
            const res = await fetch(apiPath(`/api/platforms`), { credentials: "include" });
            const data = await res.json();
            await onCall(res, data, onSuccess, onFail);
        } catch (err) {
            console.error(err);
        }
    }
}