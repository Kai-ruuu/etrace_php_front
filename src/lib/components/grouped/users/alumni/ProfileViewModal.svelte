<script>
	import { API_BASE_URL } from "$lib/app/core/constants";
	import { settings } from "$lib/app/stores/alumni";
	import { user } from "$lib/app/stores/user";
	import Button from "$lib/components/single/global/Button.svelte";
	import { BadgeCheck, Briefcase, Check, File, Link, MapPin, Pen, Plus, Trash, X } from "lucide-svelte";
	import AlumniOccMapModal from "../../global/AlumniOccMapModal.svelte";
	import { onMount } from "svelte";
	import TextField from "$lib/components/single/global/TextField.svelte";

    let {
        onExit
    } = $props();

    let alumniOccMapOpen = $state(false);
    let alumniOccAddress = $state(null);
    let editOn = $state(false);

    let civilStatus = $state({ value: "", error: "" });
    let phoneNumber = $state({ value: "", error: "" });
    let address = $state({ value: "", error: "" });
    let socials = $state([]);
    let occupations = $state([]);
    let soc = $state({
        platform: { value: "", error: "" },
        url: { value: "", error: "" },
    })
    let occ = $state({
        occupation: { value: "", error: "" },
        address: { value: "", error: "" },
        is_current: false
    })

    onMount(() => {
        civilStatus.value = $user.profile.civil_status;
        phoneNumber.value = $user.profile.phone_number;
        address.value = $user.profile.address;
        socials = $user.profile.socials;
        occupations = $user.profile.occupations;
    });
</script>

<div class="absolute top-0 left-0 w-screen h-screen bg-white/75 overflow-x-hidden overflow-y-auto flex flex-col items-center z-100 py-8">
    <div class="border border-gray-200 rounded-lg bg-white flex flex-col items-stretch p-6 gap-y-4 md:w-1/2">
        <div class="flex items-center justify-between">
            <h1 class="text-lg">{editOn ? "Edit Profile" : "My Profile"}</h1>
            {#if editOn}
                <Button
                    Icon={X}
                    label="Cancel"
                    size="s"
                    onclick={() => editOn = false}
                    class="bg-red-500"
                />
            {:else}
                <Button Icon={X} size="s" onclick={() => {
                    $settings.open = false;
                    $settings.tab = null;
                }} class="bg-transparent text-gray-700"/>
            {/if}
        </div>
        <div class="space-y-2">
            {#if !editOn}
                <div class="flex items-center gap-x-4">
                    <div
                        style="background-image: url({API_BASE_URL + `/uploads/alumni/profile_picture/${$user.profile.file_profile_picture}`})"
                        class="min-w-18 min-h-18 w-fit rounded-full bg-gray-200 bg-cover bg-center bg-no-repeat border border-gray-300"
                    ></div>
                    <div class="grow flex flex-col gap-y-2">
                        <div class="w-full flex items-center justify-between">
                            <h1 class="text-xl font-bold">{$user.profile.first_name}{$user.profile.name_extension && (" " + $user.profile.name_extension)} {$user.profile.middle_name && ($user.profile.middle_name + " ")}{$user.profile.last_name}</h1>
                            <Button
                                Icon={Pen}
                                label="Edit"
                                onclick={() => editOn = true}
                                size="s"
                                class="bg-blue-500"
                            />
                        </div>
                        {#if $user.profile.ver_stat_dean === "Verified"}
                            <div class="flex items-center gap-x-2">
                                <div class="flex items-center gap-x-2 px-2 rounded border border-blue-500">
                                    <BadgeCheck class="w-4 text-blue-500"/>
                                    <p class="w-fit text-blue-500">Dean Verified</p>
                                </div>
                            </div>
                        {/if}
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-6 mt-4">
                    <div class="flex flex-col space-y-2 border border-gray-200 rounded-lg p-6">
                        <h1 class="text-lg font-bold text-gray-500">Personal Information</h1>
                        <div class="flex flex-col w-full">
                            <span class="text-sm text-gray-400">Gender</span>
                            <span>{$user.profile.gender}</span>
                        </div>
                        <div class="flex flex-col w-full">
                            <span class="text-sm text-gray-400">Birth Date</span>
                            <span>{$user.profile.birth_date}</span>
                        </div>
                        <div class="flex flex-col w-full">
                            <span class="text-sm text-gray-400">Birth Place</span>
                            <span>{$user.profile.birth_place}</span>
                        </div>
                        <div class="flex flex-col w-full">
                            <span class="text-sm text-gray-400">Civil Status</span>
                            <span>{$user.profile.civil_status}</span>
                        </div>
                    </div>
                    <div class="flex flex-col space-y-2 border border-gray-200 rounded-lg p-6">
                        <h1 class="text-lg font-bold text-gray-500">Contact Information</h1>
                        <div class="flex flex-col w-full">
                            <span class="text-sm text-gray-400">Phone Number</span>
                            <span>{$user.profile.phone_number}</span>
                        </div>
                        <div class="flex flex-col w-full">
                            <span class="text-sm text-gray-400">Email</span>
                            <span>{$user.email}</span>
                        </div>
                        <div class="flex flex-col w-full">
                            <span class="text-sm text-gray-400">Address</span>
                            <span>{$user.profile.address}</span>
                        </div>
                        <div class="flex flex-col w-full">
                            <span class="text-sm text-gray-400">Social Media</span>
                            {#each $user.profile.socials as social}
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
                    <div class="flex flex-col space-y-2 md:col-span-2 border border-gray-200 rounded-lg p-6">
                        <h1 class="text-lg font-bold text-gray-500">Education Information</h1>
                        <div class="flex flex-col w-full">
                            <span class="text-sm text-gray-400">Course</span>
                            <span>{$user.profile.course.name}</span>
                        </div>
                        <div class="flex flex-col w-full">
                            <span class="text-sm text-gray-400">Student Number</span>
                            <span>{$user.profile.student_number ? $user.profile.student_number : "N/A"}</span>
                        </div>
                        <div class="flex flex-col w-full">
                            <span class="text-sm text-gray-400">Year Graduated</span>
                            <span>{$user.profile.graduation_year}</span>
                        </div>
                    </div>
                    <div class="flex flex-col space-y-2 md:col-span-2 border border-gray-200 rounded-lg p-6">
                        <h1 class="text-lg font-bold text-gray-500">Career</h1>
                        <div class="flex flex-col w-full">
                            <span class="text-sm text-gray-400">Employment Status</span>
                            <span>{$user.profile.employment_status}</span>
                        </div>
                        <div class="flex flex-col w-full">
                            <span class="text-sm text-gray-400">Curriculum Vitae</span>
                            <div class="flex items-center gap-x-2 text-blue-700">
                                <File class="min-w-4 max-w-4"/>
                                <a
                                    href={API_BASE_URL + "/uploads/alumni/cv/" + $user.profile.file_cv}
                                    target="_blank"
                                >View CV</a>
                            </div>
                        </div>
                        <div class="flex flex-col w-full">
                            <span class="text-sm text-gray-400">Occupations</span>
                            {#each $user.profile.occupations as occupation}
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
            {:else}
                <div class="p-6 border border-gray-300 rounded-lg">
                    <div class="flex flex-col items-stretch space-y-2">
                        <p class="text-lg text-gray-500 font-bold">Personal Information</p>
                        <div class="w-full flex flex-col items-stretch">
                            <span class="mb-2 text-sm">Civil Status</span>
                            <select
                                bind:value={civilStatus.value}
                                class="px-6 py-4 rounded-lg border border-gray-300"
                            >
                                <option value="Single">Single</option>
                                <option value="Married">Married</option>
                                <option value="Widowed">Widowed</option>
                                <option value="Separated">Separated</option>
                            </select>
                            {#if civilStatus.error}
                                <span class="text-red-500 text-sm">{civilStatus.error}</span>
                            {/if}
                        </div>
                        <Button
                            Icon={Check}
                            label="Save Changes"
                            onclick={() => {}}
                            class="bg-blue-500 mt-2"
                        />
                    </div>
                </div>

                <div class="p-6 border border-gray-300 rounded-lg my-6">
                    <div class="flex flex-col items-stretch space-y-2">
                        <p class="text-lg text-gray-500 font-bold">Contact Information</p>
                        <div class="w-full flex flex-col items-stretch">
                            <span class="mb-2 text-sm">Phone Number</span>
                            <TextField
                                bind:value={phoneNumber.value}
                            />
                            {#if phoneNumber.error}
                                <span class="text-red-500 text-sm">{phoneNumber.error}</span>
                            {/if}
                        </div>
                        <div class="w-full flex flex-col items-stretch">
                            <span class="mb-2 text-sm">Phone Number</span>
                            <TextField
                                bind:value={address.value}
                            />
                            {#if address.error}
                                <span class="text-red-500 text-sm">{address.error}</span>
                            {/if}
                        </div>
                        <div class="w-full flex flex-col items-stretch">
                            <span class="mb-2 text-sm">Socials</span>
                            {#each socials as social}
                                <div class="w-full flex items-center">
                                    <input type="text" value={social.platform} readonly class="min-w-1/6 border-0 px-0">
                                    <div class="grow flex items-center justify-between gap-x-2">
                                        <div class="flex items-center gap-x-1">
                                            <Link class="w-4"/>
                                            <input type="text" value={social.url} readonly class="grow border-0 px-0">
                                        </div>
                                        <Button
                                            Icon={Trash}
                                            onclick={() => {}}
                                            size="s"
                                            class="bg-red-500"
                                        />
                                    </div>
                                </div>
                            {/each}
                            <span class="pt-4 pb-2">Add Social Media</span>
                            <div class="grid grid-cols-8 gap-x-4">
                                <div class="w-full flex flex-col items-stretch col-span-2">
                                    <span class="mb-2 text-sm">Platform</span>
                                    <TextField
                                        bind:value={soc.platform.value}
                                    />
                                </div>
                                <div class="w-full flex flex-col items-stretch col-span-6">
                                    <span class="mb-2 text-sm">URL</span>
                                    <div class="flex items-center gap-x-2">
                                        <TextField
                                            bind:value={soc.url.value}
                                            class="grow"
                                        />
                                        <Button
                                            Icon={Plus}
                                            label="Add"
                                            onclick={() => {}}
                                            class="bg-green-500"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Button
                            Icon={Check}
                            label="Save Changes"
                            onclick={() => {}}
                            class="bg-blue-500 mt-2"
                        />
                    </div>
                </div>

                <div class="p-6 border border-gray-300 rounded-lg">
                    <div class="flex flex-col items-stretch gap-y-2">
                        <p class="text-lg text-gray-500 font-bold">Career</p>
                        <div class="w-full flex flex-col items-stretch">
                            <span class="mb-2 text-sm">Occupations</span>
                            {#each occupations as occupation, index}
                                <div class="w-full flex items-center">
                                    <input type="text" value={occupation.occupation} readonly class="min-w-1/6 border-0 px-0">
                                    <div class="grow flex items-center gap-x-1">
                                        <MapPin class="w-4"/>
                                        <input type="text" value={occupation.address} readonly class="grow border-0 px-0">
                                    </div>
                                    <label for={`current-${index}`} class="flex items-center">
                                        <input
                                            id={`current-${index}`}
                                            type="checkbox"
                                            checked={occupation.is_current}
                                            class="rounded"
                                        >
                                        <span class="ml-2">Current Occupation</span>
                                    </label>
                                </div>
                            {/each}
                            <span class="pt-4 pb-2">Add New</span>
                            <div>
                                <div class="grid grid-cols-8 gap-x-4">
                                    <div class="w-full flex flex-col items-stretch col-span-2">
                                        <span class="mb-2 text-sm">Occupation</span>
                                        <TextField
                                            bind:value={occ.occupation.value}
                                        />
                                    </div>
                                    <div class="w-full flex flex-col items-stretch col-span-6">
                                        <span class="mb-2 text-sm">URL</span>
                                        <div class="flex items-center gap-x-2">
                                            <TextField
                                                bind:value={occ.address.value}
                                                class="grow"
                                            />
                                            <Button
                                                Icon={Plus}
                                                label="Add"
                                                onclick={() => {}}
                                                class="bg-green-500"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <label for="current-occ" class="flex items-center mt-1">
                                    <input
                                        id="current-occ"
                                        type="checkbox"
                                        checked={occ.is_current}
                                        class="rounded"
                                    >
                                    <span class="ml-2">Current Occupation</span>
                                </label>
                            </div>
                        </div>
                        <Button
                            Icon={Check}
                            label="Save Changes"
                            onclick={() => {}}
                            class="bg-blue-500 mt-2"
                        />
                    </div>
                </div>
            {/if}
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