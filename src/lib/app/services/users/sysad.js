import { apiPath, onCall } from "$lib/app/utils/api";

export class SysadService {
    static async create(sysad, onSuccess, onFail) {
        try {
            const res = await fetch(apiPath("/api/users/sysad"), {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(sysad)
            });
            const data = await res.json();

            await onCall(res, data, onSuccess, onFail);
        } catch (err) {
            console.error(err);
        }
    }

    static async getAnalytics(onSuccess, onFail) {
        try {
            const res = await fetch(apiPath("/api/analytics"), { credentials: "include" });
            const data = await res.json();

            await onCall(res, data, onSuccess, onFail);
        } catch (err) {
            console.error(err);
        }
    }

    static async downloadCsv() {
        try {
            const res = await fetch(apiPath('/api/analytics/report'), { credentials: 'include' });

            if (!res.ok) throw new Error('Download failed');

            const blob = await res.blob();
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = 'analytics.csv';
            a.click();

            URL.revokeObjectURL(url);
            return true;
        } catch (err) {
            console.error(err);
            return false;
        }
    }

    static async search(
        q = "",
        {
            onSuccess = null,
            onFail = null,
            page = 1,
            perPage = 20,
            enabled = true
        } = {}
    ) {
        page = Math.max(1, page);
        perPage = Math.min(100, Math.max(20, perPage));
        
        try {
            const res = await fetch(apiPath(`/api/users/sysad/search?q=${q}&page=${page}&per_page=${perPage}&enabled=${enabled}`), {
                credentials: "include",
                headers: { "Content-Type": "application/json" }
            });
            const data = await res.json();

            await onCall(res, data, onSuccess, onFail);
        } catch (err) {
            console.error(err);
        }
    }

    static async updateProfile(sysadProfile, onSuccess, onFail) {
        try {
            const res = await fetch(apiPath("/api/users/profiles/sysad"), {
                method: "PATCH",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(sysadProfile)
            });
            const data = await res.json();
            await onCall(res, data, onSuccess, onFail);
        } catch (err) {
            console.error(err);
        }
    }

    static async disable(sysad, onSuccess, onFail) {
        try {
            const res = await fetch(apiPath(`/api/users/sysad/${sysad.id}/disable`), {
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

    static async enable(sysad, onSuccess, onFail) {
        try {
            const res = await fetch(apiPath(`/api/users/sysad/${sysad.id}/enable`), {
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