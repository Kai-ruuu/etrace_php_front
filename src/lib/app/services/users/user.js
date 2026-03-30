import { apiPath, onCall } from "$lib/app/utils/api";

export class UserService {
    static async me(onSuccess, onFail) {
        try {
            const res = await fetch(apiPath("/api/users/me"), {
                credentials: "include",
                headers: { "Content-Type": "application/json" },
            });
            const data = await res.json();
            await onCall(res, data, onSuccess, onFail);
        } catch (err) {
            console.error(err);
        }
    }

    static async changePassword(passwords, onSuccess, onFail) {
        try {
            const res = await fetch(apiPath("/api/users/change-password"), {
                method: "PATCH",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(passwords)
            });
            const data = await res.json();
            await onCall(res, data, onSuccess, onFail);
        } catch (err) {
            console.error(err);
        }
    }

    static async sendResetEmail(email, onSuccess, onFail) {
        try {
            const res = await fetch(apiPath("/api/users/forgot-password"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email })
            });
            const data = await res.json();
            await onCall(res, data, onSuccess, onFail);
        } catch (err) {
            console.error(err);
        }
    }

    static async resetPassword(password, token, onSuccess, onFail) {
        try {
            const res = await fetch(apiPath(`/api/users/reset-password?token=${token}`), {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password })
            });
            const data = await res.json();
            await onCall(res, data, onSuccess, onFail);
        } catch (err) {
            console.error(err);
        }
    }

    static async agreeToConsent(onSuccess, onFail) {
        try {
            const res = await fetch(apiPath("/api/users/agree-to-consent"), {
                method: "PATCH",
                credentials: "include"
            });
            const data = await res.json();
            await onCall(res, data, onSuccess, onFail);
        } catch (err) {
            console.error(err);
        }
    }
}