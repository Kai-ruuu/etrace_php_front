<script>
	import { goto } from "$app/navigation";
	import { page } from "$app/stores";
	import { UserService } from "$lib/app/services/users/user";
	import { Toast } from "$lib/app/utils/swal";
	import Button from "$lib/components/single/global/Button.svelte";
	import PasswordField from "$lib/components/single/global/PasswordField.svelte";
	import { RotateCw, Send, X } from "lucide-svelte";

	let password = $state({
		value: "",
		error: ""
	});

	let confirm_password = $state({
		value: "",
		error: ""
	});


</script>

<div class="w-screen h-screen text-gray-700 bg-white md:bg-gray-100 pt-6 overflow-x-hidden overflow-y-auto flex items-center justify-center">
	<div class="flex flex-col items-stretch max-w-4/5 md:w-2/5 md:gap-y-6 md:p-12 md:rounded-3xl md:shadow-lg md:bg-white w-full">
		<div class="flex flex-col items-stretch gap-y-1 mb-6 md:mb-0">
			<div class="flex items-center justify-between">
				<h1 class="font-bold text-xl text-red-800">Reset Password</h1>
			</div>
			
		</div>

		<div class="space-y-2">
			<div class="flex flex-col items-stretch">
				<span class="mb-2 text-sm">New Password</span>
				<PasswordField
					onDebounce={(value) => {
						if (value.length === 0) {
							password.error = "Password is required.";
							return;
						} else {
							password.error = "";
						}
						if (value.length < 8) {
							password.error = "Password should have at least 8 characters.";
							return;
						} else {
							password.error = "";
						}
						if (value.length > 65) {
							password.error = "Password should not exceed 65 characters.";
							return;
						} else {
							password.error = "";
						}
					}}
					bind:value={password.value}
					placeholder="Enter password"
				/>
				{#if password.error}
					<span class="text-red-500 text-sm">{password.error}</span>
				{/if}
			</div>
	
			<div class="flex flex-col items-stretch">
				<span class="mb-2 text-sm">Confirm Password</span>
				<PasswordField
					onDebounce={(value) => {
						if (value.length === 0) {
							confirm_password.error = "Password is required.";
							return;
						} else {
							confirm_password.error = "";
						}
						if (value.length < 8) {
							confirm_password.error = "Password should have at least 8 characters.";
							return;
						} else {
							confirm_password.error = "";
						}
						if (value.length > 65) {
							confirm_password.error = "Password should not exceed 65 characters.";
							return;
						} else {
							confirm_password.error = "";
						}
						if (value !== password.value) {
							confirm_password.error = "Passwords do not match.";
							return;
						} else {
							confirm_password.error = "";
						}
					}}
					bind:value={confirm_password.value}
					placeholder="Enter password"
				/>
				{#if confirm_password.error}
					<span class="text-red-500 text-sm">{confirm_password.error}</span>
				{/if}
			</div>
		</div>
		
		<div class="grid grid-cols-2 gap-4">
			<Button
				Icon={X}
				label="Cancel"
				class="bg-transparent text-red-800 border border-red-800"
				onclick={() => goto("/")}
			/>
			<Button
				Icon={RotateCw}
				label="Reset Password"
				onclick={async () => {
					if (password.error || confirm_password.error) {
						await Toast.fire({
							title: "Please fill in all required fields first and ensure that their were no errors left.",
							icon: "error"
						});
						return;
					}

					if (password.value.length < 8 || confirm_password.value.length < 8) {
						await Toast.fire({
							title: "Passwords should have at least 8 characters.",
							icon: "error"
						});
						return;
					}

					if (password.value !== confirm_password.value) {
						await Toast.fire({
							title: "Passwords don't match.",
							icon: "error"
						});
						return;
					}
					
					await UserService.resetPassword(
						confirm_password.value,
						$page.url.searchParams.get('token'),
						async (data, status) => {
							password = {
								value: "",
								error: ""
							};
							confirm_password = {
								value: "",
								error: ""
							};
							
							await Toast.fire({
								title: data?.message ?? "Your password has been reset. You may now login using it.",
								icon: "success"
							});
						},
						async (data, status) => {
							await Toast.fire({
								title: data?.message ?? "Unable to reset password.",
								icon: "error"
							});
						},
					);
				}}
			/>
		</div>
	</div>
</div>