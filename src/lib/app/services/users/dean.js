import { apiPath, onCall } from "$lib/app/utils/api";

export class DeanService {
    static async create(dean, onSuccess, onFail) {
        try {
            const res = await fetch(apiPath("/api/users/dean"), {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dean)
            });
            const data = await res.json();

            await onCall(res, data, onSuccess, onFail);
        } catch (err) {
            console.error(err);
        }
    }

    static async search(
        q = "",
        {
            onSuccess = null,
            onFail = null,
            page = 1,
            perPage = 20,
            enabled = true,
            schoolId = 0
        } = {}
    ) {
        page = Math.max(1, page);
        perPage = Math.min(100, Math.max(20, perPage));
        
        try {
            const res = await fetch(apiPath(`/api/users/dean/search?q=${q}&page=${page}&per_page=${perPage}&enabled=${enabled}&school_id=${schoolId}`), {
                credentials: "include",
                headers: { "Content-Type": "application/json" }
            });
            const data = await res.json();

            await onCall(res, data, onSuccess, onFail);
        } catch (err) {
            console.error(err);
        }
    }

    static async updateProfile(deanProfile, onSuccess, onFail) {
        try {
            const res = await fetch(apiPath("/api/users/profiles/dean"), {
                method: "PATCH",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(deanProfile)
            });
            const data = await res.json();

            await onCall(res, data, onSuccess, onFail);
        } catch (err) {
            console.error(err);
        }
    }

    static async disable(dean, onSuccess, onFail) {
        try {
            const res = await fetch(apiPath(`/api/users/dean/${dean.id}/disable`), {
                method: "PATCH",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
            });
            const data = await res.json();

            await onCall(res, data, onSuccess, onFail);
        } catch (err) {
            console.error(err);
        }
    }

    static async enable(dean, onSuccess, onFail) {
        try {
            const res = await fetch(apiPath(`/api/users/dean/${dean.id}/enable`), {
                method: "PATCH",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
            });
            const data = await res.json();

            await onCall(res, data, onSuccess, onFail);
        } catch (err) {
            console.error(err);
        }
    }
}