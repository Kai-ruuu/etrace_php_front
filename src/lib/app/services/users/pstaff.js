import { apiPath, onCall } from "$lib/app/utils/api";

export class PstaffService {
    static async create(pstaff, onSuccess, onFail) {
        try {
            const res = await fetch(apiPath("/api/users/pstaff"), {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(pstaff)
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
            const res = await fetch(apiPath(`/api/users/pstaff/search?q=${q}&page=${page}&per_page=${perPage}&enabled=${enabled}`), {
                credentials: "include",
                headers: { "Content-Type": "application/json" }
            });
            const data = await res.json();

            await onCall(res, data, onSuccess, onFail);
        } catch (err) {
            console.error(err);
        }
    }

    static async updateProfile(pstaffProfile, onSuccess, onFail) {
        try {
            const res = await fetch(apiPath("/api/users/profiles/pstaff"), {
                method: "PATCH",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(pstaffProfile)
            });
            const data = await res.json();

            await onCall(res, data, onSuccess, onFail);
        } catch (err) {
            console.error(err);
        }
    }

    static async disable(pstaff, onSuccess, onFail) {
        try {
            const res = await fetch(apiPath(`/api/users/pstaff/${pstaff.id}/disable`), {
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

    static async enable(pstaff, onSuccess, onFail) {
        try {
            const res = await fetch(apiPath(`/api/users/pstaff/${pstaff.id}/enable`), {
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