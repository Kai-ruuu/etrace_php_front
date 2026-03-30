<script>
    import Papa from "papaparse";
	import { RecordService } from "$lib/app/services/insti/record";
	import { Toast } from "$lib/app/utils/swal";
	import Button from "$lib/components/single/global/Button.svelte";
	import { Info, Key, X } from "lucide-svelte";
	import { onMount } from "svelte";
	import { capitalizeWords, highlightMatch } from "$lib/app/utils/output";
	import { twMerge } from "tailwind-merge";

    let {
        alumni,
        onExit
    } = $props();

    let formattedProfile = $state(null);
    let matches = $state([]);

    function formatRows(rows) {
        return rows.map((r) => {
            const [month, day, year] = String(r["Birthdate"]).split("/");
            const birthDate = `${year}-${month}-${day}`;
            
            return {
                student_number: r["Student Number"],
                birth_date: birthDate,
                birth_place: r["Birthplace"],
                last_name: capitalizeWords(r["Last Name"]),
                first_name: capitalizeWords(r["First Name"]),
                middle_name: r["Middle Name"].toLowerCase() === "n/a" ? "" : capitalizeWords(r["Middle Name"]),
                gender: capitalizeWords(r["Gender"]),
                address: capitalizeWords(r["Full Address"]),
                phone_number: r["Contact Number"]
            };
        });
    }

    function formatProfile(alumni) {
        const p = alumni.profile;
        let [year, month, day] = p.birth_date.split("-");

        return {
            student_number: p.student_number,
            birth_date: `${year}-${parseInt(month)}-${parseInt(day)}`,
            birth_place: p.birth_place,
            last_name: p.last_name,
            first_name: p.name_extension
                ? (p.first_name + " " + p.name_extension)
                : p.first_name,
            middle_name: p.middle_name,
            gender: p.gender,
            address: p.address,
            phone_number: p.phone_number,
        };
    }

    function hasMatched(match, key) {
        return match.row[key].matched;
    }

    function getBgColor(match) {
        const percentage = match.match_percentage;

        if (percentage < 75) return "bg-red-100";
        if (percentage <= 100) return "bg-green-100";
    }

    onMount(async () => {
        RecordService.findFromAlumni(alumni,
            async (data, stat) => {
                let content = Papa.parse(data.content, {
                    header: true,
                    skipEmptyLines: true,
                });

                let prof = formatProfile(alumni);
                let rows = formatRows(content.data);

                formattedProfile = prof;

                rows.forEach(r => {
                    const p = prof;
                    let rowScore = 0;
                    let rowMaxScore = Object.keys(p).length;
                    let formattedRow = {};

                    Object.entries(p).forEach(([key, value]) => {
                        const pVals = String(value).toLowerCase().split(" ");
                        const rVals = String(r[key]).toLowerCase().split(" ");

                        const hasMatch = pVals.some(pv => rVals.includes(pv));

                        rowScore += hasMatch ? 1 : 0;
                        formattedRow[key] = { value: r[key], matched: hasMatch };
                    });

                    matches.push({
                        row: formattedRow,
                        match_percentage: ((rowScore / rowMaxScore) * 100).toFixed(0)
                    });

                });

                matches.sort((a, b) => b.match_percentage - a.match_percentage);
            },
            async (data, stat) => {
                await Toast.fire({
                    title: data?.message ?? "Record for alumni was not found.",
                    icon: "error"
                });
            },
        );
    })
</script>

<div class="absolute top-0 left-0 w-screen h-screen bg-white/75 overflow-y-auto flex flex-col items-center p-8">
    <div class="border border-gray-200 rounded-lg bg-white flex flex-col items-stretch p-6 gap-y-4 my-auto mt-8 md:w-4/5 overflow-x-auto">
        <div class="flex items-center justify-between">
            <h1 class="text-lg">Finding
                <strong>{alumni.profile.first_name}{alumni.profile.name_extension && (" " + alumni.profile.name_extension)} 
                {alumni.profile.middle_name && (alumni.profile.middle_name + " ")}{alumni.profile.last_name}</strong> 
                in
                <strong>{alumni.profile.graduation_year} {alumni.profile.course.code} Record.</strong>
            </h1>
            <Button Icon={X} size="s" onclick={onExit} class="bg-transparent text-gray-700"/>
        </div>
        <p class="text-sm text-amber-500 border border-amber-200 rounded-md px-4 py-2">
            <span class="flex items-center gap-x-2 mb-2">
                <Info class="min-w-4 max-w-4"/>
                <span>Note</span>
            </span>
            <span>These match results are for reference purposes only. The matching is based on a <strong>word-similarity algorithm</strong> and may not be fully accurate. It is still recommended to verify the alumni's information against the actual records.</span>
        </p>
        <hr class="border-t border-gray-200 mt-2">
        {#if matches.length > 0}
            <div class="overflow-x-auto max-w-[calc(100%-1px)] pb-6">
                <h1 class="text-lg">Match Results</h1>
                <table>
                    <thead>
                        <tr>
                            <th class="bg-white text-left text-nowrap py-2">Match Percentage</th>
                            <th class="bg-white text-left text-nowrap pl-4 py-2">First Name</th>
                            <th class="bg-white text-left text-nowrap pl-4 py-2">Middle Name</th>
                            <th class="bg-white text-left text-nowrap pl-4 py-2">Last Name</th>
                            <th class="bg-white text-left text-nowrap pl-4 py-2">Birthdate</th>
                            <th class="bg-white text-left text-nowrap pl-4 py-2">Birthplace</th>
                            <th class="bg-white text-left text-nowrap pl-4 py-2">Gender</th>
                            <th class="bg-white text-left text-nowrap pl-4 py-2">Student Number</th>
                            <th class="bg-white text-left text-nowrap pl-4 py-2">Contact Number</th>
                            <th class="bg-white text-left text-nowrap pl-4 py-2">Address</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each matches as match}
                            <tr>
                                <td class={twMerge("text-nowrap pl-4", getBgColor(match))}>{match.match_percentage}%</td>
                                <td class={twMerge("text-nowrap pl-4 py-2", hasMatched(match, "first_name") ? "bg-green-50" : "bg-red-50")}>{match.row.first_name.value}</td>
                                <td class={twMerge("text-nowrap pl-4 py-2", hasMatched(match, "middle_name") ? "bg-green-50" : "bg-red-50")}>{match.row.middle_name.value ? match.row.middle_name.value : "-"}</td>
                                <td class={twMerge("text-nowrap pl-4 py-2", hasMatched(match, "last_name") ? "bg-green-50" : "bg-red-50")}>{match.row.last_name.value}</td>
                                <td class={twMerge("text-nowrap pl-4 py-2", hasMatched(match, "birth_date") ? "bg-green-50" : "bg-red-50")}>{match.row.birth_date.value}</td>
                                <td class={twMerge("text-nowrap pl-4 py-2", hasMatched(match, "birth_place") ? "bg-green-50" : "bg-red-50")}>{match.row.birth_place.value}</td>
                                <td class={twMerge("text-nowrap pl-4 py-2", hasMatched(match, "gender") ? "bg-green-50" : "bg-red-50")}>{match.row.gender.value}</td>
                                <td class={twMerge("text-nowrap pl-4 py-2", hasMatched(match, "student_number") ? "bg-green-50" : "bg-red-50")}>{match.row.student_number.value}</td>
                                <td class={twMerge("text-nowrap pl-4 py-2", hasMatched(match, "phone_number") ? "bg-green-50" : "bg-red-50")}>{match.row.phone_number.value}</td>
                                <td class={twMerge("text-nowrap px-4 py-2", hasMatched(match, "address") ? "bg-green-50" : "bg-red-50")}>{match.row.address.value}</td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        {:else}
            <div>The are no matching record rows to the alumni information.</div>
        {/if}
    </div>
</div>