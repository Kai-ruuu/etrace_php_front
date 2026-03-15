<script>
	import { goto } from "$app/navigation";
	import { CourseService } from "$lib/app/services/insti/course";
	import { AlumniService } from "$lib/app/services/users/alumni";
	import { PlatformService } from "$lib/app/services/users/platform";
	import { Toast } from "$lib/app/utils/swal";
	import BaseContainer from "$lib/components/single/global/BaseContainer.svelte";
	import Button from "$lib/components/single/global/Button.svelte";
	import EmailField from "$lib/components/single/global/EmailField.svelte";
	import FileField from "$lib/components/single/global/FileField.svelte";
	import NumberField from "$lib/components/single/global/NumberField.svelte";
	import PasswordField from "$lib/components/single/global/PasswordField.svelte";
	import TextField from "$lib/components/single/global/TextField.svelte";
	import { Briefcase, Check, ChevronLeft, ChevronRight, Plus, Trash, X } from "lucide-svelte";
	import { onMount } from "svelte";
	import { twMerge } from "tailwind-merge";

	let categ = $state(0);
	const maxCateg = 5;
	const categs = [
		"Personal Information",
		"Contact Information",
		"Educational Information",
		"Employment Information",
		"Account Information",
	];
	const scrollCategs = [0, 3];
	let alumni = $state({
		last_name: { value: "", error: "" },
		middle_name: { value: "", error: "" },
		first_name: { value: "", error: "" },
		name_extension: { value: "", error: "" },
		birth_date: { value: (new Date()).toISOString().split("T")[0], error: "" },
		birth_place: { value: "", error: "" },
		gender: { value: "Male", error: "" },
		civil_status: { value: "Single", error: "" },
		phone_number: { value: "", error: "" },
		address: { value: "", error: "" },
		socials: { value: [], error: "" },
		course_id: { value: 0, error: "" },
		student_number: { value: "", error: "" },
		graduation_year: { value: (new Date()).getFullYear(), error: "" },
		file_cv: { value: null, error: "" }, 
		employment_status: { value: "Employed", error: "" },
		occupations: { value: [], error: "" }, 
		file_profile_picture: { value: null, error: "" },
		email: { value: "", error: "" },
		password: { value: "", error: "" },
		confirm_password: { value: "", error: "" },
	});
	let courses = $state([]);
	let platforms = $state([]);
	let occu = $state({
		occupation: { value: "", error: "" },
		address: { value: "", error: "" },
		is_current: false,
	});
	let social = $state({
		platform: { value: "", error: "" },
		url: { value: "", error: "" },
	});

	let requiredTexts = [
		"last_name",
		"first_name",
		"email",
		"birth_date",
		"birth_place",
		"phone_number",
		"address",
		"password",
		"confirm_password",
	]
	let requiredFiles = [
		"file_cv",
		"file_profile_picture",
	];
	let requiredLists = [
		"occupations",
		"socials",
	];
	
	function validateTextRequires() {
		let noErrors = true;

		Object.entries(alumni).forEach(([key, value]) => {
			if (requiredTexts.includes(key)) {
				if (value.value.length === 0) {
					alumni[key].error = "Required";
					noErrors = false;
				}
			}
		});
	}

	function validateFileRequires() {
		let noErrors = true;
		
		Object.entries(alumni).forEach(([key, value]) => {
			if (requiredFiles.includes(key)) {
				if (!value.value) {
					alumni[key].error = "Required";
					noErrors = false;
				}
			}
		});

		return noErrors;
	}

	function validateListRequires() {
		let noErrors = true;
		
		Object.entries(alumni).forEach(([key, value]) => {
			if (requiredLists.includes(key)) {
				if (key === "occupations" && alumni.employment_status.value !== "Unemployed" && value.value.length === 0) {
					alumni.occupations.error = "Required if not unemployed";
					noErrors = false;
					return;
				}

				if (value.value.length === 0) {
					alumni[key].error = "Required";
					noErrors = false;
				}
			}
		});

		return noErrors;
	}

	function validateDateRelated() {
		const birthDate = new Date(alumni.birth_date.value);
		const minDate = new Date(new Date().getFullYear() - 21, new Date().getMonth(), new Date().getDate());
		let noErrors = true;

		if (birthDate > minDate) {
			alumni.birth_date.error = "Alumni must be at least 21 years old.";
			noErrors = false;
		}

		if (alumni.graduation_year.value > (new Date()).getFullYear()) {
			alumni.graduation_year.error = "Gradutaion year is in the future.";
			noErrors = false;
		}

		if (alumni.graduation_year.value < 2007) {
			alumni.graduation_year.error = "Graduation year must be 2007 or later.";
			noErrors = false;
		}

		return noErrors;
	}

	function toFormData() {
		const formData = new FormData();

		Object.entries(alumni).forEach(([key, value]) => {
			if (["password"].includes(key)) {
				// skips
			} else if (key === "confirm_password") {
				formData.append("password", value.value);
			} else if (key === "occupations") {
				const cleaned = value.value.map((o) => ({
					occupation: o.occupation.value,
					address: o.address.value,
					is_current: o.is_current
				}));

				formData.append("occupations", JSON.stringify(cleaned));
			} else if (key === "socials") {
				const cleaned = value.value.map((o) => ({
					platform: o.platform.value,
					url: o.url.value,
				}));

				formData.append("socials", JSON.stringify(cleaned));
			} else {
				formData.append(key, value.value);
			}
		});

		return formData;
	}
	
	async function onSubmit() {
		let hasErrors = false;

		hasErrors = !validateTextRequires();
		hasErrors = !validateFileRequires();
		hasErrors = !validateListRequires();
		hasErrors = !validateDateRelated();

		if (hasErrors) {
			await Toast.fire({
				title: "Please fill in all required fields before submitting.",
				icon: "error"
			});
			return;
		}

		const newAlumni = toFormData();

		await AlumniService.create(newAlumni,
			async (data, status) => {
				goto("/");
				await Toast.fire({
					title: data?.message ?? "You are now registered! Welcome to E-trace.",
					icon: "success"
				});
			},
			async (data, status) => {
				await Toast.fire({
					title: data?.message ?? "Failed to register, please double check your info.",
					icon: "error"
				});
			},
		);
	}

	onMount(async () => {
		await PlatformService.all(
			async (data, stat) => {
				platforms = data;
			},
			async (data, stat) => await Toast.fire({
				title: data?.message ?? "Unable to get platforms.",
				icon: "error"
			}),
		);
		await CourseService.allActive(
			async (data, stat) => {
				courses = data;

				if (stat === 200 && data.length > 0) {
					alumni.course_id.value = data[0].id;
				}
			},
			async (data, stat) => await Toast.fire({
				title: data?.message ?? "Unable to get schools.",
				icon: "error"
			}),
		);
	});
</script>

<div class={twMerge("w-screen h-screen bg-gray-100 text-gray-700 bg-white md:bg-gray-100 pt-6 overflow-x-hidden overflow-y-auto", !scrollCategs.includes(categ) && "flex items-center justify-center pt-0")}>
	<div class={twMerge("flex flex-col items-stretch max-w-4/5 md:w-2/5 md:gap-y-6 md:p-12 md:rounded-3xl md:shadow-lg md:bg-white w-full", scrollCategs.includes(categ) && "mx-auto mb-6")}>
		<div class="flex flex-col items-stretch gap-y-1 mb-6 md:mb-0">
			<div class="flex items-center justify-between">
				<h1 class="font-bold text-xl text-red-800">Alumni Registration</h1>
			</div>
			<div class="space-x-2 flex flex-col gap-x-2 items-stretch">
				<h2>{categs[categ]}</h2>
			</div>
		</div>
		<div class="flex flex-col items-stretch gap-y-2">
			{#if categ === 0}
				<div class="flex flex-col items-stretch">
					<span class="mb-2 text-sm">Last Name</span>
					<TextField
						onDebounce={(value) => alumni.last_name.error = value.trim().length === 0 ? "Last name is required" : ""}
						bind:value={alumni.last_name.value}
						placeholder="Last name"
					/>
					{#if alumni.last_name.error}
						<span class="text-red-500 text-sm">{alumni.last_name.error}</span>
					{/if}
				</div>
				<div class="flex grid grid-cols-5 gap-x-4">
					<div class="col-span-3 flex flex-col items-stretch">
						<span class="mb-2 text-sm">First Name</span>
						<TextField
							onDebounce={(value) => alumni.first_name.error = value.trim().length === 0 ? "First name is required" : ""}
							bind:value={alumni.first_name.value}
							placeholder="First name"
						/>
						{#if alumni.first_name.error}
							<span class="text-red-500 text-sm">{alumni.first_name.error}</span>
						{/if}
					</div>
					<div class="col-span-2 flex flex-col items-stretch">
						<span class="mb-2 text-sm">Name Extension (Optional)</span>
						<TextField
							onDebounce={(_) => {}}
							bind:value={alumni.name_extension.value}
							placeholder="Name extension"
						/>
						{#if alumni.name_extension.error}
							<span class="text-red-500 text-sm">{alumni.name_extension.error}</span>
						{/if}
					</div>
				</div>
				<div class="flex flex-col items-stretch">
					<span class="mb-2 text-sm">Middle Name (Optional)</span>
					<TextField
						onDebounce={(_) => {}}
						bind:value={alumni.middle_name.value}
						placeholder="Middle name"
					/>
					{#if alumni.middle_name.error}
						<span class="text-red-500 text-sm">{alumni.middle_name.error}</span>
					{/if}
				</div>
				<div class="flex flex-col items-stretch">
					<span class="mb-2 text-sm">Birth Date</span>
					<input
						type="date"
						bind:value={alumni.birth_date.value}
						max={new Date(new Date().getFullYear() - 21, new Date().getMonth(), new Date().getDate()).toISOString().split("T")[0]}
						onchange={e => {
							const birthDate = new Date(e.target.value);
							const minDate = new Date(new Date().getFullYear() - 21, new Date().getMonth(), new Date().getDate());

							if (birthDate > minDate) {
								alumni.birth_date.error = "Alumni must be at least 21 years old.";
							} else {
								alumni.birth_date.error = "";
							}
						}}
						class="px-6 py-4 rounded-lg border border-gray-300"
					>
					{#if alumni.birth_date.error}
						<span class="text-red-500 text-sm">{alumni.birth_date.error}</span>
					{/if}
				</div>
				<div class="flex flex-col items-stretch">
					<span class="mb-2 text-sm">Birth Place</span>
					<TextField
						onDebounce={(value) => alumni.birth_place.error = value.trim().length === 0 ? "Birth place is required" : ""}
						bind:value={alumni.birth_place.value}
						placeholder="Birth place"
					/>
					{#if alumni.birth_place.error}
						<span class="text-red-500 text-sm">{alumni.birth_place.error}</span>
					{/if}
				</div>
				<div class="flex grid grid-cols-2 gap-x-4">
					<div class="flex flex-col items-stretch">
						<span class="mb-2 text-sm">Gender</span>
						<select
							bind:value={alumni.gender.value}
							class="px-6 py-4 rounded-lg border border-gray-300"
						>
							<option value="Male">Male</option>
							<option value="Female">Female</option>
						</select>
						{#if alumni.gender.error}
							<span class="text-red-500 text-sm">{alumni.gender.error}</span>
						{/if}
					</div>
					<div class="flex flex-col items-stretch">
						<span class="mb-2 text-sm">Civil Status</span>
						<select
							bind:value={alumni.civil_status.value}
							class="px-6 py-4 rounded-lg border border-gray-300"
						>
							<option value="Single">Single</option>
							<option value="Married">Married</option>
							<option value="Widowed">Widowed</option>
							<option value="Separated">Separated</option>
						</select>
						{#if alumni.civil_status.error}
							<span class="text-red-500 text-sm">{alumni.civil_status.error}</span>
						{/if}
					</div>
				</div>
			{:else if categ == 1}
				<div class="flex flex-col items-stretch">
					<span class="mb-2 text-sm">Phone Number</span>
					<TextField
						onDebounce={(value) => alumni.phone_number.error = value.trim().length === 0 ? "Phone number is required" : ""}
						bind:value={alumni.phone_number.value}
						placeholder="Phone number"
					/>
					{#if alumni.phone_number.error}
						<span class="text-red-500 text-sm">{alumni.phone_number.error}</span>
					{/if}
				</div>
				<div class="flex flex-col items-stretch">
					<span class="mb-2 text-sm">Address</span>
					<TextField
						onDebounce={(value) => alumni.address.error = value.trim().length === 0 ? "Address is required" : ""}
						bind:value={alumni.address.value}
						placeholder="Address"
					/>
					{#if alumni.address.error}
						<span class="text-red-500 text-sm">{alumni.address.error}</span>
					{/if}
				</div>
				<div class="flex flex-col items-stretch">
					<span class="mb-2 text-sm">Social Media</span>

					{#if alumni.socials.error}
						<span class="text-red-500 text-sm">{alumni.socials.error}</span>
					{/if}

					{#if alumni.socials.value.length > 0}
						<ul class="list-inside space-y-2">
							{#each alumni.socials.value as social, index}
								<li class="flex items-center justify-between w-full">
									<div class="flex items-center gap-x-2 max-w-2/3">
										<Briefcase class="min-w-4 max-w-4"/>
										<span class="max-w-4/5 truncate">{social.platform.value} - {social.url.value}</span>
									</div>
									<Button
										Icon={Trash}
										size="s"
										onclick={() => alumni.socials.value = alumni.socials.value.filter((_, idx) => idx !== index)}
										class="bg-red-500"
									/>
								</li>
							{/each}
						</ul>
					{/if}
					<hr class="border-t border-gray-200 my-4">
					<h1 class="mb-4">Add Social Media</h1>
					<div class="flex flex-col items-stretch">
						<span class="mb-2 text-sm">Platform</span>
						<TextField
							list="platforms"
							onDebounce={(value) => social.platform.error = value.trim().length === 0 ? "Platform is required" : ""}
							bind:value={social.platform.value}
							placeholder="Facebook"
						/>
						<datalist id="platforms">
							{#each platforms as platform}
								<option value={platform.name}>{platform.name}</option>
							{/each}
						</datalist>
						{#if social.platform.error}
							<span class="text-red-500 text-sm">{social.platform.error}</span>
						{/if}
					</div>
					<div class="flex flex-col items-stretch mt-2">
						<span class="mb-2 text-sm">URL</span>
						<TextField
							onDebounce={(value) => social.url.error = value.trim().length === 0 ? "URL is required" : ""}
							bind:value={social.url.value}
							placeholder="www.facebook.com/your-username"
						/>
						{#if social.url.error}
							<span class="text-red-500 text-sm">{social.url.error}</span>
						{/if}
					</div>
					<Button
						Icon={Plus}
						label="Add"
						onclick={() => {
							if (
								social.platform.value.trim().length === 0 ||
								social.url.value.trim().length === 0
							) {
								return;
							}

							if (alumni.socials.value.includes(social)) {
								return;
							}

							alumni.socials.value.push(social);
							social = {
								platform: { value: "", error: "" },
								url: { value: "", error: "" },
							};
						}}
						class="bg-green-500 mt-4"
					/>
				</div>
			{:else if categ == 2}
				<div class="flex flex-col items-stretch">
					<span class="mb-2 text-sm">Course Taken</span>
					<select
						bind:value={alumni.course_id.value}
						class="px-6 py-4 rounded-lg border border-gray-300"
					>
						{#each courses as course}
							<option value={course.id}>{course.name}</option>
						{/each}
					</select>
					{#if alumni.course_id.error}
						<span class="text-red-500 text-sm">{alumni.course_id.error}</span>
					{/if}
				</div>
				<div class="flex flex-col items-stretch">
					<span class="mb-2 text-sm">Student Number (Optional)</span>
					<TextField
						onDebounce={(value) => alumni.student_number.error = value.trim().length === 0 ? "Student number is required" : ""}
						bind:value={alumni.student_number.value}
						placeholder="Student number"
					/>
					{#if alumni.student_number.error}
						<span class="text-red-500 text-sm">{alumni.student_number.error}</span>
					{/if}
				</div>
				<div class="flex flex-col items-stretch">
					<span class="mb-2 text-sm">Year Graduated</span>
					<NumberField
						onDebounce={(value) => {
							if (parseInt(value) > new Date().getFullYear()) {
								alumni.graduation_year.error = "Graduation year is in the future.";
							} else if (parseInt(value) < 2007) {
								alumni.graduation_year.error = "Graduation year must be 2007 or later.";
							} else {
								alumni.graduation_year.error = "";
							}
						}}
						bind:value={alumni.graduation_year.value}
						placeholder="Year graduated"
					/>
					{#if alumni.graduation_year.error}
						<span class="text-red-500 text-sm">{alumni.graduation_year.error}</span>
					{/if}
				</div>
			{:else if categ == 3}
				<div class="flex flex-col items-stretch">
					<span class="mb-2 text-sm">Curriculum Vitae</span>
					<FileField
						bind:value={alumni.file_cv.value}
						accept=".pdf"
						acceptMimes={["application/pdf"]}
						placeholder="pdf"
						onUpload={(file, mimes) => alumni.file_cv.error = !mimes.includes(file.type) ? "Unsupported file format." : ""}
					/>
					{#if alumni.file_cv.error}
						<span class="text-red-500 text-sm">{alumni.file_cv.error}</span>
					{/if}
				</div>
				<div class="flex flex-col items-stretch">
					<span class="mb-2 text-sm">Employment Status</span>
					<select
						bind:value={alumni.employment_status.value}
						class="px-6 py-4 rounded-lg border border-gray-300"
					>
						<option value="Unemployed">Unemployed</option>
						<option value="Employed">Employed</option>
						<option value="Self-employed">Self-employed</option>
					</select>
					{#if alumni.employment_status.error}
						<span class="text-red-500 text-sm">{alumni.employment_status.error}</span>
					{/if}
				</div>
				{#if alumni.employment_status.value !== "Unemployed"}
					<div class="flex flex-col items-stretch">
						<span class="mb-2 text-sm">Occupation/s</span>

						{#if alumni.occupations.error}
							<span class="text-red-500 text-sm">{alumni.occupations.error}</span>
						{/if}
						
						{#if alumni.occupations.value.length > 0}
							<ul class="list-inside space-y-2">
								{#each alumni.occupations.value as occ, index}
									<li class="flex items-center justify-between w-full">
										<div class="flex items-center gap-x-2 max-w-2/3">
											<Briefcase class="min-w-4 max-w-4"/>
											<span class="max-w-1/2 truncate">{occ.occupation.value}</span>
											<span class="min-w-1/3">{occ.is_current ? "(current)" : ""}</span>
										</div>
										<Button
											Icon={Trash}
											size="s"
											onclick={() => alumni.occupations.value = alumni.occupations.value.filter((_, idx) => idx !== index)}
											class="bg-red-500"
										/>
									</li>
								{/each}
							</ul>
						{/if}
						<hr class="border-t border-gray-200 my-4">
						<h1 class="mb-4">Add Occupation</h1>
						<div class="flex flex-col items-stretch">
							<span class="mb-2 text-sm">Occupation</span>
							<TextField
								onDebounce={(value) => occu.occupation.error = value.trim().length === 0 ? "Occupation is required" : ""}
								bind:value={occu.occupation.value}
								placeholder="Occupation"
							/>
							{#if occu.occupation.error}
								<span class="text-red-500 text-sm">{occu.occupation.error}</span>
							{/if}
						</div>
						<label
							for="is-current"
							class="flex item-center gap-x-2 mt-4"
						>
							<input
								type="checkbox"
								bind:checked={occu.is_current}
								class="rounded"
							>
							<span class="mb-2 text-sm">Is current</span>
						</label>
						<div class="flex flex-col items-stretch mt-2">
							<span class="mb-2 text-sm">Address</span>
							<TextField
								onDebounce={(value) => occu.address.error = value.trim().length === 0 ? "Address is required" : ""}
								bind:value={occu.address.value}
								placeholder="Address"
							/>
							{#if occu.address.error}
								<span class="text-red-500 text-sm">{occu.address.error}</span>
							{/if}
						</div>
						<Button
							Icon={Plus}
							label="Add"
							onclick={() => {
								if (
									occu.occupation.value.trim().length === 0 ||
									occu.address.value.trim().length === 0
								) {
									return;
								}

								if (alumni.occupations.value.includes(occu)) {
									return;
								}

								alumni.occupations.value.push(occu);
								occu = {
									occupation: { value: "", error: "" },
									address: { value: "", error: "" },
									is_current: false,
								};
							}}
							class="bg-green-500 mt-4"
						/>
					</div>
				{/if}
			{:else if categ == 4}
				<div class="flex flex-col items-stretch">
					<span class="mb-2 text-sm">Profile Picture</span>
					<FileField
						bind:value={alumni.file_profile_picture.value}
						accept=".png,.jpg,.jpeg"
						acceptMimes={["image/png", "image/jpg", "image/jpeg"]}
						placeholder="png / jpg / jpeg"
						onUpload={(file, mimes) => alumni.file_profile_picture.error = !mimes.includes(file.type) ? "Unsupported file format." : ""}
					/>
					{#if alumni.file_profile_picture.error}
						<span class="text-red-500 text-sm">{alumni.file_profile_picture.error}</span>
					{/if}
				</div>
				<div class="flex flex-col items-stretch">
					<span class="mb-2 text-sm">Email</span>
					<EmailField
						onDebounce={(value) => alumni.email.error = value.trim().length === 0 ? "Email is required" : ""}
						bind:value={alumni.email.value}
						placeholder="Email"
					/>
					{#if alumni.email.error}
						<span class="text-red-500 text-sm">{alumni.email.error}</span>
					{/if}
				</div>
				<div class="flex flex-col items-stretch">
					<span class="mb-2 text-sm">Password</span>
					<PasswordField
						onDebounce={(value) => {
							if (value.length === 0) {
								alumni.password.error = "Password is required.";
								return;
							} else {
								alumni.password.error = "";
							}
							if (value.length < 8) {
								alumni.password.error = "Password should have at least 8 characters.";
								return;
							} else {
								alumni.password.error = "";
							}
							if (value.length > 65) {
								alumni.password.error = "Password should not exceed 65 characters.";
								return;
							} else {
								alumni.password.error = "";
							}
						}}
						bind:value={alumni.password.value}
						placeholder="Enter password"
					/>
					{#if alumni.password.error}
						<span class="text-red-500 text-sm">{alumni.password.error}</span>
					{/if}
				</div>
				<div class="flex flex-col items-stretch">
					<span class="mb-2 text-sm">Confirm Password</span>
					<PasswordField
						onDebounce={(value) => {
							if (value.length === 0) {
								alumni.confirm_password.error = "Password is required.";
								return;
							} else {
								alumni.confirm_password.error = "";
							}
							if (value.length < 8) {
								alumni.confirm_password.error = "Password should have at least 8 characters.";
								return;
							} else {
								alumni.confirm_password.error = "";
							}
							if (value.length > 65) {
								alumni.confirm_password.error = "Password should not exceed 65 characters.";
								return;
							} else {
								alumni.confirm_password.error = "";
							}
							if (value !== alumni.password.value) {
								alumni.confirm_password.error = "Passwords do not match.";
								return;
							} else {
								alumni.confirm_password.error = "";
							}
						}}
						bind:value={alumni.confirm_password.value}
						placeholder="Enter password"
					/>
					{#if alumni.confirm_password.error}
						<span class="text-red-500 text-sm">{alumni.confirm_password.error}</span>
					{/if}
				</div>
			{/if}
		</div>
		<div class="grid grid-cols-2 gap-x-4 mt-2 mt-6 md:mt-0">
			{#if categ === 0}
				<Button
					onclick={() => goto("/registration")}
					Icon={X}
					label="Cancel"
					class="bg-transparent border border-gray-400 text-gray-700"
				/>
			{/if}
			{#if categ > 0}
				<Button
					onclick={() => categ--}
					Icon={ChevronLeft}
					label="Previous"
					class="bg-transparent border border-gray-400 text-gray-700"
				/>
			{/if}
			{#if categ < maxCateg - 1}
				<Button
					onclick={() => categ++}
					Icon={ChevronRight}
					iconPos="r"
					label="Next"
				/>
			{/if}
			{#if categ === maxCateg - 1}
				<Button
					onclick={onSubmit}
					Icon={Check}
					iconPos="r"
					label="Register"
				/>
			{/if}
		</div>
	</div>
</div>