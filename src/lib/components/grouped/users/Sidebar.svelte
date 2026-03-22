<script>
	import { ROLE } from "$lib/app/core/constants";
	import { useWidth } from "$lib/app/hooks/useWidth.svelte";
	import { sidebarOpen } from "$lib/app/stores/sidebar";
	import { user } from "$lib/app/stores/user";
	import { Archive, LayoutDashboard, LogOut, School, Settings, User, Wrench, Building2, BookCopy, Scroll, Link, BadgeCheck, File } from "lucide-svelte";
	import SidebarLinkParent from "./SidebarLinkParent.svelte";
	import SidebarLink from "./SidebarLink.svelte";
	import { AuthService } from "$lib/app/services/auth";
	import { Toast } from "$lib/app/utils/swal";
	import { goto } from "$app/navigation";
	import { onMount } from "svelte";

    let {
        children
    } = $props();

    let device = useWidth();

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

    onMount(() => {
        if (device.isMobile) {
            sidebarOpen.set(false);
        }
    })
</script>

{#if device.isMobile}
    <div class={[$sidebarOpen ? "w-screen" : "hidden", "h-screen absolute top-0 left-0 bg-white z-100"]}>
        <div class={["min-h-16 flex items-center", !$sidebarOpen ? "justify-center py-4" : "px-6"]}>
            <div class={[!$sidebarOpen && "bg-gray-200 w-8 h-full flex items-center justify-center rounded"]}>
                <h1 class="font-bold text-xl">{$sidebarOpen ? "E-trace" : "E"}</h1>
            </div>
        </div>
        {#if $user.role === ROLE.sysad.value}
            <SidebarLink Icon={LayoutDashboard} label="Dashboard" path="/users/sysad"/>
            <SidebarLinkParent Icon={Wrench} label="Manage">
                <SidebarLink Icon={School} label="Schools" path="/users/sysad/manage-schools"/>
                {#if $user.default_sysad}
                    <SidebarLink Icon={User} label="System Administrators" path="/users/sysad/manage-sysads"/>
                {/if}
                <SidebarLink Icon={User} label="Deans" path="/users/sysad/manage-deans"/>
                <SidebarLink Icon={User} label="PESO Staffs" path="/users/sysad/manage-peso-staffs"/>
                <SidebarLink Icon={Building2} label="Company Verification" path="/users/sysad/manage-company-approvals"/>
            </SidebarLinkParent>
            <SidebarLinkParent Icon={Settings} label="Settings">
                <SidebarLink Icon={User} label="Account" path="/users/sysad/account"/>
                <SidebarLinkParent Icon={Archive} label="Archives">
                    <SidebarLink Icon={School} label="Schools" path="/users/sysad/manage-schools/archived"/>
                </SidebarLinkParent>
            </SidebarLinkParent>
        {:else if $user.role === ROLE.dean.value}
            <SidebarLink Icon={LayoutDashboard} label="Dashboard" path="/users/dean"/>
            <SidebarLinkParent Icon={Wrench} label="Manage">
                <SidebarLink Icon={BookCopy} label="Courses" path="/users/dean/manage-courses"/>
                <SidebarLink Icon={Link} label="Occupations" path="/users/dean/manage-occupations"/>
                <SidebarLink Icon={Scroll} label="Graduate Records" path="/users/dean/manage-records"/>
                <SidebarLink Icon={User} label="Manage Alumni" path="/users/dean/manage-alumni"/>
            </SidebarLinkParent>
            <SidebarLinkParent Icon={Settings} label="Settings">
                <SidebarLink Icon={User} label="Account" path="/users/dean/account"/>
                <SidebarLinkParent Icon={Archive} label="Archives">
                    <SidebarLink Icon={BookCopy} label="Courses" path="/users/dean/manage-courses/archived"/>
                    <SidebarLink Icon={Scroll} label="Graduate Records" path="/users/dean/manage-records/archived"/>
                </SidebarLinkParent>
            </SidebarLinkParent>
        {:else if $user.role === ROLE.pstaff.value}
            <SidebarLink Icon={LayoutDashboard} label="Dashboard" path="/users/pstaff"/>
            <SidebarLinkParent Icon={Wrench} label="Manage">
                <SidebarLink Icon={User} label="Company Verification" path="/users/pstaff/manage-company-approvals"/>
            </SidebarLinkParent>
            <SidebarLinkParent Icon={Settings} label="Settings">
                <SidebarLink Icon={User} label="Account" path="/users/pstaff/account"/>
            </SidebarLinkParent>
        {:else if $user.role === ROLE.company.value}
            <SidebarLink Icon={LayoutDashboard} label="Dashboard" path="/users/company"/>
            <SidebarLinkParent Icon={Wrench} label="Manage">
                <SidebarLink Icon={User} label="Job Posts" path="/users/company/manage-job-posts"/>
                <SidebarLink Icon={BadgeCheck} label="Verification Center" path="/users/company/verification"/>
            </SidebarLinkParent>
            <SidebarLinkParent Icon={Settings} label="Settings">
                <SidebarLink Icon={User} label="Account" path="/users/company/account"/>
            </SidebarLinkParent>
        {/if}
        <button
            onclick={onLogout}
            title="Sign out"
            class={["w-full flex items-center py-3 cursor-pointer", $sidebarOpen ? "gap-x-4 px-6" : "justify-center"]}
        >
            <LogOut class="min-w-5"/>
            {#if $sidebarOpen}
                <span>Sign out</span>
            {/if}
        </button>
    </div>
{:else}
    <div class={["bg-white max-h-full border-r border-r-gray-200 overflow-auto", $sidebarOpen ? "md:min-w-1/4" : "min-w-16"]}>
        <div class={["min-h-16 flex items-center", !$sidebarOpen ? "justify-center" : "px-6"]}>
            <div class={[!$sidebarOpen && "bg-gray-200 w-8 h-8 flex items-center justify-center rounded"]}>
                <h1 class="font-bold text-xl">{$sidebarOpen ? "E-trace" : "E"}</h1>
            </div>
        </div>
        {#if $user.role === ROLE.sysad.value}
            <SidebarLink Icon={LayoutDashboard} label="Dashboard" path="/users/sysad"/>
            <SidebarLinkParent Icon={Wrench} label="Manage">
                <SidebarLink Icon={School} label="Schools" path="/users/sysad/manage-schools"/>
                {#if $user.default_sysad}
                    <SidebarLink Icon={User} label="System Administrators" path="/users/sysad/manage-sysads"/>
                {/if}
                <SidebarLink Icon={User} label="Deans" path="/users/sysad/manage-deans"/>
                <SidebarLink Icon={User} label="PESO Staffs" path="/users/sysad/manage-peso-staffs"/>
                <SidebarLink Icon={Building2} label="Company Verification" path="/users/sysad/manage-company-approvals"/>
            </SidebarLinkParent>
            <SidebarLinkParent Icon={Settings} label="Settings">
                <SidebarLink Icon={User} label="Account" path="/users/sysad/account"/>
                <SidebarLinkParent Icon={Archive} label="Archives">
                    <SidebarLink Icon={School} label="Schools" path="/users/sysad/manage-schools/archived"/>
                </SidebarLinkParent>
            </SidebarLinkParent>
        {:else if $user.role === ROLE.dean.value}
            <SidebarLink Icon={LayoutDashboard} label="Dashboard" path="/users/dean"/>
            <SidebarLinkParent Icon={Wrench} label="Manage">
                <SidebarLink Icon={BookCopy} label="Courses" path="/users/dean/manage-courses"/>
                <SidebarLink Icon={Link} label="Occupations" path="/users/dean/manage-occupations"/>
                <SidebarLink Icon={Scroll} label="Graduate Records" path="/users/dean/manage-records"/>
                <SidebarLink Icon={User} label="Manage Alumni" path="/users/dean/manage-alumni"/>
            </SidebarLinkParent>
            <SidebarLinkParent Icon={Settings} label="Settings">
                <SidebarLink Icon={User} label="Account" path="/users/dean/account"/>
                <SidebarLinkParent Icon={Archive} label="Archives">
                    <SidebarLink Icon={BookCopy} label="Courses" path="/users/dean/manage-courses/archived"/>
                    <SidebarLink Icon={Scroll} label="Graduate Records" path="/users/dean/manage-records/archived"/>
                </SidebarLinkParent>
            </SidebarLinkParent>
        {:else if $user.role === ROLE.pstaff.value}
            <SidebarLink Icon={LayoutDashboard} label="Dashboard" path="/users/pstaff"/>
            <SidebarLinkParent Icon={Wrench} label="Manage">
                <SidebarLink Icon={User} label="Company Verification" path="/users/pstaff/manage-company-approvals"/>
            </SidebarLinkParent>
            <SidebarLinkParent Icon={Settings} label="Settings">
                <SidebarLink Icon={User} label="Account" path="/users/pstaff/account"/>
            </SidebarLinkParent>
        {:else if $user.role === ROLE.company.value}
            <SidebarLinkParent Icon={Wrench} label="Manage">
                <SidebarLink Icon={User} label="Job Posts" path="/users/company"/>
                <SidebarLink Icon={BadgeCheck} label="Verification Center" path="/users/company/verification"/>
            </SidebarLinkParent>
            <SidebarLinkParent Icon={Settings} label="Settings">
                <SidebarLink Icon={User} label="Account" path="/users/company/account"/>
            </SidebarLinkParent>
        {/if}
        <button
            onclick={onLogout}
            title="Sign out"
            class={["w-full flex items-center py-3 cursor-pointer", $sidebarOpen ? "gap-x-4 px-6" : "justify-center"]}
        >
            <LogOut class="min-w-5"/>
            {#if $sidebarOpen}
                <span>Sign out</span>
            {/if}
        </button>
    </div>
{/if}