<script>
	import { goto } from "$app/navigation";
	import { UserService } from "$lib/app/services/users/user";
	import { Toast } from "$lib/app/utils/swal";
	import Button from "$lib/components/single/global/Button.svelte";
	import EmailField from "$lib/components/single/global/EmailField.svelte";
	import { Send, X } from "lucide-svelte";

	let email = $state({
		value: "",
		error: ""
	});


</script>

<div class="w-screen h-screen text-gray-700 bg-white md:bg-gray-100 pt-6 overflow-x-hidden overflow-y-auto flex items-center justify-center">
	<div class="flex flex-col items-stretch max-w-4/5 md:w-2/5 md:gap-y-6 md:p-12 md:rounded-3xl md:shadow-lg md:bg-white w-full">
		<div class="flex flex-col items-stretch gap-y-1 mb-6 md:mb-0">
			<div class="flex items-center justify-between">
				<h1 class="font-bold text-xl text-red-800">Forgot Password</h1>
			</div>
			
		</div>
		<div class="flex flex-col items-stretch">
			<span class="mb-2 text-sm">Account Email</span>
			<EmailField
				onDebounce={(value) => email.error = value.trim().length === 0 ? "Email is required" : ""}
				bind:value={email.value}
				placeholder="Enter your email"
			/>
			{#if email.error}
				<span class="text-red-500 text-sm">{email.error}</span>
			{/if}
		</div>
		<div class="grid grid-cols-2 gap-4">
			<Button
				Icon={X}
				label="Cancel"
				class="bg-transparent text-red-800 border border-red-800"
				onclick={() => goto("/")}
			/>
			<Button
				Icon={Send}
				label="Send Reset Email"
				onclick={async () => {
					if (!email.value.trim()) email.error = "Email is required.";
					else if (!email.value.includes('@')) email.error = "Invalid email address.";

					if (email.error) return;
					
					await UserService.sendResetEmail(email.value,
						async (data, status) => {
							await Toast.fire({
								title: data?.message ?? "Password reset email has been sent. Please check your inbox.",
								icon: "success"
							});
						},
						async (data, status) => {
							await Toast.fire({
								title: data?.message ?? "Unable to send password reset email.",
								icon: "error"
							});
						},
					);
				}}
			/>
		</div>
	</div>
</div>