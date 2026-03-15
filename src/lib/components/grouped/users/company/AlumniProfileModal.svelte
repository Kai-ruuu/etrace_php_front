<script>
	import { API_BASE_URL } from "$lib/app/core/constants";
	import { CompanyService } from "$lib/app/services/users/company";
	import { Toast } from "$lib/app/utils/swal";
	import Button from "$lib/components/single/global/Button.svelte";
	import { BadgeCheck, Briefcase, File, Link, MapPin, X } from "lucide-svelte";
	import { onMount } from "svelte";
	import AlumniOccMapModal from "../../global/AlumniOccMapModal.svelte";

    let {
        alumniId = 0,
        onExit
    } = $props();

    let alumni = $state(null);
    let alumniReady = $state(false);
    let alumniOccMapOpen = $state(false);
    let alumniOccAddress = $state(null);

    onMount(async () => await CompanyService.getAlumniProfile(
        alumniId,
        async (data, stat) => {
            alumni = data;
            alumniReady = true;
        },
        async (data, stat) => {
            await Toast.fire({
                title: data?.message ?? "Unable to get alumni profile.",
                icon: "error"
            });
        },
    ));
</script>
<div class="absolute top-0 left-0 w-screen h-screen bg-white/75 overflow-x-hidden overflow-y-auto flex flex-col items-center p-8 z-100">
    <div class="border border-gray-200 rounded-lg bg-white p-6 gap-y-4 md:w-4/5">
        <div class="flex items-center justify-between mb-4">
            <h1 class="text-lg">Alumni Profile</h1>
            <Button Icon={X} size="s" onclick={onExit} class="bg-transparent text-gray-700"/>
        </div>
        {#if alumniReady}
            <div class="flex flex-col gap-y-2">
                <div class="flex items-center gap-x-4">
                    <div
                        style="background-image: url({API_BASE_URL + `/uploads/alumni/profile_picture/${alumni.profile.file_profile_picture}`})"
                        class="min-w-18 min-h-18 w-fit rounded-full bg-gray-200 bg-cover bg-center bg-no-repeat border border-gray-300"
                    ></div>
                    <div class="flex flex-col gap-y-2">
                        <h1 class="text-xl font-bold">{alumni.profile.first_name}{alumni.profile.name_extension && (" " + alumni.profile.name_extension)} {alumni.profile.middle_name && (alumni.profile.middle_name + " ")}{alumni.profile.last_name}</h1>
                        {#if alumni.profile.ver_stat_dean === "Verified"}
                            <div class="flex items-center gap-x-2">
                                <div class="flex items-center gap-x-2 px-2 rounded border border-blue-500">
                                    <BadgeCheck class="w-4 text-blue-500"/>
                                    <p class="w-fit text-blue-500">Dean Verified</p>
                                </div>
                            </div>
                        {/if}
                    </div>
                </div>
                <div class="grid grid-cols-3 gap-6 mt-4">
                    <div class="flex flex-col space-y-2 border border-gray-200 rounded-lg p-6">
                        <h1 class="text-lg font-bold text-gray-500">Personal Information</h1>
                        <div class="flex flex-col w-full">
                            <span class="text-sm text-gray-400">Gender</span>
                            <span>{alumni.profile.gender}</span>
                        </div>
                        <div class="flex flex-col w-full">
                            <span class="text-sm text-gray-400">Birth Date</span>
                            <span>{alumni.profile.birth_date}</span>
                        </div>
                        <div class="flex flex-col w-full">
                            <span class="text-sm text-gray-400">Birth Place</span>
                            <span>{alumni.profile.birth_place}</span>
                        </div>
                        <div class="flex flex-col w-full">
                            <span class="text-sm text-gray-400">Civil Status</span>
                            <span>{alumni.profile.civil_status}</span>
                        </div>
                    </div>
                    <div class="flex flex-col space-y-2 border border-gray-200 rounded-lg p-6">
                        <h1 class="text-lg font-bold text-gray-500">Contact Information</h1>
                        <div class="flex flex-col w-full">
                            <span class="text-sm text-gray-400">Phone Number</span>
                            <span>{alumni.profile.phone_number}</span>
                        </div>
                        <div class="flex flex-col w-full">
                            <span class="text-sm text-gray-400">Email</span>
                            <span>{alumni.email}</span>
                        </div>
                        <div class="flex flex-col w-full">
                            <span class="text-sm text-gray-400">Address</span>
                            <span>{alumni.profile.address}</span>
                        </div>
                        <div class="flex flex-col w-full">
                            <span class="text-sm text-gray-400">Social Media</span>
                            {#each alumni.profile.socials as social}
                                <a
                                    href={social.url}
                                    class="text-blue-700 flex items-center gap-x-2"
                                >
                                    <Link class="min-w-4 max-w-4"/>
                                    <span>{social.platform}</span>
                                </a>
                            {/each}
                        </div>
                    </div>
                    <div class="flex flex-col space-y-2 border border-gray-200 rounded-lg p-6">
                        <h1 class="text-lg font-bold text-gray-500">Education Information</h1>
                        <div class="flex flex-col w-full">
                            <span class="text-sm text-gray-400">Course</span>
                            <span>{alumni.profile.course.name}</span>
                        </div>
                        <div class="flex flex-col w-full">
                            <span class="text-sm text-gray-400">Student Number</span>
                            <span>{alumni.profile.student_number ? alumni.profile.student_number : "N/A"}</span>
                        </div>
                    </div>
                    <div class="flex flex-col space-y-2 md:col-span-3 border border-gray-200 rounded-lg p-6">
                        <h1 class="text-lg font-bold text-gray-500">Career</h1>
                        <div class="flex flex-col w-full">
                            <span class="text-sm text-gray-400">Employment Status</span>
                            <span>{alumni.profile.employment_status}</span>
                        </div>
                        <div class="flex flex-col w-full">
                            <span class="text-sm text-gray-400">Curriculum Vitae</span>
                            <div class="flex items-center gap-x-2 text-blue-700">
                                <File class="min-w-4 max-w-4"/>
                                <a
                                    href={API_BASE_URL + "/uploads/alumni/cv/" + alumni.profile.file_cv}
                                    target="_blank"
                                >View CV</a>
                            </div>
                        </div>
                        <div class="flex flex-col w-full">
                            <span class="text-sm text-gray-400">Occupations</span>
                            {#each alumni.profile.occupations as occupation}
                                <div class="flex items-center justify-between">
                                    <div class="flex items-center gap-x-2">
                                        <Briefcase class="min-w-4 max-w-4"/>
                                        <span>{occupation.occupation} ({occupation.is_current ? "current" : "previous"})</span>
                                    </div>
                                    <div>
                                        <Button
                                            Icon={MapPin}
                                            label="View Location"
                                            size="s"
                                            class="bg-blue-500"
                                            onclick={() => {
                                                alumniOccAddress = occupation.address;
                                                alumniOccMapOpen = true;
                                            }}
                                        />
                                    </div>
                                </div>
                            {/each}
                        </div>
                    </div>
                </div>
            </div>
        {:else}
            <div>Loading alumni profile...</div>
        {/if}
    </div>
</div>

{#if alumniOccMapOpen}
    <AlumniOccMapModal
        address={alumniOccAddress}
        onExit={() => {
            alumniOccAddress = null;
            alumniOccMapOpen = false;
        }}
    />
{/if}