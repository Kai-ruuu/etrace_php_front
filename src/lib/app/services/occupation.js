import { apiPath, onCall } from "$lib/app/utils/api";

export class OccupationService {
    static async all(onSuccess, onFail) {
        try {
            const res = await fetch(apiPath("/api/occupations"));
            const data = await res.json();

            await onCall(res, data, onSuccess, onFail);
        } catch (err) {
            console.error(err);
        }
    }
};