import { apiPath, onCall } from "$lib/app/utils/api";

export class RecordService {
    static async create(record, onSuccess, onFail) {
        const formData = new FormData();

        // add proper validation later
        formData.append("course_id", record.course_id);
        formData.append("graduate_record", record.graduate_record);
        
        try {
            const res = await fetch(apiPath(("/api/records")), {
                method: "POST",
                credentials: "include",
                body: formData
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
            archived = false,
            courseId = 0
        } = {}
    ) {
        page = Math.max(1, page);
        perPage = Math.min(100, Math.max(20, perPage));

        try {
            const res = await fetch(apiPath(`/api/records/search?q=${q}&page=${page}&per_page=${perPage}&archived=${archived}&course_id=${courseId}`), {
                credentials: "include",
                headers: { "Content-Type": "application/json" }
            });
            const data = await res.json();

            await onCall(res, data, onSuccess, onFail);
        } catch (err) {
            console.error(err);
        }
    }

    static async archive(record, onSuccess, onFail) {
        try {
            const res = await fetch(apiPath(`/api/records/${record.id}/archive`), {
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

    static async restore(record, onSuccess, onFail) {
        try {
            const res = await fetch(apiPath(`/api/records/${record.id}/restore`), {
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