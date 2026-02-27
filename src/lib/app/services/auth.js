import { apiPath, onCall } from "../utils/api";

export class AuthService {
    static async login(creds, onSuccess, onFail) {
        try {
            const res = await fetch(apiPath("/api/auth"), {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: creds.email.value,
                    password: creds.password.value,
                })
            });
            const data = await res.json();
            await onCall(res, data, onSuccess, onFail);
        } catch (err) {
            console.error(err);
        }
    }

    static async logout(onSuccess, onFail) {
        try {
            const res = await fetch(apiPath("/api/auth/logout"), {
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