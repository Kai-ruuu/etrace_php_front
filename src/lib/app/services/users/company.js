import { apiPath, onCall } from "$lib/app/utils/api";

export class CompanyService {
    static async create(company, onSuccess, onFail) {
        try {
            const res = await fetch(apiPath("/api/users/company"), {
                method: "POST",
                credentials: "include",
                body: company
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
            ver_status = "Pending",
            industry = "Technology / IT",
        } = {}
    ) {
        page = Math.max(1, page);
        perPage = Math.min(100, Math.max(20, perPage));
        
        try {
            const res = await fetch(apiPath(`/api/users/company/search?q=${q}&page=${page}&per_page=${perPage}&enabled=${enabled}&ver_status=${ver_status}&industry=${industry}`), {
                credentials: "include",
                headers: { "Content-Type": "application/json" }
            });
            const data = await res.json();

            await onCall(res, data, onSuccess, onFail);
        } catch (err) {
            console.error(err);
        }
    }

    static async disable(company, onSuccess, onFail) {
        try {
            const res = await fetch(apiPath(`/api/users/company/${company.id}/disable`), {
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

    static async enable(company, onSuccess, onFail) {
        try {
            const res = await fetch(apiPath(`/api/users/company/${company.id}/enable`), {
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

    static async pend(company, onSuccess, onFail) {
        try {
            const res = await fetch(apiPath(`/api/users/company/${company.profile.id}/pend`), {
                method: "PATCH",
                credentials: "include"
            });
            const data = await res.json();

            await onCall(res, data, onSuccess, onFail);
        } catch (err) {
            console.error(err);
        }
    }

    static async verify(company, onSuccess, onFail) {
        try {
            const res = await fetch(apiPath(`/api/users/company/${company.profile.id}/verify`), {
                method: "PATCH",
                credentials: "include",
            });
            const data = await res.json();

            await onCall(res, data, onSuccess, onFail);
        } catch (err) {
            console.error(err);
        }
    }

    static async reject(company, message, onSuccess, onFail) {
        try {
            const res = await fetch(apiPath(`/api/users/company/${company.profile.id}/reject`), {
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

    static async approveRequirement(company, requirement_stat, onSuccess, onFail) {
        try {
            const res = await fetch(apiPath("/api/users/company/approve-requirement"), {
                method: "PATCH",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: company.profile.id,
                    requirement_stat
                })
            });
            const data = await res.json();

            await onCall(res, data, onSuccess, onFail);
        } catch (err) {
            console.error(err);
        }
    }

    static async forReviseRequirement(details, onSuccess, onFail) {
        try {
            const res = await fetch(apiPath("/api/users/company/revise-requirement"), {
                method: "PATCH",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    company_id: details.company.profile.id,
                    message: details.message,
                    requirement_stat: details.requirement_stat
                })
            });
            const data = await res.json();

            await onCall(res, data, onSuccess, onFail);
        } catch (err) {
            console.error(err);
        }
    }

    static async getRejectionAppeals(company, onSuccess, onFail, source_role = null) {
        try {
            let url = `/api/users/company/${company.profile.id}/rejection-appeals${source_role ? `?source_role=${source_role}` : ""}`;
            const res = await fetch(apiPath(url), { credentials: "include" });
            const data = await res.json();

            await onCall(res, data, onSuccess, onFail);
        } catch (err) {
            console.error(err);
        }
    }

    static async writeRejectionAppeal(appeal, onSuccess, onFail) {
        try {
            const res = await fetch(apiPath("/api/users/company/rejection-appeal"), {
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

    
    static async getRevisionAppeals(details, onSuccess, onFail) {
        try {
            let url = `/api/users/company/${details.companyId}/revision-appeals?attr_name=${details.attr_name}`;
            const res = await fetch(apiPath(url), { credentials: "include" });
            const data = await res.json();

            await onCall(res, data, onSuccess, onFail);
        } catch (err) {
            console.error(err);
        }
    }

    static async writeRevisionAppeal(appeal, onSuccess, onFail) {
        try {
            const res = await fetch(apiPath("/api/users/company/revision-appeal"), {
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

    static async reupload(upload, onSuccess, onFail) {
        try {
            let formData = new FormData();
            formData.append("key", upload.key);
            formData.append("file", upload.file);
            formData.append("source", upload.source);
            formData.append("display", upload.display);
            
            const res = await fetch(apiPath("/api/users/company/reupload-requirement"), {
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

    static async fetchVacancies(companyId, onSuccess, onFail) {
        try {
            const res = await fetch(apiPath(`/api/users/company/${companyId}/vacancies`), { credentials: "include" });
            const data = await res.json();

            await onCall(res, data, onSuccess, onFail);
        } catch (err) {
            console.error(err);
        }
    }

    static async editVacancy(details, onSuccess, onFail) {
        try {
            const res = await fetch(apiPath(`/api/users/company/vacancy/${details.id}/edit`), {
                method: "PATCH",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(details)
            });
            const data = await res.json();
            
            await onCall(res, data, onSuccess, onFail);
        } catch (err) {
            console.error(err);
        }
    }

    static async editQualification(details, onSuccess, onFail) {
        try {
            const res = await fetch(apiPath(`/api/users/company/vacancy/${details.id}/edit-qualification`), {
                method: "PATCH",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ qualifications: details.qualifications })
            });
            const data = await res.json();
            
            await onCall(res, data, onSuccess, onFail);
        } catch (err) {
            console.error(err);
        }
    }

    static async addVacancy(details, onSuccess, onFail) {
        try {
            const res = await fetch(apiPath("/api/users/company/vacancy"), {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(details)
            });
            const data = await res.json();
            
            await onCall(res, data, onSuccess, onFail);
        } catch (err) {
            console.error(err);
        }
    }

    static async postJob(post, onSuccess, onFail) {
        try {
            const res = await fetch(apiPath("/api/users/company/posts"), {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(post)
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
            perPage = 20,
            published = true
        } = {}
    ) {
        page = Math.max(1, page);
        perPage = Math.min(100, Math.max(20, perPage));
        
        try {
            const res = await fetch(
                apiPath(`/api/users/company/posts/search?q=${q}&page=${page}&per_page=${perPage}&published=${published}`), 
                { credentials: "include" }
            );
            const data = await res.json();

            await onCall(res, data, onSuccess, onFail);
        } catch (err) {
            console.error(err);
        }
    }

    static async getCvSubmissions(jobPost, onSuccess, onFail) {
        try {
            const res = await fetch(apiPath(`/api/users/company/posts/${jobPost.id}/cvs`), { credentials: "include" });
            const data = await res.json();

            await onCall(res, data, onSuccess, onFail);
        } catch (err) {
            console.error(err);
        }
    }

    static async getAlumniProfile(alumniUserId, onSuccess, onFail) {
        try {
            const res = await fetch(apiPath(`/api/users/alumni/${alumniUserId}/profile`), { credentials: "include" });
            const data = await res.json();

            await onCall(res, data, onSuccess, onFail);
        } catch (err) {
            console.error(err);
        }
    }

    static async reviewSubmission(submissionId, onSuccess, onFail) {
        try {
            const res = await fetch(apiPath(`/api/users/company/posts/submissions/${submissionId}/review`),
                {
                    method: "PATCH",
                    credentials: "include"
                }
            );
            const data = await res.json();

            await onCall(res, data, onSuccess, onFail);
        } catch (err) {
            console.error(err);
        }
    }

    static async closeJobPost(postId, onSuccess, onFail) {
        try {
            const res = await fetch(apiPath(`/api/users/company/posts/${postId}/close`),
                {
                    method: "PATCH",
                    credentials: "include"
                }
            );
            const data = await res.json();

            await onCall(res, data, onSuccess, onFail);
        } catch (err) {
            console.error(err);
        }
    }

    static async deleteJobPost(postId, onSuccess, onFail) {
        try {
            const res = await fetch(apiPath(`/api/users/company/posts/${postId}/delete`), {
                method: "DELETE",
                credentials: "include"
            });
            const data = await res.json();

            await onCall(res, data, onSuccess, onFail);
        } catch (err) {
            console.error(err);
        }
    }

    static async repostJobPost(postId, open_until, onSuccess, onFail) {
        try {
            const res = await fetch(apiPath(`/api/users/company/posts/${postId}/repost`), {
                method: "PATCH",
                credentials: "include",
                body: JSON.stringify({ open_until })
            });
            const data = await res.json();

            await onCall(res, data, onSuccess, onFail);
        } catch (err) {
            console.error(err);
        }
    }
}