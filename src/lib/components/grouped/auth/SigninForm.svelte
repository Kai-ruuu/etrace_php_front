<script>
    import Swal from 'sweetalert2';
    import { Mail, Lock, LogIn } from "lucide-svelte";
	import Button from "$lib/components/single/global/Button.svelte";
	import EmailField from "$lib/components/single/global/EmailField.svelte";
	import PasswordField from "$lib/components/single/global/PasswordField.svelte";
	import { AuthService } from "$lib/app/services/auth";
	import { Toast } from '$lib/app/utils/swal';
	import { user } from '$lib/app/stores/user';
	import { goToDashboard } from '$lib/app/utils/api';

    let { children } = $props();
    
    let creds = $state({
        email: {
            value: "",
            errors: []
        },
        password: {
            value: "",
            errors: []
        }
    });

    async function onLogin() {
        await AuthService.login(
            creds,
            async (data, status) => {
                user.set(data);
                goToDashboard(data.role);
                await Toast.fire({
                    icon: "success",
                    title: "Sign in success!",
                });
            },
            async (data, status) => {
                await Toast.fire({
                    icon: "error",
                    title: data?.message ?? "Failed to sign in."
                });
            }
        )
    }
</script>

<div class="flex flex-col items-stretch gap-y-6 p-12 rounded-3xl shadow-lg bg-white max-w-4/5 md:w-1/3">
    <div class="space-y-4">
        <h1 class="font-bold text-2xl text-center text-red-800">E-trace Login</h1>
        <h2 class="text-center text-lg">Enter your details to sign in to your account.</h2>
    </div>

    <form
        onsubmit={onLogin}
        class="flex flex-col items-stretch gap-y-4"
    >
        <EmailField
            Icon={Mail}
            placeholder="Email"
            bind:value={creds.email.value}
        />
        <PasswordField
            Icon={Lock}
            placeholder="Password"
            bind:value={creds.password.value}
        />
        <a href="/" class="text-red-700">Forgot Password?</a>
        <Button label="Sign in"/>
    </form>

    <p class="text-center">Don't have an account? <a href="/" class="text-red-700">Sign up</a> now!</p>
</div>