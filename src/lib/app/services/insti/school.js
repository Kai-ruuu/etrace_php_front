import { apiPath, onCall } from "$lib/app/utils/api";

export class SchoolService {
    static async create(school, onSuccess, onFail) {
        try {
            const res = await fetch(apiPath(("/api/schools")), {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(school)
            });
            const data = await res.json();

            await onCall(res, data, onSuccess, onFail);
        } catch (err) {
            console.error(err);
        }
    }

    static async all(onSuccess, onFail) {
        try {
            const res = await fetch(apiPath("/api/schools"), {
                credentials: "include",
                headers: { "Content-Type": "application/json" }
            });
            const data = await res.json();

            await onCall(res, data, onSuccess, onFail);
        } catch (err) {
            console.error(err);
        }
    }

    static async allActive(onSuccess, onFail) {
        try {
            const res = await fetch(apiPath("/api/schools/active"), { credentials: "include" });
            const data = await res.json();

            await onCall(res, data, onSuccess, onFail);
        } catch (err) {
            console.error(err);
        }
    }

    static async all(onSuccess, onFail) {
        try {
            const res = await fetch(apiPath("/api/schools"), {
                credentials: "include",
                headers: { "Content-Type": "application/json" }
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
            archived = false
        } = {}
    ) {
        page = Math.max(1, page);
        perPage = Math.min(100, Math.max(20, perPage));
        
        try {
            const res = await fetch(apiPath(`/api/schools/search?q=${q}&page=${page}&per_page=${perPage}&archived=${archived}`), {
                credentials: "include",
                headers: { "Content-Type": "application/json" }
            });
            const data = await res.json();

            await onCall(res, data, onSuccess, onFail);
        } catch (err) {
            console.error(err);
        }
    }

    static async rename(school, onSuccess, onFail) {
        try {
            const res = await fetch(apiPath(`/api/schools/${school.id}/rename`), {
                method: "PATCH",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(school)
            });
            const data = await res.json();
    
            await onCall(res, data, onSuccess, onFail);
        } catch (err) {
            console.error(err);
        }
    }

    static async archive(school, onSuccess, onFail) {
        try {
            const res = await fetch(apiPath(`/api/schools/${school.id}/archive`), {
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

    static async restore(school, onSuccess, onFail) {
        try {
            const res = await fetch(apiPath(`/api/schools/${school.id}/restore`), {
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