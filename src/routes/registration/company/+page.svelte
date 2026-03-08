<script>
	import { goto } from "$app/navigation";
	import { CompanyService } from "$lib/app/services/users/company";
	import { Toast } from "$lib/app/utils/swal";
	import BaseContainer from "$lib/components/single/global/BaseContainer.svelte";
	import Button from "$lib/components/single/global/Button.svelte";
	import EmailField from "$lib/components/single/global/EmailField.svelte";
	import FileField from "$lib/components/single/global/FileField.svelte";
	import PasswordField from "$lib/components/single/global/PasswordField.svelte";
	import TextField from "$lib/components/single/global/TextField.svelte";
	import { Briefcase, Building2, Check, ChevronLeft, ChevronRight, Key, Pen, Plus, Trash2Icon, X } from "lucide-svelte";
	import { twMerge } from "tailwind-merge";

	let categ = $state(0);
	const maxCateg = 4;
	const categs = [
		"Company Information",
		"Required File/Documents",
		"List of Vacancies",
		"Account Information",
	];
	const scrollCategs = [1, 2];
	let company = $state({
		name: { value: "", errors: [] },
		address: { value: "", errors: [] },
		industry: { value: 'Technology / IT', errors: [] },
		logo: { value: null, errors: [] },
		profile: { value: null, errors: [] },
		permit: { value: null, errors: [] },
		sec: { value: null, errors: [] },
		dti_cda: { value: null, errors: [] },
		reg_of_est: { value: null, errors: [] },
		reg_philjobnet: { value: null, errors: [] },
		cert_from_dole: { value: null, errors: [] },
		cert_no_case: { value: null, errors: [] },
		vacancies: [],
		email: { value: "", errors: [] },
		password: { value: "", errors: [] },
		confirmPassword: { value: "", errors: [] },
	});
	let hasNoVacancies = $state(false);
	let vacEditIndex = $state(null);
	let vacancy = $state({
		job_title: { value: "", errors: [] },
		slots: { value: 1, errors: [] },
		qualifications: { value: [], errors: [] },
		edit_mode: false
	});
	let qualification = $state({
		value: "",
		errors: [],
		edit_mode: false
	})
	let industries = [
		'Technology / IT','Finance / Banking / Insurance','Healthcare / Pharmaceuticals',
		'Education / Research','Manufacturing / Industrial','Retail / E-commerce',
		'Food & Beverage / Hospitality','Transportation / Logistics','Energy / Utilities',
		'Media / Entertainment / Advertising','Government / Public Sector',
		'Real Estate / Construction','Consulting / Professional Services','Nonprofit / NGO',
		'Telecommunications'
	]

	let requiredTexts = [
		"name",
		"address",
		"email",
		"password",
		"confirmPassword",
	]
	let requiredFiles = [
		"logo",
		"profile",
		"permit",
		"sec",
		"dti_cda",
		"reg_of_est",
		"reg_philjobnet",
		"cert_from_dole",
		"cert_no_case",
	];

	function validateTextRequires() {
		let noErrors = true;

		Object.entries(company).forEach(([key, value]) => {
			if (requiredTexts.includes(key)) {
				if (value.value.length === 0 && !company[key].errors.includes("Required.")) {
					company[key].errors.push("Required.");
					noErrors = false;
				}
			}
		});

		return noErrors;
	}

	function validateFileRequires() {
		let noErrors = true;
		
		Object.entries(company).forEach(([key, value]) => {
			if (requiredFiles.includes(key)) {
				if (!value.value && !company[key].errors.includes("Required.")) {
					company[key].errors.push("Required.");
					noErrors = false;
				}
			}
		});

		return noErrors;
	}

	function toFormData() {
		const formData = new FormData();

		Object.entries(company).forEach(([key, value]) => {
			if (key === "password") {
				// nah
			} else if (key === "confirmPassword") {
				formData.append("password", value.value);
			} else if (key === "vacancies") {
				const cleaned = value.map((v) => ({
					job_title: v.job_title.value,
					slots: v.slots.value,
					qualifications: v.qualifications.value.map(q => q.value)
				}));
				
				formData.append(key, JSON.stringify(cleaned));
			} else {
				formData.append(key, value.value);
			}
		});

		return formData;
	}

	async function onSubmit() {
		let hasErrors = false;
		
		if (!validateTextRequires()) {
			hasErrors = true;
		}
		
		if (!validateFileRequires()) {
			hasErrors = true;
		}

		if (company.vacancies.length === 0) {
			hasNoVacancies = true;
			hasErrors = true;
		} else {
			hasNoVacancies = false;
		}

		if (hasErrors) {
			await Toast.fire({
				title: "Please fill in all required fields before submitting.",
				icon: "error"
			});
			return;
		}
		
		const newCompany = toFormData();

		await CompanyService.create(newCompany,
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
</script>

<div class={twMerge("w-screen h-screen bg-gray-100 text-gray-700 bg-white md:bg-gray-100 pt-6 overflow-x-hidden overflow-y-auto", !scrollCategs.includes(categ) && "flex items-center justify-center pt-0")}>
	<div class={twMerge("flex flex-col items-stretch max-w-4/5 md:w-2/5 md:gap-y-6 md:p-12 md:rounded-3xl md:shadow-lg md:bg-white w-full", scrollCategs.includes(categ) && "mx-auto mb-6")}>
		<div class="flex flex-col items-stretch gap-y-1 mb-6 md:mb-0">
			<div class="flex items-center justify-between">
				<h1 class="font-bold text-xl text-red-800">Company Registration</h1>
			</div>
			<div class="space-x-2 flex flex-col gap-x-2 items-stretch">
				<h2>{categs[categ]}</h2>
				{#if categ === 2 && hasNoVacancies}
					<span class="text-red-500 text-sm">Required.</span>
				{/if}
			</div>
		</div>
		<div class="flex flex-col items-stretch gap-y-2">
			{#if categ === 0}
				<div class="flex flex-col items-stretch">
					<span class="mb-2 text-sm">Name</span>
					<TextField
						onDebounce={(value) => {
							const errEmpty = "Name is required.";

							if (value.trim().length === 0) {
								if (!company.name.errors.includes(errEmpty)) {
									company.name.errors.push(errEmpty);
								}
							} else {
								company.name.errors = company.name.errors.filter((e) => e !== errEmpty && e !== "Required.");
							}
						}}
						bind:value={company.name.value}
						placeholder="Enter company name"
					/>
					{#if company.name.errors.length > 0}
						<ul class="list-inside space-y-1">
							{#each company.name.errors as e}
								<li class="text-red-500 text-sm">{e}</li>
							{/each}
						</ul>
					{/if}
				</div>
				<div class="flex flex-col items-stretch">
					<span class="mb-2 text-sm">Address</span>
					<TextField
						onDebounce={(value) => {
							const errEmpty = "Address is required.";

							if (value.trim().length === 0) {
								if (!company.address.errors.includes(errEmpty)) {
									company.address.errors.push(errEmpty);
								}
							} else {
								company.address.errors = company.address.errors.filter((e) => e !== errEmpty && e !== "Required.");
							}
						}}
						bind:value={company.address.value}
						placeholder="Enter address"
					/>
					{#if company.address.errors.length > 0}
						<ul class="list-inside space-y-1">
							{#each company.address.errors as e}
								<li class="text-red-500 text-sm">{e}</li>
							{/each}
						</ul>
					{/if}
				</div>
				<div class="flex flex-col items-stretch">
					<span class="mb-2 text-sm">Industry Type</span>
					<select
						bind:value={company.industry.value}
						class="border border-gray-300 rounded-lg px-6 py-3"
					>
						{#each industries as industry}
							<option value={industry}>{industry}</option>
						{/each}
					</select>
				</div>
			{:else if categ === 1}
				<div class="flex flex-col items-stretch">
					<span class="mb-2 text-sm">Company Logo</span>
					<FileField
						bind:value={company.logo.value}
						accept=".png,.jpg,.jpeg"
						acceptMimes={["image/png", "image/jpg", "image/jpeg"]}
						placeholder="png / jpg / jpeg"
						onUpload={(file, mimes) => {
							const errUnsupported = "Unsupported file format.";
							
							if (!mimes.includes(file.type)) {
								if (!company.logo.errors.includes(errUnsupported)) {
									company.logo.errors.push(errUnsupported);
								}
							} else {
								company.logo.errors = company.logo.errors.filter((e) => e !== errUnsupported && e !== "Required.");
							}
						}}
					/>
					{#if company.logo.errors.length > 0}
						<ul class="list-inside space-y-1">
							{#each company.logo.errors as e}
								<li class="text-red-500 text-sm">{e}</li>
							{/each}
						</ul>
					{/if}
				</div>
				<div class="flex flex-col items-stretch">
					<span class="mb-2 text-sm">Company Profile</span>
					<FileField
						bind:value={company.profile.value}
						accept=".pdf"
						acceptMimes={["application/pdf"]}
						placeholder="pdf"
						onUpload={(file, mimes) => {
							const errUnsupported = "Unsupported file format.";
							
							if (!mimes.includes(file.type)) {
								if (!company.profile.errors.includes(errUnsupported)) {
									company.profile.errors.push(errUnsupported);
								}
							} else {
								company.profile.errors = company.profile.errors.filter((e) => e !== errUnsupported && e !== "Required.");
							}
						}}
					/>
					{#if company.profile.errors.length > 0}
						<ul class="list-inside space-y-1">
							{#each company.profile.errors as e}
								<li class="text-red-500 text-sm">{e}</li>
							{/each}
						</ul>
					{/if}
				</div>
				<div class="flex flex-col items-stretch">
					<span class="mb-2 text-sm">Business Permit</span>
					<FileField
						bind:value={company.permit.value}
						accept=".pdf"
						acceptMimes={["application/pdf"]}
						placeholder="pdf"
						onUpload={(file, mimes) => {
							const errUnsupported = "Unsupported file format.";
							
							if (!mimes.includes(file.type)) {
								if (!company.permit.errors.includes(errUnsupported)) {
									company.permit.errors.push(errUnsupported);
								}
							} else {
								company.permit.errors = company.permit.errors.filter((e) => e !== errUnsupported && e !== "Required.");
							}
						}}
					/>
					{#if company.permit.errors.length > 0}
						<ul class="list-inside space-y-1">
							{#each company.permit.errors as e}
								<li class="text-red-500 text-sm">{e}</li>
							{/each}
						</ul>
					{/if}
				</div>
				<div class="flex flex-col items-stretch">
					<span class="mb-2 text-sm">SEC</span>
					<FileField
						bind:value={company.sec.value}
						accept=".pdf"
						acceptMimes={["application/pdf"]}
						placeholder="pdf"
						onUpload={(file, mimes) => {
							const errUnsupported = "Unsupported file format.";
							
							if (!mimes.includes(file.type)) {
								if (!company.sec.errors.includes(errUnsupported)) {
									company.sec.errors.push(errUnsupported);
								}
							} else {
								company.sec.errors = company.sec.errors.filter((e) => e !== errUnsupported && e !== "Required.");
							}
						}}
					/>
					{#if company.sec.errors.length > 0}
						<ul class="list-inside space-y-1">
							{#each company.sec.errors as e}
								<li class="text-red-500 text-sm">{e}</li>
							{/each}
						</ul>
					{/if}
				</div>
				<div class="flex flex-col items-stretch">
					<span class="mb-2 text-sm">DTI / CDA Reg.</span>
					<FileField
						bind:value={company.dti_cda.value}
						accept=".pdf"
						acceptMimes={["application/pdf"]}
						placeholder="pdf"
						onUpload={(file, mimes) => {
							const errUnsupported = "Unsupported file format.";
							
							if (!mimes.includes(file.type)) {
								if (!company.dti_cda.errors.includes(errUnsupported)) {
									company.dti_cda.errors.push(errUnsupported);
								}
							} else {
								company.dti_cda.errors = company.dti_cda.errors.filter((e) => e !== errUnsupported && e !== "Required.");
							}
						}}
					/>
					{#if company.dti_cda.errors.length > 0}
						<ul class="list-inside space-y-1">
							{#each company.dti_cda.errors as e}
								<li class="text-red-500 text-sm">{e}</li>
							{/each}
						</ul>
					{/if}
				</div>
				<div class="flex flex-col items-stretch">
					<span class="mb-2 text-sm">Registry of Establishment fr. DOLE</span>
					<FileField
						bind:value={company.reg_of_est.value}
						accept=".pdf"
						acceptMimes={["application/pdf"]}
						placeholder="pdf"
						onUpload={(file, mimes) => {
							const errUnsupported = "Unsupported file format.";
							
							if (!mimes.includes(file.type)) {
								if (!company.reg_of_est.errors.includes(errUnsupported)) {
									company.reg_of_est.errors.push(errUnsupported);
								}
							} else {
								company.reg_of_est.errors = company.reg_of_est.errors.filter((e) => e !== errUnsupported && e !== "Required.");
							}
						}}
					/>
					{#if company.reg_of_est.errors.length > 0}
						<ul class="list-inside space-y-1">
							{#each company.reg_of_est.errors as e}
								<li class="text-red-500 text-sm">{e}</li>
							{/each}
						</ul>
					{/if}
				</div>
				<div class="flex flex-col items-stretch">
					<span class="mb-2 text-sm">Phil-JobNet Reg.</span>
					<FileField
						bind:value={company.reg_philjobnet.value}
						accept=".pdf"
						acceptMimes={["application/pdf"]}
						placeholder="pdf"
						onUpload={(file, mimes) => {
							const errUnsupported = "Unsupported file format.";
							
							if (!mimes.includes(file.type)) {
								if (!company.reg_philjobnet.errors.includes(errUnsupported)) {
									company.reg_philjobnet.errors.push(errUnsupported);
								}
							} else {
								company.reg_philjobnet.errors = company.reg_philjobnet.errors.filter((e) => e !== errUnsupported && e !== "Required.");
							}
						}}
					/>
					{#if company.reg_philjobnet.errors.length > 0}
						<ul class="list-inside space-y-1">
							{#each company.reg_philjobnet.errors as e}
								<li class="text-red-500 text-sm">{e}</li>
							{/each}
						</ul>
					{/if}
				</div>
				<div class="flex flex-col items-stretch">
					<span class="mb-2 text-sm">Certification from DOLE Provincial Office</span>
					<FileField
						bind:value={company.cert_from_dole.value}
						accept=".pdf"
						acceptMimes={["application/pdf"]}
						placeholder="pdf"
						onUpload={(file, mimes) => {
							const errUnsupported = "Unsupported file format.";
							
							if (!mimes.includes(file.type)) {
								if (!company.cert_from_dole.errors.includes(errUnsupported)) {
									company.cert_from_dole.errors.push(errUnsupported);
								}
							} else {
								company.cert_from_dole.errors = company.cert_from_dole.errors.filter((e) => e !== errUnsupported && e !== "Required.");
							}
						}}
					/>
					{#if company.cert_from_dole.errors.length > 0}
						<ul class="list-inside space-y-1">
							{#each company.cert_from_dole.errors as e}
								<li class="text-red-500 text-sm">{e}</li>
							{/each}
						</ul>
					{/if}
				</div>
				<div class="flex flex-col items-stretch">
					<span class="mb-2 text-sm">Certification of no Pending Case</span>
					<FileField
						bind:value={company.cert_no_case.value}
						accept=".pdf"
						acceptMimes={["application/pdf"]}
						placeholder="pdf"
						onUpload={(file, mimes) => {
							const errUnsupported = "Unsupported file format.";
							
							if (!mimes.includes(file.type)) {
								if (!company.cert_no_case.errors.includes(errUnsupported)) {
									company.cert_no_case.errors.push(errUnsupported);
								}
							} else {
								company.cert_no_case.errors = company.cert_no_case.errors.filter((e) => e !== errUnsupported && e !== "Required.");
							}
						}}
					/>
					{#if company.cert_no_case.errors.length > 0}
						<ul class="list-inside space-y-1">
							{#each company.cert_no_case.errors as e}
								<li class="text-red-500 text-sm">{e}</li>
							{/each}
						</ul>
					{/if}
				</div>
			{:else if categ === 2}
				{#if company.vacancies.length > 0 && vacEditIndex === null}
					<ul class="list-inside mb-4 space-y-2">
						{#each company.vacancies as vac, index}
							<div class="w-full flex items-center justify-between">
								<div class="w-3/5 flex items-center gap-x-4">
									<Briefcase class="min-w-4"/>
									<span class="max-w-4/5 truncate">{vac.job_title.value}</span>
								</div>
								<div class="flex items-center gap-x-2">
									<button
										onclick={() => {
											let copy = vac;
											copy.edit_mode = true;
											vacancy = copy;
											vacEditIndex = index;
										}}
										class="w-7 h-7 bg-blue-500 rounded flex items-center justify-center text-white cursor-pointer"
									>
										<Pen class="w-4"/>
									</button>
									<button
										onclick={() => company.vacancies = company.vacancies.filter((v, vindex) => vindex !== index)}
										class="min-w-7 min-h-7 bg-red-500 rounded flex items-center justify-center text-white cursor-pointer"
									>
										<Trash2Icon class="w-4"/>
									</button>
								</div>
							</div>
						{/each}
					</ul>
				{/if}
				<h1 class="text-lg font-bold">{vacEditIndex === null ? "Add Vacancy" : "Edit Vacancy"}</h1>
				<div class="grid grid-cols-7 gap-x-4">
					<div class="flex flex-col items-stretch col-span-5">
						<span class="mb-2 text-sm">Job Title</span>
						<TextField
							bind:value={vacancy.job_title.value}
							placeholder="Enter job title"
						/>
						{#if vacancy.job_title.errors.length > 0}
							<ul class="list-inside space-y-1">
								{#each vacancy.job_title.errors as e}
									<li class="text-red-500 text-sm">{e}</li>
								{/each}
							</ul>
						{/if}
					</div>
					<div class="flex flex-col items-stretch col-span-2">
						<span class="mb-2 text-sm">Slots</span>
						<input
							type="number"
							bind:value={vacancy.slots.value}
							min="1"
							class="border border-gray-300 rounded-lg px-6 py-3"
						>
					</div>
				</div>
				<div class="flex flex-col items-stretch">
					<span class="mb-2 text-sm">Qualifications</span>
					{#if vacancy.qualifications.value.length}
						<ul class="list-inside mb-2 space-y-2">
							{#each vacancy.qualifications.value as qual, index}
								<li class="flex items-center w-full justify-between">
									{#if vacancy.qualifications.value[index].edit_mode}
										<TextField
											bind:value={vacancy.qualifications.value[index].value}
											placeholder="Enter qualification"
											BtnIcon={Check}
											btnOnclick={() => vacancy.qualifications.value[index].edit_mode = false}
											class="w-full"
										/>
									{:else}
										<div class="grow flex items-center gap-x-2 max-w-3/5">
											<Check class="w-4"/>
											<span class="max-w-1/2 overflow-hidden truncate">
												{vacancy.qualifications.value[index].value}
											</span>
										</div>
										<div class="flex items-center gap-x-2">
											<button
												onclick={() => vacancy.qualifications.value[index].edit_mode = true}
												class="w-7 h-7 bg-blue-500 rounded flex items-center justify-center text-white cursor-pointer"
											>
												<Pen class="w-4"/>
											</button>
											<button
												onclick={() => vacancy.qualifications.value = vacancy.qualifications.value.filter((v, vindex) => vindex !== index)}
												class="min-w-7 min-h-7 bg-red-500 rounded flex items-center justify-center text-white cursor-pointer"
											>
												<Trash2Icon class="w-4"/>
											</button>
										</div>
									{/if}
								</li>
							{/each}
						</ul>
					{/if}
					<TextField
						bind:value={qualification.value}
						placeholder="Qualification",
						BtnIcon={Plus}
						btnLabel="Add"
						btnOnclick={() => {
							const errEmpty = "Qualification is required.";
							
							if (qualification.value.trim().length === 0) {
								if (!qualification.errors.includes(errEmpty)) {
									qualification.errors.push(errEmpty);
								}

								return;
							} else {
								qualification.errors = qualification.errors.filter((e) => e !== errEmpty);
							}
							
							vacancy.qualifications.value.push({
								value: qualification.value,
								errors: [],
								edit_mode: false
							});
							qualification.value = "";
						}}
					/>
					{#if qualification.errors.length > 0}
						<ul class="list-inside space-y-1">
							{#each qualification.errors as e}
								<li class="text-red-500 text-sm">{e}</li>
							{/each}
						</ul>
					{/if}
					{#if vacancy.qualifications.errors.length > 0}
						<ul class="list-inside space-y-1">
							{#each vacancy.qualifications.errors as e}
								<li class="text-red-500 text-sm">{e}</li>
							{/each}
						</ul>
					{/if}
				</div>
				<Button
					Icon={vacancy.edit_mode ? Check : Plus}
					label={vacancy.edit_mode ? "Save Changes" : "Add"}
					onclick={() => {
						const errEmptyJobTitle = "Job title is required.";
						const errEmptyQualifications = "Qualifications are required.";
						let hasError = false;
						
						if (vacancy.edit_mode) {
							let copy = vacancy;
							copy.edit_mode = false;

							if (copy.job_title.value.trim().length === 0) {
								if (!vacancy.job_title.errors.includes(errEmptyJobTitle)) {
									vacancy.job_title.errors.push(errEmptyJobTitle);
								}

								hasError = true;
							} else {
								vacancy.job_title.errors = vacancy.job_title.errors.filter((e) => e !== errEmptyJobTitle);
							}

							if (copy.qualifications.value.length === 0) {
								if (!vacancy.qualifications.errors.includes(errEmptyQualifications)) {
									vacancy.qualifications.errors.push(errEmptyQualifications);
								}

								hasError = true;
							} else {
								vacancy.qualifications.errors = vacancy.qualifications.errors.filter((e) => e !== errEmptyQualifications);
							}
							
							if (hasError) {
								return;
							}

							company.vacancies[vacEditIndex] = copy;
							vacEditIndex = null;
							vacancy = {
								job_title: { value: "", errors: [] },
								slots: { value: 1, errors: [] },
								qualifications: { value: [], errors: [] },
								edit_mode: false
							};
						} else {
							if (vacancy.job_title.value.trim().length === 0) {
								if (!vacancy.job_title.errors.includes(errEmptyJobTitle)) {
									vacancy.job_title.errors.push(errEmptyJobTitle);
								}

								hasError = true;
							} else {
								vacancy.job_title.errors = vacancy.job_title.errors.filter((e) => e !== errEmptyJobTitle);
							}

							if (vacancy.qualifications.value.length === 0) {
								if (!vacancy.qualifications.errors.includes(errEmptyQualifications)) {
									vacancy.qualifications.errors.push(errEmptyQualifications);
								}

								hasError = true;
							} else {
								vacancy.qualifications.errors = vacancy.qualifications.errors.filter((e) => e !== errEmptyQualifications);
							}
							
							if (hasError) {
								return;
							}

							company.vacancies.push(vacancy);
							vacancy = {
								job_title: { value: "", errors: [] },
								slots: { value: 1, errors: [] },
								qualifications: { value: [], errors: [] },
								edit_mode: false
							};
						}
					}}
					class="mt-4 bg-green-500"
				/>
			{:else}
				<div class="flex flex-col items-stretch">
					<span class="mb-2 text-sm">Email</span>
					<EmailField
						onDebounce={(value) => {
							const errEmpty = "Email is required.";
							const errInvalid = "Invalid email address.";

							if (value.trim().length === 0) {
								if (!company.email.errors.includes(errEmpty)) {
									company.email.errors.push(errEmpty);
								}
							} else {
								company.email.errors = company.email.errors.filter((e) => e !== errEmpty && e !== "Required.");
							}
							if (!value.includes("@")) {
								if (!company.email.errors.includes(errInvalid)) {
									company.email.errors.push(errInvalid);
								}
							} else {
								company.email.errors = company.email.errors.filter((e) => e !== errInvalid && e !== "Required.");
							}
						}}
						bind:value={company.email.value}
						placeholder="Enter email address"
					/>
					{#if company.email.errors.length > 0}
						<ul class="list-inside space-y-1">
							{#each company.email.errors as e}
								<li class="text-red-500 text-sm">{e}</li>
							{/each}
						</ul>
					{/if}
				</div>
				<div class="flex flex-col items-stretch">
					<span class="mb-2 text-sm">Password</span>
					<PasswordField
						onDebounce={(value) => {
							const errEmpty = "Password is required.";
							const errTooShort = "Password should have at least 8 characters.";
							const errTooLong = "Password should not exceed 65 characters.";

							if (value.length === 0) {
								if (!company.password.errors.includes(errEmpty)) {
									company.password.errors.push(errEmpty);
								}

								company.password.errors = company.password.errors.filter((e) => e === errEmpty && e !== "Required.");
								return;
							} else {
								company.password.errors = company.password.errors.filter((e) => e !== errEmpty && e !== "Required.");
							}
							if (value.length < 8) {
								if (!company.password.errors.includes(errTooShort)) {
									company.password.errors.push(errTooShort);
								}
							} else {
								company.password.errors = company.password.errors.filter((e) => e !== errTooShort && e !== "Required.");
							}
							if (value.length > 65) {
								if (!company.password.errors.includes(errTooLong)) {
									company.password.errors.push(errTooLong);
								}
							} else {
								company.password.errors = company.password.errors.filter((e) => e !== errTooLong && e !== "Required.");
							}
						}}
						bind:value={company.password.value}
						placeholder="Enter password"
					/>
					{#if company.password.errors.length > 0}
						<ul class="list-inside space-y-1">
							{#each company.password.errors as e}
								<li class="text-red-500 text-sm">{e}</li>
							{/each}
						</ul>
					{/if}
				</div>
				<div class="flex flex-col items-stretch">
					<span class="mb-2 text-sm">Confirm Password</span>
					<PasswordField
						onDebounce={(value) => {
							const errEmpty = "Password is required.";
							const errTooShort = "Password should have at least 8 characters.";
							const errTooLong = "Password should not exceed 65 characters.";
							const errDontMatch = "Passwords do not match.";

							if (value.length === 0) {
								if (!company.confirmPassword.errors.includes(errEmpty)) {
									company.confirmPassword.errors.push(errEmpty);
								}

								company.confirmPassword.errors = company.confirmPassword.errors.filter((e) => e === errEmpty && e !== "Required.");
								return;
							} else {
								company.confirmPassword.errors = company.confirmPassword.errors.filter((e) => e !== errEmpty && e !== "Required.");
							}
							if (value.length < 8) {
								if (!company.confirmPassword.errors.includes(errTooShort)) {
									company.confirmPassword.errors.push(errTooShort);
								}
							} else {
								company.confirmPassword.errors = company.confirmPassword.errors.filter((e) => e !== errTooShort && e !== "Required.");
							}
							if (value.length > 65) {
								if (!company.confirmPassword.errors.includes(errTooLong)) {
									company.confirmPassword.errors.push(errTooLong);
								}
							} else {
								company.confirmPassword.errors = company.confirmPassword.errors.filter((e) => e !== errTooLong && e !== "Required.");
							}
							if (value !== company.password.value) {
								if (!company.confirmPassword.errors.includes(errDontMatch)) {
									company.confirmPassword.errors.push(errDontMatch);
								}
							} else {
								company.confirmPassword.errors = company.confirmPassword.errors.filter((e) => e !== errDontMatch && e !== "Required.");
							}
						}}
						bind:value={company.confirmPassword.value}
						placeholder="Re-enter password"
					/>
					{#if company.confirmPassword.errors.length > 0}
						<ul class="list-inside space-y-1">
							{#each company.confirmPassword.errors as e}
								<li class="text-red-500 text-sm">{e}</li>
							{/each}
						</ul>
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