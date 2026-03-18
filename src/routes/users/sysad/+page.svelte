<script>
	import HeadBar from "$lib/components/grouped/users/admins/HeadBar.svelte";
	import { user } from "$lib/app/stores/user";
	import { onMount } from "svelte";
	import { SysadService } from "$lib/app/services/users/sysad";
	import { DeanService } from "$lib/app/services/users/dean";
	import { PstaffService } from "$lib/app/services/users/pstaff";
	import { AlumniService } from "$lib/app/services/users/alumni";
	import { CompanyService } from "$lib/app/services/users/company";
	import { SchoolService } from "$lib/app/services/insti/school";
	import { CourseService } from "$lib/app/services/insti/course";

	let loading = false; // set to true on connect phase
	let errorMessage = "";

	let sysadStats = { active: 0, inactive: 0, total: 0 };
	let deanStats = { active: 0, inactive: 0, total: 0 };
	let pstaffStats = { active: 0, inactive: 0, total: 0 };

	let alumniSummary = { pending: 0, verified: 0, rejected: 0, total: 0 };
	let alumniEmploymentPerCourse = [];
	let alumniRegistration = { registered: 0, notRegistered: 0, total: 0 };
	let occupationAlignment = [];

	let companyVerification = { pending: 0, verified: 0, rejected: 0, total: 0 };
	let schoolsInfo = { active: 0, archived: 0, total: 0 };
	let coursesInfo = { active: 0, archived: 0, total: 0 };

	const fetchSearch = (service, q = "", opts = {}) =>
		new Promise((resolve, reject) =>
			service.search(q, {
				...opts,
				onSuccess: (data) => resolve(data),
				onFail: (data, status) => reject({ data, status })
			})
		);

	const donutStyle = (value, total, color = "#3b82f6") => {
		const percent = total > 0 ? Math.round((value / total) * 100) : 0;
		return `background: conic-gradient(${color} ${percent}%, rgba(229, 231, 235, 1) ${percent}% 100%);`;
	};

	const stackedDonut = (segments = [], fallback = "#e5e7eb") => {
		const total = segments.reduce((sum, seg) => sum + (seg?.value || 0), 0);
		if (!total) return `background: conic-gradient(${fallback} 0 100%);`;

		let cursor = 0;
		const slices = segments.map((seg) => {
			const start = (cursor / total) * 100;
			cursor += seg.value || 0;
			const end = (cursor / total) * 100;
			return `${seg.color} ${start}% ${end}%`;
		});

		if (cursor < total) slices.push(`${fallback} ${(cursor / total) * 100}% 100%`);
		return `background: conic-gradient(${slices.join(", ")});`;
	};

	const pct = (value = 0, total = 0) => (total ? Math.round((value / total) * 100) : 0);
	const widthPct = (value = 0, total = 0) => `${total ? (value / total) * 100 : 0}%`;

	async function loadDashboardData() {
		try {
			const [
				sysadActive, sysadInactive,
				deanActive, deanInactive,
				pstaffActive, pstaffInactive,
				alumniPending, alumniVerified, alumniRejected, alumniAllResult,
				companyPending, companyVerified, companyRejected,
				schoolsActive, schoolsArchived,
				coursesActive, coursesArchived,
				courses
			] = await Promise.all([
				fetchSearch(SysadService, "", { enabled: true, perPage: 1, page: 1 }),
				fetchSearch(SysadService, "", { enabled: false, perPage: 1, page: 1 }),
				fetchSearch(DeanService, "", { enabled: true, perPage: 1, page: 1 }),
				fetchSearch(DeanService, "", { enabled: false, perPage: 1, page: 1 }),
				fetchSearch(PstaffService, "", { enabled: true, perPage: 1, page: 1 }),
				fetchSearch(PstaffService, "", { enabled: false, perPage: 1, page: 1 }),
				fetchSearch(AlumniService, "", { verStatus: "Pending", perPage: 1, page: 1 }),
				fetchSearch(AlumniService, "", { verStatus: "Verified", perPage: 1, page: 1 }),
				fetchSearch(AlumniService, "", { verStatus: "Rejected", perPage: 1, page: 1 }),
				fetchSearch(AlumniService, "", { verStatus: "", page: 1, perPage: 100 }),
				fetchSearch(CompanyService, "", { enabled: true, ver_status: "Pending", perPage: 1, page: 1 }),
				fetchSearch(CompanyService, "", { enabled: true, ver_status: "Verified", perPage: 1, page: 1 }),
				fetchSearch(CompanyService, "", { enabled: true, ver_status: "Rejected", perPage: 1, page: 1 }),
				fetchSearch(SchoolService, "", { archived: false, perPage: 1, page: 1 }),
				fetchSearch(SchoolService, "", { archived: true, perPage: 1, page: 1 }),
				fetchSearch(CourseService, "", { archived: false, perPage: 1, page: 1 }),
				fetchSearch(CourseService, "", { archived: true, perPage: 1, page: 1 }),
				new Promise((res, rej) => CourseService.all(res, rej)),
			]);

			// sysad
			sysadStats.active = sysadActive.total || 0;
			sysadStats.inactive = sysadInactive.total || 0;
			sysadStats.total = sysadStats.active + sysadStats.inactive;

			// dean
			deanStats.active = deanActive.total || 0;
			deanStats.inactive = deanInactive.total || 0;
			deanStats.total = deanStats.active + deanStats.inactive;

			// pstaff
			pstaffStats.active = pstaffActive.total || 0;
			pstaffStats.inactive = pstaffInactive.total || 0;
			pstaffStats.total = pstaffStats.active + pstaffStats.inactive;

			// alumni summary
			alumniSummary.pending = alumniPending.total || 0;
			alumniSummary.verified = alumniVerified.total || 0;
			alumniSummary.rejected = alumniRejected.total || 0;
			alumniSummary.total = alumniSummary.pending + alumniSummary.verified + alumniSummary.rejected;

			// alumni registration
			const alumniAll = alumniAllResult?.data || [];
			alumniRegistration.total = alumniAll.length;
			alumniRegistration.registered = alumniAll.filter((a) =>
				[a.profile?.ver_stat_dean, a.profile?.ver_stat_sysad, a.profile?.ver_stat_pstaff].includes("Verified")
			).length;
			alumniRegistration.notRegistered = alumniRegistration.total - alumniRegistration.registered;

			// company
			companyVerification.pending = companyPending.total || 0;
			companyVerification.verified = companyVerified.total || 0;
			companyVerification.rejected = companyRejected.total || 0;
			companyVerification.total = companyVerification.pending + companyVerification.verified + companyVerification.rejected;

			// schools
			schoolsInfo.active = schoolsActive.total || 0;
			schoolsInfo.archived = schoolsArchived.total || 0;
			schoolsInfo.total = schoolsInfo.active + schoolsInfo.archived;

			// courses
			coursesInfo.active = coursesActive.total || 0;
			coursesInfo.archived = coursesArchived.total || 0;
			coursesInfo.total = coursesInfo.active + coursesInfo.archived;

			// per-course employment + alignment (still needs courses first, but now parallel with each other)
			const courseList = courses.slice(0, 6).map((c) => ({ id: c.id, name: c.name }));

			if (courseList.length > 0) {
				alumniEmploymentPerCourse = courseList.map((course) => {
					const alumniForCourse = alumniAll.filter((a) => a.profile?.course?.id === course.id);
					return {
						course: course.name,
						employed: alumniForCourse.filter((a) => a.profile?.employment_status === "Employed").length,
						selfEmployed: alumniForCourse.filter((a) => a.profile?.employment_status === "Self-employed").length,
						unemployed: alumniForCourse.filter((a) => a.profile?.employment_status === "Unemployed").length,
						total: alumniForCourse.length
					};
				});

				occupationAlignment = await Promise.all(
					courseList.map(async (course) => {
						const [aligned, notAligned] = await Promise.all([
							fetchSearch(CourseService, "", { courseId: course.id, aligned: true, perPage: 1, page: 1, q: "" }),
							fetchSearch(CourseService, "", { courseId: course.id, aligned: false, perPage: 1, page: 1, q: "" }),
						]);
						return {
							course: course.name,
							aligned: aligned.total || 0,
							notAligned: notAligned.total || 0
						};
					})
				);
			}

		} catch (err) {
			errorMessage = err?.data?.message || "Unable to load dashboard data.";
		} finally {
			loading = false;
		}
	}

	onMount(() => {
		// loadDashboardData();
	});
</script>

<div class="flex flex-col items-stretch overflow-hidden h-full">
	<HeadBar title="Dashboard"/>
	<div class="h-[calc(100%-64px)] overflow-auto">
		{#if loading}
			<div class="p-6 text-sm text-gray-600">Loading dashboard... ⏳</div>
		{:else}
			{#if errorMessage}
				<!-- <div class="p-6 text-sm text-red-600">{errorMessage}</div> -->
			{/if}

			<div class="p-6 space-y-10">
				<section class="space-y-4">
					<div class="grid gap-4 md:grid-cols-3">
						{#each [
							{ title: "System Administrators", stats: sysadStats, color: "#b91c1c" },
							{ title: "Deans", stats: deanStats, color: "#2563eb" },
							{ title: "PESO Staffs", stats: pstaffStats, color: "#f97316" }
						] as card}
							{#if card.title !== "System Administrators" || card.title === "System Administrators" && $user.default_sysad}
								<div class="relative overflow-hidden rounded-lg border border-gray-200 bg-white p-5 flex flex-col gap-4">
									<div class="absolute inset-x-0 top-0 h-1.5" style={`background: linear-gradient(90deg, ${card.color}, rgba(255,255,255,0));`}></div>
									<div class="flex items-start justify-between gap-4">
										<div>
											<p class="text-sm text-gray-500">{card.title}</p>
											<p class="text-3xl font-semibold leading-tight">{card.stats.total}</p>
											<p class="text-xs text-gray-500 mt-1">Total users</p>
										</div>
										<div class="w-20 h-20 rounded-full border border-gray-100 shadow-inner" style={donutStyle(card.stats.active, card.stats.total, card.color)}></div>
									</div>
									<div class="grid grid-cols-2 gap-3 text-sm">
										<div class="rounded-lg bg-gray-50 p-3 border border-gray-100">
											<p class="text-[11px] uppercase tracking-wide text-gray-500">Active</p>
											<p class="text-lg font-semibold text-gray-900">{card.stats.active}</p>
										</div>
										<div class="rounded-lg bg-gray-50 p-3 border border-gray-100">
											<p class="text-[11px] uppercase tracking-wide text-gray-500">Inactive</p>
											<p class="text-lg font-semibold text-gray-900">{card.stats.inactive}</p>
										</div>
									</div>
								</div>
							{/if}
						{/each}
					</div>
				</section>

				<section class="space-y-2">
					<h2 class="text-lg font-semibold">Alumni Insights</h2>

					<div class="grid gap-4 lg:grid-cols-2">
						<div class="rounded-lg border border-gray-200 bg-white p-5 space-y-4">
							<div class="flex items-center justify-between">
								<h3 class="font-semibold">Employment Information (per course)</h3>
								<span class="text-xs text-gray-500">Top 6 courses</span>
							</div>
							{#if alumniEmploymentPerCourse.length > 0}
								<div class="grid gap-3 sm:grid-cols-2">
									{#each alumniEmploymentPerCourse as row}
										<div class="rounded-lg border border-gray-100 bg-gray-50 p-3 flex items-center gap-3">
											<div
												class="w-14 h-14 rounded-full shadow-inner border border-white"
												style={stackedDonut([
													{ value: row.employed, color: "#16a34a" },
													{ value: row.selfEmployed, color: "#0ea5e9" },
													{ value: row.unemployed, color: "#f59e0b" }
												])}
											></div>
											<div class="space-y-1">
												<p class="text-sm font-semibold text-gray-800 leading-tight">{row.course}</p>
												<p class="text-[11px] uppercase tracking-wide text-gray-500">Total {row.total}</p>
												<div class="text-[12px] text-gray-600 space-x-2">
													<span class="inline-flex items-center gap-1">
														<span class="inline-block h-2 w-2 rounded-full bg-green-600"></span>{row.employed} Employed
													</span>
													<span class="inline-flex items-center gap-1">
														<span class="inline-block h-2 w-2 rounded-full bg-sky-500"></span>{row.selfEmployed} Self
													</span>
													<span class="inline-flex items-center gap-1">
														<span class="inline-block h-2 w-2 rounded-full bg-amber-500"></span>{row.unemployed} Unemp
													</span>
												</div>
											</div>
										</div>
									{/each}
								</div>
							{:else}
								<p class="text-sm text-gray-500">No alumni employment data available.</p>
							{/if}
						</div>

						<div class="rounded-lg border border-gray-200 bg-white p-5 space-y-4">
							<div class="flex items-center justify-between">
								<h3 class="font-semibold">Verification Information</h3>
								<p class="text-xs text-gray-500">Total {alumniSummary.total}</p>
							</div>
							<div class="flex gap-6 items-center">
								<div
									class="w-28 h-28 rounded-full border border-gray-100 shadow-inner"
									style={stackedDonut([
										{ value: alumniSummary.pending, color: "#a855f7" },
										{ value: alumniSummary.verified, color: "#16a34a" },
										{ value: alumniSummary.rejected, color: "#dc2626" }
									])}
								></div>
								<div class="grid gap-2 text-sm">
									<div class="flex items-center gap-2">
										<span class="h-2.5 w-2.5 rounded-full bg-purple-500"></span>
										<span class="text-gray-700 font-medium">Pending</span>
										<span class="text-gray-500 ml-auto">{alumniSummary.pending} ({pct(alumniSummary.pending, alumniSummary.total)}%)</span>
									</div>
									<div class="flex items-center gap-2">
										<span class="h-2.5 w-2.5 rounded-full bg-green-600"></span>
										<span class="text-gray-700 font-medium">Verified</span>
										<span class="text-gray-500 ml-auto">{alumniSummary.verified} ({pct(alumniSummary.verified, alumniSummary.total)}%)</span>
									</div>
									<div class="flex items-center gap-2">
										<span class="h-2.5 w-2.5 rounded-full bg-red-600"></span>
										<span class="text-gray-700 font-medium">Rejected</span>
										<span class="text-gray-500 ml-auto">{alumniSummary.rejected} ({pct(alumniSummary.rejected, alumniSummary.total)}%)</span>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div class="grid gap-4 lg:grid-cols-2 mt-4">
						<div class="rounded-lg border border-gray-200 bg-white p-5 space-y-4">
							<div class="flex items-center justify-between">
								<h3 class="font-semibold">Occupation Alignment To Course</h3>
								<span class="text-xs text-gray-500">Aligned vs not aligned</span>
							</div>
							{#if occupationAlignment.length > 0}
								<div class="space-y-3">
									{#each occupationAlignment as item}
										<div class="space-y-1">
											<div class="flex items-center justify-between text-sm">
												<p class="font-semibold text-gray-800">{item.course}</p>
												<span class="text-gray-500 text-xs">{item.aligned + item.notAligned} total</span>
											</div>
											<div class="h-3 rounded-full bg-gray-100 overflow-hidden flex">
												<div class="h-full bg-emerald-500" style={`width: ${widthPct(item.aligned, item.aligned + item.notAligned)};`}></div>
												<div class="h-full bg-rose-500" style={`width: ${widthPct(item.notAligned, item.aligned + item.notAligned)};`}></div>
											</div>
											<div class="flex text-[12px] text-gray-600 justify-between">
												<span>Aligned {item.aligned}</span>
												<span>Not aligned {item.notAligned}</span>
											</div>
										</div>
									{/each}
								</div>
							{:else}
								<p class="text-sm text-gray-500">No occupation alignment data available.</p>
							{/if}
						</div>

						<div class="rounded-lg border border-gray-200 bg-white p-5 space-y-4">
							<div class="flex items-center justify-between">
								<h3 class="font-semibold">Registration Information</h3>
								<span class="text-xs text-gray-500">Sample size: {alumniRegistration.total}</span>
							</div>
							<div class="space-y-4">
								<div class="space-y-1">
									<div class="flex justify-between text-sm text-gray-700">
										<span class="font-medium">Registered</span>
										<span>{alumniRegistration.registered} ({pct(alumniRegistration.registered, alumniRegistration.total)}%)</span>
									</div>
									<div class="h-3 rounded-full bg-gray-100 overflow-hidden">
										<div class="h-full bg-blue-600" style={`width: ${widthPct(alumniRegistration.registered, alumniRegistration.total)};`}></div>
									</div>
								</div>
								<div class="space-y-1">
									<div class="flex justify-between text-sm text-gray-700">
										<span class="font-medium">Not Registered</span>
										<span>{alumniRegistration.notRegistered} ({pct(alumniRegistration.notRegistered, alumniRegistration.total)}%)</span>
									</div>
									<div class="h-3 rounded-full bg-gray-100 overflow-hidden">
										<div class="h-full bg-amber-500" style={`width: ${widthPct(alumniRegistration.notRegistered, alumniRegistration.total)};`}></div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>

				<section class="space-y-2">
					<h2 class="text-lg font-semibold">Verification Overview</h2>

					<div class="rounded-lg border border-gray-200 bg-white p-5 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
						<div
							class="w-32 h-32 rounded-full border border-gray-100 shadow-inner"
							style={stackedDonut([
								{ value: companyVerification.pending, color: "#f59e0b" },
								{ value: companyVerification.verified, color: "#16a34a" },
								{ value: companyVerification.rejected, color: "#dc2626" }
							])}
						></div>
						<div class="grid gap-2 text-sm w-full lg:w-72">
							<div class="flex items-center gap-2">
								<span class="h-2.5 w-2.5 rounded-full bg-amber-500"></span>
								<span class="text-gray-700 font-medium">Pending</span>
								<span class="ml-auto text-gray-500">{companyVerification.pending} ({pct(companyVerification.pending, companyVerification.total)}%)</span>
							</div>
							<div class="flex items-center gap-2">
								<span class="h-2.5 w-2.5 rounded-full bg-emerald-600"></span>
								<span class="text-gray-700 font-medium">Verified</span>
								<span class="ml-auto text-gray-500">{companyVerification.verified} ({pct(companyVerification.verified, companyVerification.total)}%)</span>
							</div>
							<div class="flex items-center gap-2">
								<span class="h-2.5 w-2.5 rounded-full bg-rose-600"></span>
								<span class="text-gray-700 font-medium">Rejected</span>
								<span class="ml-auto text-gray-500">{companyVerification.rejected} ({pct(companyVerification.rejected, companyVerification.total)}%)</span>
							</div>
							<div class="flex items-center gap-2 pt-1 border-t border-gray-100">
								<span class="text-xs uppercase tracking-wide text-gray-500">Total</span>
								<span class="ml-auto text-gray-700 font-semibold">{companyVerification.total}</span>
							</div>
						</div>
					</div>
				</section>

				<section class="space-y-2">
					<h2 class="text-lg font-semibold">Schools and Courses</h2>

					<div class="grid gap-4 md:grid-cols-2">
						{#each [
							{ title: "Schools Information", data: schoolsInfo, color: "#0ea5e9" },
							{ title: "Courses Information", data: coursesInfo, color: "#8b5cf6" }
						] as inst}
							<div class="rounded-lg border border-gray-200 bg-white p-5 flex items-center gap-4">
								<div class="w-20 h-20 rounded-full border border-gray-100 shadow-inner" style={donutStyle(inst.data.active, inst.data.total, inst.color)}></div>
								<div class="space-y-1">
									<h3 class="font-semibold text-gray-800">{inst.title}</h3>
									<p class="text-sm text-gray-600">Active {inst.data.active} | Archived {inst.data.archived}</p>
									<p class="text-xs text-gray-500">Total {inst.data.total}</p>
								</div>
							</div>
						{/each}
					</div>
				</section>
			</div>
		{/if}
	</div>
</div>