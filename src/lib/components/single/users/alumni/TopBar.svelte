<script>
	import { sidebarOpen } from "$lib/app/stores/sidebar";
	import { BadgeCheck, ChevronDown, House, LogOut, Search, Settings, User, X } from "lucide-svelte";
	import TextField from "../../global/TextField.svelte";
	import { user } from "$lib/app/stores/user";
	import { API_BASE_URL } from "$lib/app/core/constants";
	import { AuthService } from "$lib/app/services/auth";
	import { goto } from "$app/navigation";
	import { Toast } from "$lib/app/utils/swal";

    let {
        query = $bindable(""),
        onSearch,
        onQueryClear,
    } = $props();

    let meDownOpen = $state(false);

    async function onLogout() {
        await AuthService.logout(
            async (data, status) => {
                goto("/");
                await Toast.fire({
                    title: data?.message ?? "Signed out successfully!",
                    icon: "success"
                });
            },
            async (data, status) => {
                await Toast.fire({
                    title: data?.message ?? "Failed to sign out.",
                    icon: "error"
                });
                goto("/");
            }
        );
    }
</script>

<div class="bg-white border-b border-gray-200 min-h-18 md:grid md:grid-cols-3 px-32">
    <div class="flex items-center gap-x-4">
        <div class={[!$sidebarOpen && "bg-gray-200 w-8 h-8 flex items-center justify-center rounded"]}>
            <h1 class="font-bold text-xl">{$sidebarOpen ? "E-trace" : "E"}</h1>
        </div>
    </div>
    <div class="flex items-center justify-center">
        <TextField
            bind:value={query}
            allowClear={true}
            placeholder="search jobs"
            onClear={onQueryClear}
            BtnIcon={Search}
            btnOnclick={onSearch}
            class="w-full"
        />
    </div>
    <nav class="flex items-center justify-end">
        <a
            href="/users/alumni"
            class="flex items-center min-w-20 gap-x-2"
        >
            <House class="min-w-5 max-w-5"/>
            <span class="text-sm">Home</span>
        </a>
        <a
            href="/users/alumni/verification"
            class="flex items-center min-w-20 gap-x-2"
        >
            <BadgeCheck class="min-w-5 max-w-5"/>
            <span class="text-sm">Verification</span>
        </a>
        <div class="relative">
            <button
                onclick={() => meDownOpen = !meDownOpen}
                class="flex items-center ml-4 cursor-pointer gap-x-2"
            >
                <User class="min-w-5 max-w-5"/>
                <div class="flex items-center gap-x-2">
                    <span class="text-sm">Me</span>
                    <ChevronDown class="max-w-4"/>
                </div>
            </button>
            {#if meDownOpen}
                <div class="absolute bottom-0 right-0 translate-y-[100%] border border-gray-200 bg-white rounded-lg px-6 pt-6 py-4 space-y-4 z-100">
                    <div class="flex items-center gap-x-4">
						<div
							style="background-image: url({API_BASE_URL + `/uploads/alumni/profile_picture/${$user.profile.file_profile_picture}`})"
							class="min-w-12 min-h-12 w-fit rounded-full bg-gray-200 bg-cover bg-center bg-no-repeat border border-gray-300"
						></div>
						<div class="grow flex flex-col">
							<span class="max-w-4/5 truncate font-bold">
								{$user.profile.first_name}{$user.profile.name_extension && (" " + $user.profile.name_extension)}
								{$user.profile.middle_name && (" " + $user.profile.middle_name + " ")}
								{$user.profile.last_name}
							</span>
							<span>{$user.email}</span>
						</div>
					</div>
                    <div class="">
                        <a
                            href="/"
                            class="flex items-center gap-x-2 w-full py-2 cursor-pointer"
                        >
                            <User class="min-w-4 max-w-4"/>
                            <span>Profile</span>
                        </a>
                        <a
                            href="/"
                            class="flex items-center gap-x-2 w-full py-2 cursor-pointer"
                        >
                            <Settings class="min-w-4 max-w-4"/>
                            <span>Settings</span>
                        </a>
                        <button
                            onclick={onLogout}
                            class="flex items-center gap-x-2 w-full py-2 cursor-pointer"
                        >
                            <LogOut class="min-w-4 max-w-4"/>
                            <span>Signout</span>
                        </button>
                        <button
                            onclick={() => meDownOpen = false}
                            class="flex items-center gap-x-2 w-full py-2 cursor-pointer"
                        >
                            <X class="text-red-500 min-w-4 max-w-4"/>
                            <span class="text-red-500">Cancel</span>
                        </button>
                    </div>
                </div>
            {/if}
        </div>
    </nav>
</div>