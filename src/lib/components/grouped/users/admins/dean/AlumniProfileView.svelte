<script>
	import { BadgeCheck, Briefcase, Building2, Factory, File, Link, Mail, MapPin, Search, X } from "lucide-svelte";
	import HeadBar from "../HeadBar.svelte";
	import { API_BASE_URL } from "$lib/app/core/constants";
	import RequirementAccordion from "$lib/components/single/global/RequirementAccordion.svelte";
	import Vacancy from "$lib/components/single/global/Vacancy.svelte";
	import { onMount } from "svelte";
	import AlumniOccMapModal from "$lib/components/grouped/global/AlumniOccMapModal.svelte";
	import Button from "$lib/components/single/global/Button.svelte";
	import FindInRecordsModal from "./FindInRecordsModal.svelte";

    let {
        alumni,
        onViewExit
    } = $props();

    let alumniOccMapOpen = $state(false);
    let alumniOccAddress = $state(null);
    let findInRecordsOpen = $state(false);
</script>

<div class="flex flex-col items-stretch overflow-hidden h-full">
    <HeadBar
        title={`Alumni Profile - ${alumni.profile.first_name}${alumni.profile.name_extension && (" " + alumni.profile.name_extension)} ${alumni.profile.middle_name && (alumni.profile.middle_name + " ")}${alumni.profile.last_name}`}
        BtnIcon={X}
        btnLabel={"Exit"}
        onBtnClick={onViewExit}
    />
    <div class="h-[calc(100%-64px)] overflow-auto">
        <div class="px-6 min-w-max">
            <div class="border border-gray-200 rounded-lg bg-white space-y-6 overflow-clip my-6 p-6">
                <div class="flex flex-col gap-y-2">
                    <div class="flex justify-between">
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
                        {#if alumni.profile.ver_stat_dean !== "Verified"}
                            <Button
                                Icon={Search}
                                label="Find in Records"
                                onclick={() => findInRecordsOpen = true}
                                size="s"
                                class="bg-blue-500 h-fit"
                            />
                        {/if}
                    </div>
                    <div class="grid grid-cols-3 gap-6 mt-4">
                        <div class="flex flex-col space-y-2 md:col-span-3 border border-gray-200 rounded-lg p-6">
                            <h1 class="text-lg font-bold text-gray-500">Career Information</h1>
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
                                <span class="text-sm text-gray-400 mb-2">Occupation History</span>
                                <div class="w-full border border-gray-300 rounded-lg [&>*:not(:last-child)]:border-b [&>*:not(:last-child)]:border-b-gray-300">
                                    {#each [...alumni.profile.occupations].sort((a, b) => {
                                        if (a.is_current !== b.is_current) return a.is_current ? -1 : 1;
                                        return b.start_year - a.start_year;
                                    }) as occupation}
                                        <div class="flex items-center justify-between mt-2 px-4 pt-2 pb-4">
                                            <div class="flex flex-col">
                                                <div class="flex items-center gap-x-2">
                                                    <Briefcase class="min-w-4 max-w-4"/>
                                                    <span>{occupation.occupation} {occupation.is_current ? "(current)" : ""}</span>
                                                </div>
                                                <span>{occupation.company}</span>
                                                <span>{occupation.start_year} - {occupation.end_year ? occupation.end_year : "Present"}</span>
                                            </div>
                                            {#if occupation.is_current}
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
                                            {/if}
                                        </div>
                                    {/each}
                                </div>
                            </div>
                        </div>
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
                            <div class="flex flex-col w-full">
                                <span class="text-sm text-gray-400">Year Graduated</span>
                                <span>{alumni.profile.graduation_year}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
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

{#if findInRecordsOpen}
    <FindInRecordsModal
        {alumni}
        onExit={() => findInRecordsOpen = false}
    />
{/if}