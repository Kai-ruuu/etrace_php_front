<script>
	import { UserService } from "$lib/app/services/users/user";
	import { settings } from "$lib/app/stores/alumni";
	import { user } from "$lib/app/stores/user";
	import { Toast } from "$lib/app/utils/swal";
	import Button from "$lib/components/single/global/Button.svelte";
	import PasswordField from "$lib/components/single/global/PasswordField.svelte";
	import { Pen, Save, X } from "lucide-svelte";

    let {
        onExit
    } = $props();

    let updatePasswordOn = $state(false);
	let password = $state({
		oldPass: "",
		newPass: "",
		confirmedNewPass: "",
	});

    async function onChangePassword() {
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
</script>

<div class="absolute top-0 left-0 w-screen h-screen bg-white/75 overflow-x-hidden overflow-y-auto flex flex-col items-center justify-center z-100">
    <div class="border border-gray-200 rounded-lg bg-white flex flex-col items-stretch p-6 gap-y-4 md:w-1/2 min-h-[calc(100dvh-64px)] max-h-[calc(100dvh-64px)] z-100">
        <div class="flex items-center justify-between">
            <h1 class="text-lg">Settings</h1>
            <Button Icon={X} size="s" onclick={() => {
                $settings.open = false;
                $settings.tab = null;
            }} class="bg-transparent text-gray-700"/>
        </div>

        <div class="border border-gray-200 rounded-lg bg-white overflow-clip my-6 flex items-center justify-between p-6">
            {#if updatePasswordOn}
                <div class="w-full flex flex-col items-stretch gap-y-4">
                    <h1>Update Password</h1>
                    <div class="flex flex-col items-stretch gap-y-4">
                        <div class="w-full flex flex-col items-stretch gap-y-4">
                            <PasswordField
                                placeholder="Current Password"
                                bind:value={password.oldPass}
                            />
                            <PasswordField
                                placeholder="New Password"
                                bind:value={password.newPass}
                            />
                            <PasswordField
                                placeholder="Confirm Password"
                                bind:value={password.confirmedNewPass}
                            />
                        </div>
                        <div class="w-full grid grid-cols-2 gap-x-4">
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