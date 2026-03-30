<script>
	import { API_BASE_URL } from "$lib/app/core/constants";
	import { settings } from "$lib/app/stores/alumni";
	import { user } from "$lib/app/stores/user";
	import Button from "$lib/components/single/global/Button.svelte";
	import { BadgeCheck, Briefcase, Check, ChevronRight, Edit, File, Link, MapPin, Pen, Plus, Trash, X } from "lucide-svelte";
	import AlumniOccMapModal from "../../global/AlumniOccMapModal.svelte";
	import { onMount } from "svelte";
	import TextField from "$lib/components/single/global/TextField.svelte";
	import { twMerge } from "tailwind-merge";
	import { Toast } from "$lib/app/utils/swal";
	import { AlumniService } from "$lib/app/services/users/alumni";
	import { UserService } from "$lib/app/services/users/user";

    let {
        onExit
    } = $props();

    let alumniOccMapOpen = $state(false);
    let alumniOccAddress = $state(null);
    let editOn = $state(false);

    let civilStatus = $state({ value: "", error: "" });
    let employmentStatus = $state({ value: "", error: "" });
    let phoneNumber = $state({ value: "", error: "" });
    let address = $state({ value: "", error: "" });
    let socials = $state([]);
    let occupations = $state([]);
    let soc = $state({
        platform: { value: "", error: "" },
        url: { value: "", error: "" },
    });
    let occ = $state({
        id: null,
        occupation: { value: "", error: "" },
        company: { value: "", error: "" },
        address: { value: "", error: "" },
        start_year: { value: null, error: "" },
        end_year: { value: null, error: "" },
        is_current: false,
        edit: false,
    });

    async function refreshUser() {
        await UserService.me(
			async (data, status) => {
				user.set(data);

                civilStatus.value = data.profile.civil_status;
                employmentStatus.value = data.profile.employment_status;
                phoneNumber.value = data.profile.phone_number;
                address.value = data.profile.address;
                socials = data.profile.socials;
                occupations = data.profile.occupations.map((o) => ({
                    id: o.id,
                    occupation: { value: o.occupation, error: "" },
                    company: { value: o.company, error: "" },
                    address: { value: o.address, error: "" },
                    start_year: { value: o.start_year, error: "" },
                    end_year: { value: o.end_year, error: "" },
                    is_current: o.is_current,
                    edit: false
                }));
			},
			async (data, status) => {
				
			}
		);
    }

    async function onCreateSocial() {
        if (!soc.platform.value.trim()) {
            soc.platform.error = "Platform is required.";
            return;
        }

        if (!soc.url.value.trim()) {
            soc.url.error = "URL is required.";
            return;
        }
        
        await AlumniService.createAlumniSocial(
            { platform: soc.platform.value, url: soc.url.value },
            async (data, status) => {
                soc = {
                    platform: { value: "", error: "" },
                    url: { value: "", error: "" },
                };

                await refreshUser();
                await Toast.fire({
                    title: data?.message ?? "Social has been added.",
                    icon: "success"
                });
            },
            async (data, status) => {
                await Toast.fire({
                    title: data?.message ?? "Unable to add social.",
                    icon: "error"
                });
            },
        );
    }

    async function onDeleteSocial(id) {
        await AlumniService.deleteAlumniSocial(
            id,
            async (data, status) => {
                socials = socials.filter((s) => s.id !== id);
                
                await Toast.fire({
                    title: data?.message ?? "Social has been deleted.",
                    icon: "success"
                });
            },
            async (data, status) => {
                await Toast.fire({
                    title: data?.message ?? "Unable to delete social.",
                    icon: "error"
                });
            },
        );
    }

    async function updatePersonal() {
        await AlumniService.updatePersonal(
            { civil_status: civilStatus.value },
            async (data, stat) => {
                await refreshUser();
                await Toast.fire({
                    title: data?.message ?? "Personal information has been updated.",
                    icon: "success"
                });
            },
            async (data, stat) => {
                await Toast.fire({
                    title: data?.message ?? "Unable to update personal information.",
                    icon: "error"
                });
            },
        )
    }

    async function updateContactInfo() {
        let hasError = false;
        
        if (!phoneNumber.value.trim()) {
            phoneNumber.error = "Phone number is required.";
            hasError = true;
        }
        
        if (!address.value.trim()) {
            address.error = "Address is required.";
            hasError = true;
        }

        if (hasError) return;

        let data = { phone_number: phoneNumber.value, address: address.value };
        
        await AlumniService.updateContact(
            data,
            async (data, stat) => {
                await refreshUser();
                await Toast.fire({
                    title: data?.message ?? "Contact information has been updated.",
                    icon: "success"
                });
            },
            async (data, stat) => {
                await Toast.fire({
                    title: data?.message ?? "Unable to update contact information.",
                    icon: "error"
                });
            },
        );
    }

    async function updateCareerInfo() {
        // ensure that if the alumni is unemployed, they should have no occupations that are checked as current
        if (employmentStatus.value === "Unemployed" && occupations.some((o) => o.is_current)) {
            await Toast.fire({
                title: "You should not have any current occupations when you're unemployed.",
                icon: "error",
            });
            return;
        }

        // ensure that if the alumni is unemployed, all of their past occupations has an end year specified in it
        if (employmentStatus.value === "Unemployed" && occupations.some((o) => !o.end_year.value)) {
            await Toast.fire({
                title: "All occupations should have an end year if you're unemployed.",
                icon: "error",
            });
            return;
        }

        // ensure that if the alumni is employed/self-employed, they have at least one current occupation
        if (employmentStatus.value !== "Unemployed" && !occupations.some((o) => o.is_current)) {
            await Toast.fire({
                title: "You should have at least one current occupation if you're employed or self-employed.",
                icon: "error",
            });
            return;
        }
        
        let hasErrors = false;

        occupations.forEach(async (o, index) => {    
            // ensure that required fields have values
            if (!o.occupation.value.trim()) {
                occupations[index].occupation.error = "Occupation is required";
                hasErrors = true;
            }
            if (!o.company.value.trim()) {
                occupations[index].company.error = "Company is required";
                hasErrors = true;
            }
            if (!o.address.value.trim()) {
                occupations[index].address.error = "Address is required";
                hasErrors = true;
            }
            if (!o.start_year.value) {
                occupations[index].start_year.error = "Start year is required";
                hasErrors = true;
            }
            if (!o.is_current && !o.end_year.value) {
                occupations[index].end_year.error = "End year is required";
                hasErrors = true;
            }

            // ensure that start year is valid
            if (
                !occupations[index].start_year.error &&
                !occupations[index].is_current &&
                parseInt(o.start_year.value) > parseInt(o.end_year.value)
            ) {
                occupations[index].start_year.error = "Should be earlier than end year.";
                hasErrors = true;
            }

            // ensure that end year is valid
            if (
                !occupations[index].start_year.error &&
                !occupations[index].is_current &&
                parseInt(o.end_year.value) < parseInt(o.start_year.value)
            ) {
                occupations[index].start_year.error = "Should be later than start year.";
                hasErrors = true;
            }
        })

        if (hasErrors) {
            await Toast.fire({
                title: "Please fill up all the required fields and ensure that there were no errors before saving.",
                icon: "error",
            });
            return;
        }

        const formattedData = {
            employment_status: employmentStatus.value,
            occupations: JSON.stringify(occupations.map((o) => ({
                id: o.id,
                occupation: o.occupation.value,
                company: o.company.value,
                address: o.address.value,
                start_year: o.start_year.value,
                end_year: o.end_year.value,
                is_current: o.is_current,
            })))
        };
        
        await AlumniService.updateCareer(
            formattedData,
            async (data, stat) => {
                await refreshUser();
                await Toast.fire({
                    title: data?.message ?? "Career information has been updated.",
                    icon: "success"
                });
            },
            async (data, stat) => {
                await Toast.fire({
                    title: data?.message ?? "Unable to update career information.",
                    icon: "error"
                });
            },
        );
    }

    onMount(refreshUser);
</script>

<div class="absolute top-0 left-0 w-screen h-screen bg-white/75 overflow-x-hidden overflow-y-auto flex flex-col items-center z-100 py-8">
    <div class="border border-gray-200 rounded-lg bg-white flex flex-col items-stretch p-6 gap-y-4 md:w-1/2 z-100">
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
                            <span class="text-sm text-gray-400 mb-2">Occupation History</span>
                            <div class="w-full border border-gray-300 rounded-lg [&>*:not(:last-child)]:border-b [&>*:not(:last-child)]:border-b-gray-300">
                                {#each [...$user.profile.occupations].sort((a, b) => {
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
                            onclick={updatePersonal}
                            class="bg-blue-500 mt-2"
                        />
                    </div>
                </div>

                <div class="p-6 border border-gray-300 rounded-lg my-6">
                    <div class="flex flex-col items-stretch space-y-2">
                        <p class="text-lg text-gray-500 font-bold">Contact Information</p>
                        <div class="w-full flex flex-col items-stretch">
                            <span class="mb-2 text-sm">Phone Number</span>
                            <input
                                type="text"
                                bind:value={phoneNumber.value}
                                class="border border-gray-300 rounded-lg"
                                oninput={(e) => phoneNumber.error = e.target.value.trim() ? "" : "Phone number is required."}
                            >
                            {#if phoneNumber.error}
                                <span class="text-red-500 text-sm">{phoneNumber.error}</span>
                            {/if}
                        </div>
                        <div class="w-full flex flex-col items-stretch">
                            <span class="mb-2 text-sm">Address</span>
                            <input
                                type="text"
                                bind:value={address.value}
                                class="border border-gray-300 rounded-lg"
                                oninput={(e) => address.error = e.target.value.trim() ? "" : "Address is required."}
                            >
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
                                            onclick={async () => {
                                                await onDeleteSocial(social.id);
                                            }}
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
                                            onclick={onCreateSocial}
                                            class="bg-green-500"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Button
                            Icon={Check}
                            label="Save Changes"
                            onclick={updateContactInfo}
                            class="bg-blue-500 mt-2"
                        />
                    </div>
                </div>

                <div class="p-6 border border-gray-300 rounded-lg">
                    <div class="flex flex-col items-stretch gap-y-2">
                        <p class="text-lg text-gray-500 font-bold">Career Information</p>

                        <div class="w-full flex flex-col items-stretch">
                            <span class="mb-2 text-sm">Civil Status</span>
                            <select
                                bind:value={employmentStatus.value}
                                onchange={(e) => {
                                    if (e.target.value === "Unemployed") {
                                        occupations = occupations.map((o) => ({
                                            ...o,
                                            is_current: false,
                                            edit: o.is_current,
                                            end_year: { ...o.end_year, error: (o.is_current && !o.end_year.value) ? "End year is required." : "" }
                                        }));
                                    }
                                }}
                                class="px-6 py-4 rounded-lg border border-gray-300"
                            >
                                <option value="Unemployed">Unemployed</option>
                                <option value="Employed">Employed</option>
                                <option value="Self-employed">Self-employed</option>
                            </select>
                            {#if employmentStatus.error}
                                <span class="text-red-500 text-sm">{employmentStatus.error}</span>
                            {/if}
                        </div>
                        
                        <div class="w-full flex flex-col items-stretch">
                            <span class="mb-2 text-sm">Occupations</span>
                            <div class="space-y-4">
                                {#each occupations as occupation, index}
                                    <div class="w-full flex items-center border border-gray-300 p-4 rounded-lg gap-x-4">
                                        {#if occupation.edit}
                                            <div class="flex grow flex-col justify-between gap-y-2">
                                                <div class="flex flex-col items-stretch gap-y-2">
                                                    <span class="text-sm">Occupation</span>
                                                    <div class="flex flex-col items-stretch">
                                                        <input
                                                            type="text"
                                                            bind:value={occupation.occupation.value}
                                                            class="border border-gray-300 rounded-lg"
                                                            oninput={(e) => occupations[index].occupation.error = e.target.value.trim() ? "" : "Occupation is required."}
                                                        >
                                                        {#if occupation.occupation.error}
                                                            <span class="text-sm text-red-500">{occupation.occupation.error}</span>
                                                        {/if}
                                                    </div>
                                                </div>

                                                <div class="flex flex-col items-stretch gap-y-2">
                                                    <span class="text-sm">Company</span>
                                                    <div class="flex flex-col items-stretch">
                                                        <input
                                                            type="text"
                                                            bind:value={occupation.company.value}
                                                            class="border border-gray-300 rounded-lg"
                                                            oninput={(e) => occupations[index].company.error = e.target.value.trim() ? "" : "Company is required."}
                                                        >
                                                        {#if occupation.company.error}
                                                            <span class="text-sm text-red-500">{occupation.company.error}</span>
                                                        {/if}
                                                    </div>
                                                </div>

                                                <div class="flex flex-col items-stretch gap-y-2">
                                                    <span class="text-sm">Address</span>
                                                    <div class="flex flex-col items-stretch">
                                                        <input
                                                            type="text"
                                                            bind:value={occupation.address.value}
                                                            class="border border-gray-300 rounded-lg"
                                                            oninput={(e) => occupations[index].address.error = e.target.value.trim() ? "" : "Address is required."}
                                                        >
                                                        {#if occupation.address.error}
                                                            <span class="text-sm text-red-500">{occupation.address.error}</span>
                                                        {/if}
                                                    </div>
                                                </div>

                                                <div class="grid grid-cols-2 gap-x-4">
                                                    <div class={twMerge("flex flex-col items-stretch gap-y-2", occupation.is_current && "col-span-2")}>
                                                        <span class="text-sm">Start Year</span>
                                                        <div class="flex flex-col items-stretch">
                                                            <input
                                                                type="number"
                                                                bind:value={occupation.start_year.value}
                                                                class="border border-gray-300 rounded-lg"
                                                                oninput={(e) => {
                                                                    occupations[index].start_year.error = e.target.value.trim() ? "" : "Start year is required.";

                                                                    if (!occupations[index].start_year.error) {
                                                                        if (parseInt(e.target.value) > parseInt(occupations[index].end_year.value)) {
                                                                            occupations[index].start_year.error = "Should be earlier than end year.";
                                                                        }
                                                                    }
                                                                }}
                                                            >
                                                            {#if occupation.start_year.error}
                                                                <span class="text-sm text-red-500">{occupation.start_year.error}</span>
                                                            {/if}
                                                        </div>
                                                    </div>
                                                    {#if !occupation.is_current}
                                                        <div class="flex flex-col items-stretch gap-y-2">
                                                            <span class="text-sm">End Year</span>
                                                            <div class="flex flex-col items-stretch">
                                                            <input
                                                                type="number"
                                                                bind:value={occupation.end_year.value}
                                                                class="border border-gray-300 rounded-lg"
                                                                oninput={(e) => {
                                                                    occupations[index].end_year.error = String(e.target.value).trim() ? "" : "End year is required.";

                                                                    if (!occupations[index].end_year.error) {
                                                                        if (parseInt(e.target.value) < parseInt(occupations[index].start_year.value)) {
                                                                            occupations[index].end_year.error = "Should be later than start year.";
                                                                        }
                                                                    }
                                                                }}
                                                            >
                                                            {#if occupation.end_year.error}
                                                                <span class="text-sm text-red-500">{occupation.end_year.error}</span>
                                                            {/if}
                                                        </div>
                                                        </div>
                                                    {/if}
                                                </div>

                                                <label
                                                    for={`checked-${index}`}
                                                    class="flex items-center gap-x-2 cursor-pointer"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        bind:checked={occupation.is_current}
                                                        onchange={(e) => {
                                                            if (e.target.value) {
                                                                if (employmentStatus.value === "Unemployed") employmentStatus.value = "Employed";
                                                                
                                                                occupations[index].end_year.value = null;
                                                            } else {
                                                                occupations[index].end_year.error = occupations[index].end_year.value ? "" : "End year is required.";

                                                                if (occupations.filter((o) => o.is_current).length === 0) {
                                                                    employmentStatus.value = "Unemployed";
                                                                }
                                                            }
                                                        }}
                                                        id={`checked-${index}`}
                                                        class="rounded"
                                                    >
                                                    <span>Current Occupation</span>
                                                </label>
                                                
                                                <Button
                                                    Icon={X}
                                                    label="Cancel"
                                                    class="bg-red-500 text-white mt-2"
                                                    onclick={() => occupations[index].edit = false}
                                                />
                                            </div>
                                        {:else}
                                            <div class="flex items-center justify-between w-full">
                                                <div class="flex items-center gap-x-2">
                                                    <Briefcase class="min-w-4 max-w-4"/>
                                                    <span>{occupation.occupation.value}</span>
                                                </div>
                                                <button
                                                    onclick={() => occupations[index].edit = true}
                                                    class="cursor-pointer"
                                                >
                                                    <ChevronRight class="min-w-4 max-w-4"/>
                                                </button>
                                            </div>
                                        {/if}
                                    </div>
                                {/each}
                            </div>

                            <hr class="border-t border-gray-300 mt-6">
                            
                            <span class="pt-4 pb-2">Add New</span>
                            <div class="flex flex-col items-stretch gap-y-2">
                                <div class="flex flex-col items-stretch gap-y-2">
                                    <span class="text-sm">Occupation</span>
                                    <div class="flex flex-col items-stretch">
                                        <input
                                            type="text"
                                            bind:value={occ.occupation.value}
                                            class="border border-gray-300 rounded-lg"
                                            oninput={(e) => occ.occupation.error = e.target.value.trim() ? "" : "Occupation is required."}
                                        >
                                        {#if occ.occupation.error}
                                            <span class="text-sm text-red-500">{occ.occupation.error}</span>
                                        {/if}
                                    </div>
                                </div>

                                <div class="flex flex-col items-stretch gap-y-2">
                                    <span class="text-sm">Company</span>
                                    <div class="flex flex-col items-stretch">
                                        <input
                                            type="text"
                                            bind:value={occ.company.value}
                                            class="border border-gray-300 rounded-lg"
                                            oninput={(e) => occ.company.error = e.target.value.trim() ? "" : "Company is required."}
                                        >
                                        {#if occ.company.error}
                                            <span class="text-sm text-red-500">{occ.company.error}</span>
                                        {/if}
                                    </div>
                                </div>

                                <div class="flex flex-col items-stretch gap-y-2">
                                    <span class="text-sm">Address</span>
                                    <div class="flex flex-col items-stretch">
                                        <input
                                            type="text"
                                            bind:value={occ.address.value}
                                            class="border border-gray-300 rounded-lg"
                                            oninput={(e) => occ.address.error = e.target.value.trim() ? "" : "Address is required."}
                                        >
                                        {#if occ.address.error}
                                            <span class="text-sm text-red-500">{occ.address.error}</span>
                                        {/if}
                                    </div>
                                </div>

                                <div class="grid grid-cols-2 gap-x-4">
                                    <div class={twMerge("flex flex-col items-stretch gap-y-2", occ.is_current && "col-span-2")}>
                                        <span class="text-sm">Start Year</span>
                                        <div class="flex flex-col items-stretch">
                                            <input
                                                type="number"
                                                bind:value={occ.start_year.value}
                                                class="border border-gray-300 rounded-lg"
                                                oninput={(e) => {
                                                    occ.start_year.error = e.target.value.trim() ? "" : "Start year is required."

                                                    if (!occ.start_year.error) {
                                                        if (parseInt(e.target.value) > parseInt(occ.end_year.value)) {
                                                            occ.start_year.error = "Should be earlier than end year.";
                                                        }
                                                    }
                                                }}
                                            >
                                            {#if occ.start_year.error}
                                                <span class="text-sm text-red-500">{occ.start_year.error}</span>
                                            {/if}
                                        </div>
                                    </div>
                                    {#if !occ.is_current}
                                        <div class="flex flex-col items-stretch gap-y-2">
                                            <span class="text-sm">End Year</span>
                                            <div class="flex flex-col items-stretch">
                                            <input
                                                type="number"
                                                bind:value={occ.end_year.value}
                                                class="border border-gray-300 rounded-lg"
                                                oninput={(e) => {
                                                    occ.end_year.error = String(e.target.value).trim() ? "" : "End year is required."

                                                    if (!occ.end_year.error) {
                                                        if (parseInt(e.target.value) < parseInt(occ.start_year.value)) {
                                                            occ.end_year.error = "Should be later than start year.";
                                                        }
                                                    }
                                                }}
                                            >
                                            {#if occ.end_year.error}
                                                <span class="text-sm text-red-500">{occ.end_year.error}</span>
                                            {/if}
                                        </div>
                                        </div>
                                    {/if}
                                </div>

                                <label
                                    for="checked-new"
                                    class="flex items-center gap-x-2 cursor-pointer"
                                >
                                    <input
                                        type="checkbox"
                                        bind:checked={occ.is_current}
                                        onchange={(e) => {
                                            if (e.target.value) occ.end_year.value = null;
                                        }}
                                        id="checked-new"
                                        class="rounded"
                                    >
                                    <span>Current Occupation</span>
                                </label>
                            </div>
                        </div>
                        
                        <Button
                            Icon={Plus}
                            label="Add"
                            onclick={() => {
                                if (
                                    occ.occupation.error ||
                                    occ.company.error ||
                                    occ.address.error ||
                                    occ.start_year.error ||
                                    occ.end_year.error
                                ) return;

                                if (
                                    !occ.occupation.value ||
                                    !occ.company.value ||
                                    !occ.address.value ||
                                    !occ.start_year.value ||
                                    (!occ.is_current && !occ.end_year.value)
                                ) return;

                                occupations.push({
                                    ...occ,
                                    occupation: { ...occ.occupation },
                                    company: { ...occ.company },
                                    address: { ...occ.address },
                                    start_year: { ...occ.start_year },
                                    end_year: { ...occ.end_year }
                                });

                                if (occupations.filter((o) => o.is_current).length === 0) {
                                    employmentStatus.value = "Unemployed";
                                } else {
                                    employmentStatus.value = "Employed";
                                }

                                occ = {
                                    id: null,
                                    occupation: { value: "", error: "" },
                                    company: { value: "", error: "" },
                                    address: { value: "", error: "" },
                                    start_year: { value: null, error: "" },
                                    end_year: { value: null, error: "" },
                                    is_current: false,
                                    edit: false
                                }
                            }}
                            class="border border-green-500 mt-2 bg-transparent text-green-500"
                        />

                        <hr class="border-t border-gray-300 mt-6 mb-4">
                        
                        <Button
                            Icon={Check}
                            label="Save Changes"
                            onclick={updateCareerInfo}
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