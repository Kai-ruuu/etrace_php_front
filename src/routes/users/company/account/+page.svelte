<script>
	import { Check, Eye, Info, NotebookPen, Pen, Save, Upload, X } from "lucide-svelte";
	import { API_BASE_URL, ROLE } from "$lib/app/core/constants";
	import { user } from "$lib/app/stores/user";
	import { getDisplayRole } from "$lib/app/utils/user";
	import HeadBar from "$lib/components/grouped/users/admins/HeadBar.svelte";
	import Button from "$lib/components/single/global/Button.svelte";
	import TextField from "$lib/components/single/global/TextField.svelte";
	import PasswordField from "$lib/components/single/global/PasswordField.svelte";
	import { Toast } from "$lib/app/utils/swal";
	import { AuthService } from "$lib/app/services/auth";
	import { UserService } from "$lib/app/services/users/user";
	import { PstaffService } from "$lib/app/services/users/pstaff";
	import VerificationStatusTextSimple from "$lib/components/single/users/company/VerificationStatusTextSimple.svelte";
	import ReuploadButton from "$lib/components/grouped/users/company/ReuploadButton.svelte";
	import PreviewModal from "$lib/components/single/users/company/PreviewModal.svelte";
	import PstaffNotesViewModal from "$lib/components/grouped/users/company/PstaffNotesViewModal.svelte";
	import VacanciesModal from "$lib/components/single/users/company/VacanciesModal.svelte";
	import FileField from "$lib/components/single/global/FileField.svelte";
	import { CompanyService } from "$lib/app/services/users/company";

	let updateOn = $state(false);
	let profile = $state({
		name: "",
		initials: "",
		logo: ""
	});
	let requirements = $state([]);
	let udpateInfo = $state({
		address: { value: "", error: "" },
		logo: { value: null, errors: [] },
		profile: { value: null, errors: [] },
		permit: { value: null, errors: [] },
		sec: { value: null, errors: [] },
		dti_cda: { value: null, errors: [] },
		reg_of_est: { value: null, errors: [] },
		reg_philjobnet: { value: null, errors: [] },
		cert_from_dole: { value: null, errors: [] },
		cert_no_case: { value: null, errors: [] },
	});
	let previewOpen = $state(false);
	let previewFile = $state(null);
	let previewFileSource = $state("");
	let previewDisplay = $state("");

	let reviseRequestsOpen = $state(false);
	let reviseRequestsModalDetails = $state(null);

	let vacViewOpen = $state(false);

	let updatePasswordOn = $state(false);
	let password = $state({
		oldPass: "",
		newPass: "",
		confirmedNewPass: "",
	});

	let updateInfo = $state({
		logo: { value: null, error: "" },
		address: { value: "", error: "" }
	});
	
	async function onChangePassword() {
		// add client-side validation
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
					updateOn = false;
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

	async function onOpenReviseRequests(companyId, display, attrName) {
        reviseRequestsModalDetails = { companyId, display, attr_name: attrName };
        reviseRequestsOpen = true;
    }

    async function onExitReviseRequests() {
        reviseRequestsModalDetails = null;
        reviseRequestsOpen = false;
    }

	async function onProfileUpdate() {
		let formData = new FormData();

		formData.append("logo", updateInfo.logo.value);
		formData.append("address", updateInfo.address.value);
		
		await CompanyService.updateProfile(
			$user.id,
			formData,
			async (d, s) => await UserService.me(
				async (data, status) => {
					updateInfo.logo.value = null;
					
					const input = document.getElementById("logo");

					if (input) {
						input.value = "";
					}
					
					user.set(data);
					await Toast.fire({
						title: d?.message ?? "Changes saved.",
						icon: "success"
					});
				},
				async (data, status) => {
					await Toast.fire({
						title: data?.message ?? "Unable get profile information.",
						icon: "error"
					});
				}
			),
			async (data, status) => {
				await Toast.fire({
					title: data?.message ?? "Unable save changes.",
					icon: "error"
				});
			}
		);
	}

	$effect(() => {
		if ($user) {
			updateInfo.address.value = $user.profile.address;
			profile.name = $user.profile.name;
			profile.logo = $user.profile.req_logo;
			profile.initials = profile.name.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase();

			requirements = [
				{
					display: "Company Profile",                          
					status: $user.profile.stat_req_company_profile,
					file: $user.profile.req_company_profile,
					source: "profile",
					pureName: "req_company_profile"
				},
				{
					display: "Business Permit",                          
					status: $user.profile.stat_req_business_permit,
					file: $user.profile.req_business_permit,
					source: "permit",
					pureName: "req_business_permit"
				},
				{
					display: "SEC",                                      
					status: $user.profile.stat_req_sec,
					file: $user.profile.req_sec,
					source: "sec",
					pureName: "req_sec"
				},
				{
					display: "DTI / CDA Reg.",                           
					status: $user.profile.stat_req_dti_cda,
					file: $user.profile.req_dti_cda,
					source: "dti_cda",
					pureName: "req_dti_cda"
				},
				{
					display: "Registry of Establishment fr. DOLE",       
					status: $user.profile.stat_req_reg_of_est,
					file: $user.profile.req_reg_of_est,
					source: "reg_of_est",
					pureName: "req_reg_of_est"
				},
				{
					display: "Phil-JobNet Reg.",                         
					status: $user.profile.stat_req_philjobnet_reg,
					file: $user.profile.req_philjobnet_reg,
					source: "reg_philjobnet",
					pureName: "req_philjobnet_reg"
				},
				{
					display: "Certification from DOLE Provincial Office",
					status: $user.profile.stat_req_cert_from_dole,
					file: $user.profile.req_cert_from_dole,
					source: "cert_from_dole",
					pureName: "req_cert_from_dole"
				},
				{
					display: "Certification of No Pending Case",         
					status: $user.profile.stat_req_cert_no_case,
					file: $user.profile.req_cert_no_case,
					source: "cert_no_case",
					pureName: "req_cert_no_case"
				},
			];
		}
	})
</script>

{#if $user}
	<div class="flex flex-col items-stretch overflow-hidden h-full">
		<HeadBar title="My Account"/>
		<div class="max-h-[calc(100%-64px)] px-6 overflow-auto">
			<div class="border border-gray-200 rounded-lg bg-white overflow-clip my-6">
				{#if updateOn}
					<div class="w-full p-6">
						<div class="flex items-center justify-between">
							<p class="text-xl">Edit Profile</p>
							<Button
								Icon={X}
								label="Exit"
								size="s"
								class="bg-red-500"
								onclick={() => updateOn = false}
							/>
						</div>
						<hr class="border-t border-gray-200 my-4">

						<div class="mb-4 w-full">
							<p class="text-sm text-gray-500 mb-2">Logo</p>
							<div class="flex items-center justify-between">
								<div class="flex items-center gap-x-2">
									<div
										style="background-image: url({API_BASE_URL + `/uploads/company/logo/${profile.logo}`})"
										class="min-w-10 min-h-10 w-fit rounded-full bg-gray-200 bg-cover bg-center bg-no-repeat border border-gray-300"
									></div>
									{#if !updateInfo.logo.value}
										<p>{$user.profile.req_logo}</p>
									{:else}
										<p>{updateInfo.logo.value.name}</p>
									{/if}
								</div>
								<label
									for="logo"
									class="bg-blue-500 px-3 py-1 text-white text-sm rounded-lg cursor-pointer flex items-center justify-center"
								>
									<Upload class="min-w-4 max-w-4"/>
									<span class="ml-2">Replace</span>
									<input
										type="file"
										accept=".png,.jpg,.jpeg"
										id="logo"
										onchange={(e) => {
											let value = e.target.files?.[0] ?? null;
											
											const errUnsupported = "Unsupported file format.";
											const acceptedMimes = ["image/png", "image/jpg", "image/jpeg"];
            
											if (!acceptedMimes.includes(value.type)) {
												updateInfo.logo.error = errUnsupported;
												e.target.value = "";
												return;
											} else {
												updateInfo.logo.error = "";
											}

											updateInfo.logo.value = value;
										}}
										class="hidden"
									>
								</label>
							</div>
						</div>

						<div class="w-full">
							<p class="text-sm text-gray-500 mb-2">Address</p>
							<div>
								<TextField
									onDebounce={(value) => updateInfo.address.error = value.trim().length === 0 ? "Address is required" : ""}
									bind:value={updateInfo.address.value}
									placeholder="Enter company address"
									class="grow"
								/>
								{#if updateInfo.address.error}
									<span class="text-red-500 text-sm">{updateInfo.address.error}</span>
								{/if}
							</div>
						</div>

						<div class="w-full flex justify-end mt-4">
							<Button
								Icon={Check}
								label="Save Changes"
								size="s"
								class="bg-green-500"
								onclick={onProfileUpdate}
							/>
						</div>

						<hr class="border-t border-gray-200 my-4">
						
						<p class="pb-2 text-lg text-gray-500">Requirements</p>
						<p class="text-sm text-amber-500 border border-amber-200 rounded-md px-4 py-2 mb-4">
							<span class="flex items-center gap-x-2 mb-2">
								<Info class="min-w-4 max-w-4"/>
								<span>Note</span>
							</span>
							<span>Updating any of the following requirements will place your account <strong>under review</strong> and temporarily suspend your ability to post job vacancies until re-verified by a PESO staff. Your List of Vacancies can be updated freely without affecting your verification status.</span>
						</p>
						<div class="w-full space-y-4 pr-2">
							{#each requirements as req}
								<div class="w-full">
									<div class="w-full grid grid-cols-15 gap-x-3">
										<VerificationStatusTextSimple
											status={req.status}
											class="col-span-2"
										/>
										<h1 class="col-span-11">{req.display}</h1>
										<div class="flex items-center gap-x-2">
											<Button
												title="View PESO Staf's revision requests"
												Icon={NotebookPen}
												size="s"
												onclick={() => onOpenReviseRequests($user.profile.id, req.display, req.pureName)}
												class="bg-blue-500"
											/>
											<Button
												title="View Requirement"
												Icon={Eye}
												size="s"
												onclick={() => {
													previewOpen = true;
													previewFile = req.file;
													previewFileSource = req.source;
													previewDisplay = req.display;
												}}
												class="bg-blue-500"
											/>
											{#if req.status !== "Pending"}
												<ReuploadButton
													key={req.pureName}
													display={req.display}
													source={req.source}
												/>
											{/if}
										</div>
									</div>
								</div>
							{/each}
							<div class="w-full">
								<div class="w-full grid grid-cols-15 gap-x-3">
									<VerificationStatusTextSimple
										status={$user.profile.stat_req_list_of_vacancies}
										class="col-span-2"
									/>
									<h1 class="col-span-11">List of Vacancies</h1>
									<div class="flex items-center gap-x-2">
										<Button
											title="View PESO Staf's revision requests"
											Icon={NotebookPen}
											size="s"
											onclick={() => onOpenReviseRequests($user.profile.id, "List of Vacancies", "req_list_of_vacancies")}
											class="bg-blue-500"
										/>
										<Button
											title="Update"
											Icon={Pen}
											size="s"
											onclick={() => vacViewOpen = true}
											class="bg-blue-500"
										/>
									</div>
								</div>
							</div>
						</div>
					</div>
				{:else}
					<div class="flex flex-col items-stretch justify-between">
						<div class="flex items-center gap-x-6 p-6 pb-0">
							<div class="flex flex-col w-full">
								<div class="flex justify-between items-center">
									<div class="flex items-center gap-x-4">
										<div
											style="background-image: url({API_BASE_URL + `/uploads/company/logo/${profile.logo}`})"
											class="min-w-14 min-h-14 w-fit rounded-full bg-gray-200 bg-cover bg-center bg-no-repeat border border-gray-300"
										></div>
										<div class="flex flex-col">
											<div class="flex gap-x-4 items-center">
												<h1 class="text-xl">{profile.name}</h1>
												<span class="text-sm bg-gray-200 px-2 py-1 rounded w-fit">{getDisplayRole($user.role)}</span>
											</div>
											<h2>{$user.email}</h2>
										</div>
									</div>
									{#if $user.profile.ver_stat_pstaff === "Verified"}
										<Button
											Icon={Pen}
											label="Edit Profile"
											size="s"
											class="bg-blue-500"
											onclick={() => updateOn = true}
										/>
									{/if}
								</div>
							</div>
						</div>
						<div class="grid grid-cols-2 gap-x-4 p-6 w-full">
							<div class="px-6 py-3 bg-gray-100 rounded-lg">
								<p class="text-sm text-gray-500">Joined</p>
								<h2 class="text-sm">{new Date($user.created_at).toLocaleDateString("en-US", {
									year: "numeric",
									month: "short",
									day: "numeric"
								})}</h2>
							</div>
							<div class="px-6 py-3 bg-gray-100 rounded-lg">
								<p class="text-sm text-gray-500">Updated</p>
								<h2 class="text-sm">{new Date($user.updated_at).toLocaleDateString("en-US", {
									year: "numeric",
									month: "short",
									day: "numeric"
								})}</h2>
							</div>
						</div>
					</div>
				{/if}
			</div>
			<div class="border border-gray-200 rounded-lg bg-white overflow-clip my-6 flex items-center justify-between p-6">
				{#if updatePasswordOn}
					<div class="flex flex-col items-stretch gap-y-4">
						<h1>Update Password</h1>
						<div class="flex items-center gap-x-4">
							<div class="grow grid grid-cols-3 gap-x-4">
								<PasswordField placeholder="Current Password" bind:value={password.oldPass}/>
								<PasswordField placeholder="New Password" bind:value={password.newPass}/>
								<PasswordField placeholder="Confirm Password" bind:value={password.confirmedNewPass}/>
							</div>
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
{/if}

{#if reviseRequestsOpen}
    <PstaffNotesViewModal
        details={reviseRequestsModalDetails}
        onExit={onExitReviseRequests}
    />
{/if}

{#if previewOpen}
    <PreviewModal
        display={previewDisplay}
        fileName={previewFile}
        fileSource={previewFileSource}
        onExit={() => {
            previewOpen = false;
            previewDisplay = null;
            previewFile = null;
            previewFileSource = null;
        }}
    />
{/if}

{#if vacViewOpen}
    <VacanciesModal onExit={() => vacViewOpen = false}/>
{/if}