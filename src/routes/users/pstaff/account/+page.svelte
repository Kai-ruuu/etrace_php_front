<script>
	import { Pen, Save, X } from "lucide-svelte";
	import { ROLE } from "$lib/app/core/constants";
	import { user } from "$lib/app/stores/user";
	import { getDisplayRole } from "$lib/app/utils/user";
	import HeadBar from "$lib/components/grouped/users/admins/HeadBar.svelte";
	import Button from "$lib/components/single/global/Button.svelte";
	import TextField from "$lib/components/single/global/TextField.svelte";
	import PasswordField from "$lib/components/single/global/PasswordField.svelte";
	import { Toast } from "$lib/app/utils/swal";
	import { AuthService } from "$lib/app/services/auth";
	import { UserService } from "$lib/app/services/users/user";
	import { PstaffService } from "$lib/app/services/users/pstaff";

	let updateOn = $state(false);
	let profile = $state({
		name: "",
		initials: ""
	});
	let udpateInfo = $state({
		first_name: "",
		middle_name: "",
		last_name: ""
	});

	let updatePasswordOn = $state(false);
	let password = $state({
		oldPass: "",
		newPass: "",
		confirmedNewPass: "",
	});

	async function onUpdateProfile() {
		await PstaffService.updateProfile(
			udpateInfo,
			async (data, _) => {
				await UserService.me(async (data, _) => {
					user.set(data);
					updateOn = false;
				});
				await Toast.fire({
					title: data?.message ?? "Profile has been updated.",
					icon: "success"
				});
			},
			async (data, _) => {
				udpateInfo.first_name = $user.profile.first_name;
				udpateInfo.middle_name = $user.profile.middle_name;
				udpateInfo.last_name = $user.profile.last_name;

				await Toast.fire({
					title: data?.message ?? "Failed to updated profile.",
					icon: "error"
				});
			},
		)
	}

	async function onChangePassword() {
		// add client-side validation
		await UserService.changePassword(
			{ current_password: password.oldPass, new_password: password.confirmedNewPass },
			async (data) => {
				updatePasswordOn = false;
				password = {
					oldPass: "",
					newPass: "",
					confirmedNewPass: "",
				};
				await UserService.me(async (data, _) => {
					user.set(data);
					updateOn = false;
				});
				await Toast.fire({
					title: data?.message ?? "Password successfully changed.",
					icon: "success"
				});
			},
			async (data) => {
				password = {
					oldPass: "",
					newPass: "",
					confirmedNewPass: "",
				};
				await Toast.fire({
					title: data?.message ?? "Failed to change password.",
					icon: "error"
				});
			},
		)
	}

	$effect(() => {
		if ($user) {
			profile.name = `${$user.profile.first_name} ${$user.profile.middle_name ? $user.profile.middle_name + " " : ""}${$user.profile.last_name}`;
			profile.initials = profile.name.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase();
			udpateInfo.first_name = $user.profile.first_name;
			udpateInfo.middle_name = $user.profile.middle_name;
			udpateInfo.last_name = $user.profile.last_name;
		}
	})
</script>

{#if $user}
	<div class="flex flex-col items-stretch overflow-hidden h-full">
		<HeadBar title="My Account"/>
		<div class="max-h-[calc(100%-64px)] px-6 overflow-auto">
			<div class="border border-gray-200 rounded-lg bg-white overflow-clip my-6">
				{#if updateOn}
					<div class="p-6 flex flex-col gap-y-4">
						<h1>Update Profile (Turn this into a modal)</h1>
						<div class="flex items-center gap-x-4">
							<div class="grow grid grid-cols-3 gap-x-4">
								<TextField
									bind:value={udpateInfo.first_name}
									placeholder="First Name"
								/>
								<TextField
									bind:value={udpateInfo.middle_name}
									placeholder="Middle Name"
								/>
								<TextField
									bind:value={udpateInfo.last_name}
									placeholder="Last Name"
								/>
							</div>
							<Button
								Icon={X}
								label="Cancel"
								class="bg-red-500 px-3"
								onclick={() => updateOn = false}
							/>
							<Button
								Icon={Save}
								label="Save"
								class="bg-green-500 px-5"
								onclick={onUpdateProfile}
							/>
						</div>
					</div>
				{:else}
					<div class="flex flex-col items-stretch justify-between">
						<div class="flex items-center gap-x-6 p-6 pb-0">
							<div class="flex flex-col w-full">
								<div class="flex justify-between items-center">
									<div class="flex gap-x-4 items-center">
										<h1 class="text-xl">{profile.name}</h1>
										<span class="text-sm bg-gray-200 px-2 py-1 rounded w-fit">{getDisplayRole($user.role)}</span>
									</div>
									<Button
										Icon={Pen}
										label="Edit Profile"
										size="s"
										class="bg-blue-500"
										onclick={() => updateOn = true}
									/>
								</div>
								<h2>{$user.email}</h2>
							</div>
						</div>
						<div class="grid grid-cols-2 gap-x-4 p-6 w-full">
							<div class="px-6 py-3 bg-gray-100 rounded-lg">
								<p class="text-sm text-gray-500">Joined</p>
								<h2 class="text-sm">{new Date($user.created_at).toLocaleDateString("en-US", {
									year: "numeric",
									month: "short",
									day: "numeric"
								})}</h2>
							</div>
							<div class="px-6 py-3 bg-gray-100 rounded-lg">
								<p class="text-sm text-gray-500">Updated</p>
								<h2 class="text-sm">{new Date($user.updated_at).toLocaleDateString("en-US", {
									year: "numeric",
									month: "short",
									day: "numeric"
								})}</h2>
							</div>
						</div>
					</div>
				{/if}
			</div>
			<div class="border border-gray-200 rounded-lg bg-white overflow-clip my-6 flex items-center justify-between p-6">
				{#if updatePasswordOn}
					<div class="flex flex-col items-stretch gap-y-4">
						<h1>Update Password (Turn this into a modal)</h1>
						<div class="flex items-center gap-x-4">
							<div class="grow grid grid-cols-3 gap-x-4">
								<PasswordField placeholder="Current Password" bind:value={password.oldPass}/>
								<PasswordField placeholder="New Password" bind:value={password.newPass}/>
								<PasswordField placeholder="Confirm Password" bind:value={password.confirmedNewPass}/>
							</div>
							<Button
								Icon={X}
								label="Cancel"
								class="bg-red-500 px-3"
								onclick={() => updatePasswordOn = false}
							/>
							<Button
								Icon={Save}
								label="Save"
								class="bg-green-500 px-5"
								onclick={onChangePassword}
							/>
						</div>
					</div>
				{:else}
					<h1>Password</h1>
					<Button
						Icon={Pen}
						label="Update"
						size="s"
						onclick={() => updatePasswordOn = true}
						class="bg-blue-500"
					/>
				{/if}
			</div>
		</div>
	</div>
{/if}