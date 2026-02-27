import { apiPath, onCall } from "$lib/app/utils/api";

export class CourseService {
    static async create(course, onSuccess, onFail) {
        try {
            const res = await fetch(apiPath("/api/courses"), {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(course)
            });
            const data = await res.json();
            onCall(res, data, onSuccess, onFail);
        } catch (err) {
            console.error(err);
        }
    }

    static async all(onSuccess, onFail) {
        try {
            const res = await fetch(apiPath("/api/courses"), {
                credentials: "include",
                headers: { "Content-Type": "application/json" }
            });
            const data = await res.json();

            await onCall(res, data, onSuccess, onFail);
        } catch (err) {
            console.error(err);
        }
    }

    static async allFromSchool(onSuccess, onFail) {
        try {
            const res = await fetch(apiPath("/api/courses/from-school"), {
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
            const res = await fetch(apiPath(`/api/courses/search?q=${q}&page=${page}&per_page=${perPage}&archived=${archived}`), {
                credentials: "include",
                headers: { "Content-Type": "application/json" }
            });
            const data = await res.json();

            await onCall(res, data, onSuccess, onFail);
        } catch (err) {
            console.error(err);
        }
    }

    static async searchOccupations(
        q = "",
        {
            onSuccess = null,
            onFail = null,
            page = 1,
            perPage = 20,
            courseId = 0,
            aligned = false
        } = {}
    ) {
        page = Math.max(1, page);
        perPage = Math.min(100, Math.max(20, perPage));
        
        try {
            const res = await fetch(apiPath(`/api/courses/search-occupations?q=${q}&page=${page}&per_page=${perPage}&course_id=${courseId}&aligned=${aligned}`), {
                credentials: "include",
                headers: { "Content-Type": "application/json" }
            });
            const data = await res.json();

            await onCall(res, data, onSuccess, onFail);
        } catch (err) {
            console.error(err);
        }
    }

    static async edit(course, onSuccess, onFail) {
        try {
            const res = await fetch(apiPath(`/api/courses/${course.id}/edit`), {
                method: "PATCH",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(course)
            });
            const data = await res.json();
    
            await onCall(res, data, onSuccess, onFail);
        } catch (err) {
            console.error(err);
        }
    }

    static async archive(course, onSuccess, onFail) {
        try {
            const res = await fetch(apiPath(`/api/courses/${course.id}/archive`), {
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

    static async restore(course, onSuccess, onFail) {
        try {
            const res = await fetch(apiPath(`/api/courses/${course.id}/restore`), {
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

    static async alignOccupation(courseId, occupationId, onSuccess, onFail) {
        try {
            const res = await fetch(apiPath(`/api/courses/align-occupation?course_id=${courseId}&occupation_id=${occupationId}`), {
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

    static async unalignOccupation(courseId, occupationId, onSuccess, onFail) {
        try {
            const res = await fetch(apiPath(`/api/courses/unalign-occupation?course_id=${courseId}&occupation_id=${occupationId}`), {
                method: "DELETE",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
            });
            const data = await res.json();
    
            await onCall(res, data, onSuccess, onFail);
        } catch (err) {
            console.error(err);
        }
    }
};