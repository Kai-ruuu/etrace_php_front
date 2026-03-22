import { apiPath, onCall } from "$lib/app/utils/api";

export class AlumniService {
    static async create(alumni, onSuccess, onFail) {
        try {
            const res = await fetch(apiPath("/api/users/alumni"), {
                method: "POST",
                credentials: "include",
                body: alumni
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
            verStatus = "Pending",
            courseId = 0,
        } = {}
    ) {
        page = Math.max(1, page);
        perPage = Math.min(100, Math.max(20, perPage));
        
        try {
            const res = await fetch(
                apiPath(`/api/users/alumni/search?q=${q}&page=${page}&per_page=${perPage}&enabled=${enabled}&ver_status=${verStatus}&course_id=${courseId}`),
                { credentials: "include" }
            );
            const data = await res.json();

            await onCall(res, data, onSuccess, onFail);
        } catch (err) {
            console.error(err);
        }
    }

    static async pend(alumni, onSuccess, onFail) {
        try {
            const res = await fetch(apiPath(`/api/users/alumni/${alumni.profile.id}/pend`), {
                method: "PATCH",
                credentials: "include"
            });
            const data = await res.json();

            await onCall(res, data, onSuccess, onFail);
        } catch (err) {
            console.error(err);
        }
    }

    static async verify(alumni, onSuccess, onFail) {
        try {
            const res = await fetch(apiPath(`/api/users/alumni/${alumni.profile.id}/verify`), {
                method: "PATCH",
                credentials: "include"
            });
            const data = await res.json();

            await onCall(res, data, onSuccess, onFail);
        } catch (err) {
            console.error(err);
        }
    }

    static async reject(alumni, message, onSuccess, onFail) {
        try {
            const res = await fetch(apiPath(`/api/users/alumni/${alumni.profile.id}/reject`), {
                method: "PATCH",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message })
            });
            const data = await res.json();

            await onCall(res, data, onSuccess, onFail);
        } catch (err) {
            console.error(err);
        }
    }

    static async getRejectionAppeals(alumni, onSuccess, onFail) {
        try {
            let url = `/api/users/alumni/${alumni.profile.id}/rejection-appeals`;
            const res = await fetch(apiPath(url), { credentials: "include" });
            const data = await res.json();

            await onCall(res, data, onSuccess, onFail);
        } catch (err) {
            console.error(err);
        }
    }

    static async writeRejectionAppeal(appeal, onSuccess, onFail) {
        try {
            const res = await fetch(apiPath("/api/users/alumni/rejection-appeal"), {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(appeal)
            });
            const data = await res.json();

            await onCall(res, data, onSuccess, onFail);
        } catch (err) {
            console.error(err);
        }
    }

    static async searchJobPosts(
        q = "",
        {
            onSuccess = null,
            onFail = null,
            page = 1,
            perPage = 1
        } = {}
    ) {
        page = Math.max(1, page);
        perPage = Math.min(100, Math.max(20, perPage));
        
        try {
            const url = apiPath(`/api/users/alumni/posts/search?q=${q}&page=${page}&per_page=${perPage}`);
            const res = await fetch(url,  { credentials: "include" });
            const data = await res.json();

            await onCall(res, data, onSuccess, onFail);
        } catch (err) {
            console.error(err);
        }
    }

    static async submitCv(jobPostId, onSuccess, onFail) {
        try {
            const res = await fetch(apiPath(`/api/users/company/posts/${jobPostId}/submit-cv`), {
                method: "POST",
                credentials: "include"
            });
            const data = await res.json();

            await onCall(res, data, onSuccess, onFail);
        } catch (err) {
            console.error(err);
        }
    }
    
    static async cancelCvSubmission(jobPostId, onSuccess, onFail) {
        try {
            const res = await fetch(apiPath(`/api/users/company/posts/${jobPostId}/delete-cv`), {
                method: "DELETE",
                credentials: "include"
            });
            const data = await res.json();

            await onCall(res, data, onSuccess, onFail);
        } catch (err) {
            console.error(err);
        }
    }

    static async getCvSubmissions(onSuccess, onFail) {
        try {
            const res = await fetch(apiPath("/api/users/company/posts/my-cvs"), { credentials: "include" });
            const data = await res.json();

            await onCall(res, data, onSuccess, onFail);
        } catch (err) {
            console.error(err);
        }
    }

    static async like(jobPostId, onSuccess, onFail) {
        try {
            const res = await fetch(apiPath(`/api/users/company/posts/${jobPostId}/like`), {
                method: "POST",
                credentials: "include"
            });
            const data = await res.json();

            await onCall(res, data, onSuccess, onFail);
        } catch (err) {
            console.error(err);
        }
    }

    static async dislike(jobPostId, onSuccess, onFail) {
        try {
            const res = await fetch(apiPath(`/api/users/company/posts/${jobPostId}/dislike`), {
                method: "DELETE",
                credentials: "include"
            });
            const data = await res.json();

            await onCall(res, data, onSuccess, onFail);
        } catch (err) {
            console.error(err);
        }
    }

    static async getPostLikes(onSuccess, onFail) {
        try {
            const res = await fetch(apiPath("/api/users/company/posts/my-likes"), { credentials: "include" });
            const data = await res.json();

            await onCall(res, data, onSuccess, onFail);
        } catch (err) {
            console.error(err);
        }
    }

    static async disable(alumni, onSuccess, onFail) {
        try {
            const res = await fetch(apiPath(`/api/users/alumni/${alumni.id}/disable`), {
                method: "PATCH",
                credentials: "include",
            });
            const data = await res.json();

            await onCall(res, data, onSuccess, onFail);
        } catch (err) {
            console.error(err);
        }
    }

    static async enable(alumni, onSuccess, onFail) {
        try {
            const res = await fetch(apiPath(`/api/users/alumni/${alumni.id}/enable`), {
                method: "PATCH",
                credentials: "include",
            });
            const data = await res.json();

            await onCall(res, data, onSuccess, onFail);
        } catch (err) {
            console.error(err);
        }
    }
}