<script>
	import { AlumniService } from "$lib/app/services/users/alumni";
	import { SysadService } from "$lib/app/services/users/sysad";
	import { user } from "$lib/app/stores/user";
	import { Toast } from "$lib/app/utils/swal";
	import HeadBar from "$lib/components/grouped/users/admins/HeadBar.svelte";
	import Button from "$lib/components/single/global/Button.svelte";
	import { Download } from "lucide-svelte";
	import { onMount } from "svelte";
	import { twMerge } from "tailwind-merge";

	let data = $state(null);
	let dataLoading = $state(false);

	function pct(a, b) { return b ? Math.round((a / b) * 100) : 0; }

	let alumni = $state(null);
	let emp = $state(null)
	let totalEmp = $state(0);
	let reg = $state(null);
	let ver = $state(null);
	let totalVer = $state(0);
	let courseKeys = $state([]);

	const userCards = [
		{ label: 'Sys. Administrators', key: 'sysad',   bar: 'bg-purple-500', text: 'text-purple-600' },
		{ label: 'Deans',               key: 'dean',    bar: 'bg-blue-500',   text: 'text-blue-600'   },
		{ label: 'PESO Staff',          key: 'pstaff',  bar: 'bg-orange-500', text: 'text-orange-600' },
		{ label: 'Companies',           key: 'company', bar: 'bg-green-500',  text: 'text-green-600'  },
	];

	function downloadCsv() {
		window.open('/api/analytics/report', '_blank')
	}

	onMount(async () => {
		dataLoading = true;
		
		await SysadService.getAnalytics(
			async (d, status) => {
				data = d;
				dataLoading = false;
				alumni = data?.alumni;
				emp = alumni?.employment_status_info;
				totalEmp = (emp?.employed ?? 0) + (emp?.self_employed ?? 0) + (emp?.unemployed ?? 0);
				reg = alumni?.registration_info;
				ver = alumni?.verification_status_info;
				totalVer = (ver?.pending ?? 0) + (ver?.verified ?? 0) + (ver?.rejected ?? 0);
				courseKeys = Object.keys(alumni?.occupation_course_alignement_info ?? {});
			},
			async (d, status) => {
				dataLoading = false;

				await Toast.fire({
					title: "Failed to load analytics."
				});
			},
		);
	})
</script>

<div class="flex flex-col items-stretch overflow-hidden h-full">
	<HeadBar title="Dashboard"/>
	{#if dataLoading || !data}
		<div class="flex items-center justify-center h-full text-sm text-gray-400">Loading...</div>
	{:else}
		<div class="h-[calc(100%-64px)] overflow-auto">
			<div class="min-h-screen bg-gray-50 p-6 space-y-6">
			
				<!-- USER ACCOUNTS -->
				<section>
					<h2 class="section-label">User Accounts</h2>
					<div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
						{#each userCards as c}
							{#if c.key === 'sysad' && $user.default_sysad || c.key !== 'sysad'}
								{@const d = data[c.key]}
								<div class="bg-white rounded-lg border p-4 border-gray-200">
									<div class="flex items-start justify-between mb-3">
										<span class="text-xs font-semibold text-gray-500 uppercase tracking-wide leading-tight max-w-[70%]">{c.label}</span>
										<span class={twMerge("text-2xl font-bold", c.text)}>{d.total}</span>
									</div>
									<div class="h-1.5 bg-gray-100 rounded-full mb-3 overflow-hidden">
										<div class={twMerge("h-full rounded-full transition-all", c.bar)} style="width:{pct(d.active, d.total)}%"></div>
									</div>
									<div class="flex justify-between text-xs">
										<span class="text-green-600 font-medium">● {d.active} active</span>
										<span class="text-gray-400">● {d.inactive} inactive</span>
									</div>
								</div>
							{/if}
						{/each}
					</div>
				</section>
			
				<!-- ALUMNI OVERVIEW -->
				<section>
					<h2 class="section-label">Alumni Overview</h2>
					<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
			
						<!-- Registration Progress -->
						<div class="bg-white rounded-lg border border-gray-200 p-4">
							<p class="card-label">Registration Progress</p>
							<div class="flex items-center gap-4">
								<div class="relative w-28 h-28 flex-shrink-0">
									<svg viewBox="0 0 120 120" class="w-full h-full -rotate-90">
										<circle cx="60" cy="60" r="50" fill="none" stroke="#f1f5f9" stroke-width="12"/>
										<circle cx="60" cy="60" r="50" fill="none" stroke="#16a34a" stroke-width="12"
											stroke-dasharray="{pct(alumni.summary_info.total, reg.expected) * 3.14} 314"
											stroke-linecap="round"/>
									</svg>
									<div class="absolute inset-0 flex flex-col items-center justify-center">
										<span class="text-lg font-bold text-gray-800">{pct(alumni.summary_info.total, reg.expected)}%</span>
										<span class="text-xs text-gray-400">done</span>
									</div>
								</div>
								<div class="flex flex-col gap-2 flex-1">
									<div class="flex justify-between text-xs"><span class="text-gray-500">Registered</span><strong class="text-gray-800">{alumni.summary_info.total.toLocaleString()}</strong></div>
									<div class="flex justify-between text-xs"><span class="text-gray-500">Expected</span><strong class="text-gray-800">{reg.expected.toLocaleString()}</strong></div>
									<div class="flex justify-between text-xs"><span class="text-gray-500">Not yet</span><strong class="text-red-500">{(reg.expected - alumni.summary_info.total).toLocaleString()}</strong></div>
								</div>
							</div>
						</div>
			
						<!-- Gender Distribution -->
						<div class="bg-white rounded-lg border border-gray-200 p-4">
							<p class="card-label">Gender Distribution</p>
							<div class="space-y-4">
								{#each [
									{ icon: '♂', label: 'Male',   d: alumni.summary_info.male,   exp: reg.expected_male,   bar: 'bg-blue-500', text: 'text-blue-600' },
									{ icon: '♀', label: 'Female', d: alumni.summary_info.female, exp: reg.expected_female, bar: 'bg-pink-500', text: 'text-pink-600' },
								] as g}
									<div>
										<div class="flex justify-between text-xs mb-1.5">
											<span class={twMerge("font-semibold", g.text)}>{g.icon} {g.label}</span>
											<span class="text-gray-500">{g.d.total} <span class="text-gray-300">/ {g.exp} exp.</span></span>
										</div>
										<div class="h-2 bg-gray-100 rounded-full overflow-hidden mb-1">
											<div class={twMerge("h-full rounded-full", g.bar)} style="width:{pct(g.d.total, g.exp)}%"></div>
										</div>
										<div class="flex justify-between text-xs text-gray-400">
											<span>{g.d.active} active</span>
											<span>{g.d.inactive} inactive</span>
										</div>
									</div>
								{/each}
							</div>
						</div>
			
						<!-- Verification Status -->
						<div class="bg-white rounded-lg border border-gray-200 p-4">
							<p class="card-label">Verification Status</p>
							<div class="space-y-3">
								{#each [
									{ label: 'Verified', val: ver.verified, bar: 'bg-green-500',  dot: 'bg-green-500',  text: 'text-green-600'  },
									{ label: 'Pending',  val: ver.pending,  bar: 'bg-yellow-400', dot: 'bg-yellow-400', text: 'text-yellow-600' },
									{ label: 'Rejected', val: ver.rejected, bar: 'bg-red-500',    dot: 'bg-red-500',    text: 'text-red-500'    },
								] as s}
									<div>
										<div class="flex items-center gap-2 mb-1">
											<span class={twMerge("w-2 h-2 rounded-full flex-shrink-0", s.dot)}></span>
											<span class="text-xs text-gray-600 flex-1">{s.label}</span>
											<span class={twMerge("text-xs font-bold", s.text)}>{s.val}</span>
											<span class="text-xs text-gray-400">{pct(s.val, totalVer)}%</span>
										</div>
										<div class="h-1.5 bg-gray-100 rounded-full overflow-hidden">
											<div class={twMerge("h-full rounded-full", s.bar)} style="width:{pct(s.val, totalVer)}%"></div>
										</div>
									</div>
								{/each}
							</div>
						</div>
					</div>
				</section>
			
				<!-- EMPLOYMENT + COURSE ALIGNMENT -->
				<section>
					<h2 class="section-label">Employment & Course Alignment</h2>
					<div class="grid grid-cols-1 gap-4">
			
						<!-- Employment Donut -->
						<div class="bg-white rounded-lg border border-gray-200 p-4">
							<p class="card-label">Employment Breakdown <span class="text-gray-500">(verified alumni)</span></p>
							<div class="flex items-center gap-6">
								<svg viewBox="0 0 140 140" class="w-36 flex-shrink-0">
									{#each (() => {
										const items = [
											{ val: emp.employed,      color: '#16a34a' },
											{ val: emp.self_employed,  color: '#2563eb' },
											{ val: emp.unemployed,     color: '#ef4444' },
										];
										let offset = 0;
										const r = 52, circ = 2 * Math.PI * r;
										return items.map(item => {
											const dash = (item.val / totalEmp) * circ;
											const seg = { ...item, dash, offset: circ - offset };
											offset += dash;
											return seg;
										});
									})() as seg}
										<circle cx="70" cy="70" r="52" fill="none" stroke={seg.color} stroke-width="20"
											stroke-dasharray="{seg.dash} {2 * Math.PI * 52 - seg.dash}"
											stroke-dashoffset={seg.offset} transform="rotate(-90 70 70)"/>
									{/each}
									<circle cx="70" cy="70" r="40" fill="white"/>
									<text x="70" y="66" text-anchor="middle" fill="#1f2937" font-size="17" font-weight="700">{totalEmp}</text>
									<text x="70" y="80" text-anchor="middle" fill="#9ca3af" font-size="9">alumni</text>
								</svg>
								<div class="flex flex-col gap-3 flex-1">
									{#each [
										{ label: 'Employed',      val: emp.employed,     dot: 'bg-green-500', text: 'text-green-700' },
										{ label: 'Self-Employed', val: emp.self_employed, dot: 'bg-blue-600',  text: 'text-blue-700'  },
										{ label: 'Unemployed',    val: emp.unemployed,   dot: 'bg-red-500',   text: 'text-red-600'   },
									] as item}
										<div class="flex items-center gap-2 text-xs">
											<span class={twMerge("w-2.5 h-2.5 rounded-sm flex-shrink-0", item.dot)}></span>
											<span class="text-gray-500 flex-1">{item.label}</span>
											<span class="font-bold text-gray-700">{item.val}</span>
											<span class="text-gray-400">({pct(item.val, totalEmp)}%)</span>
										</div>
									{/each}
								</div>
							</div>
						</div>
			
						<!-- Course Alignment -->
						<div class="bg-white rounded-lg border border-gray-200 p-4">
							<p class="card-label">Course-Aligned Occupations</p>
							<div class="space-y-3">
								{#each courseKeys as code}
									{@const c = alumni.occupation_course_alignement_info[code]}
									{@const ap = pct(c.total_aligned_with_course, c.total_with_course)}
									<div>
										<div class="flex items-center gap-2 mb-1 text-xs">
											<span class="font-bold text-green-700 w-14">{code}</span>
											<span class="text-gray-400 flex-1">{c.total_aligned_with_course} / {c.total_with_course} aligned</span>
											<span class="font-semibold text-gray-700">{ap}%</span>
										</div>
										<div class="h-1.5 bg-gray-100 rounded-full overflow-hidden">
											<div class="h-full bg-green-500 rounded-full" style="width:{ap}%"></div>
										</div>
									</div>
								{/each}
							</div>
						</div>
					</div>
				</section>
			
				<!-- COMPANY VERIFICATION -->
				<section>
					<h2 class="section-label">Company Verification</h2>
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						{#each [
							{ label: 'Sysad Review',   info: data.company.sysad_verification_info },
							{ label: 'PESO Staff Review', info: data.company.pstaff_verification_info },
						] as panel}
							{@const tot = panel.info.verified + panel.info.pending + panel.info.rejected}
							<div class="bg-white rounded-lg border border-gray-200 p-4">
								<p class="card-label">{panel.label}</p>
								<div class="space-y-3">
									{#each [
										{ label: 'Verified', val: panel.info.verified, bar: 'bg-green-500',  dot: 'bg-green-500',  text: 'text-green-600'  },
										{ label: 'Pending',  val: panel.info.pending,  bar: 'bg-yellow-400', dot: 'bg-yellow-400', text: 'text-yellow-600' },
										{ label: 'Rejected', val: panel.info.rejected, bar: 'bg-red-500',    dot: 'bg-red-500',    text: 'text-red-500'    },
									] as s}
										<div>
											<div class="flex items-center gap-2 mb-1 text-xs">
												<span class={twMerge("w-2 h-2 rounded-full flex-shrink-0", s.dot)}></span>
												<span class="text-gray-600 flex-1">{s.label}</span>
												<span class={twMerge("font-bold", s.text)}>{s.val}</span>
												<span class="text-gray-400">{pct(s.val, tot)}%</span>
											</div>
											<div class="h-1.5 bg-gray-100 rounded-full overflow-hidden">
												<div class={twMerge("h-full rounded-full", s.bar)} style="width:{pct(s.val, tot)}%"></div>
											</div>
										</div>
									{/each}
								</div>
							</div>
						{/each}
					</div>
				</section>
			
				<!-- RECORDS -->
				<section>
					<h2 class="section-label">Records</h2>
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						{#each [
							{ label: 'Schools', d: data.schools },
							{ label: 'Courses', d: data.courses },
						] as item}
							<div class="bg-white rounded-lg border border-gray-200 p-4 flex items-center justify-between">
								<div>
									<p class="card-label">{item.label}</p>
									<p class="text-3xl font-bold text-gray-800">{item.d.total}</p>
								</div>
								<div class="flex gap-2">
									<span class="chip-green">{item.d.not_archived} active</span>
									<span class="chip-gray">{item.d.archived} archived</span>
								</div>
							</div>
						{/each}
					</div>
				</section>
			
				<div class="flex flex-col items-end">
					<Button
						Icon={Download}
						label="Export CSV"
						class="bg-blue-500"
						size="s"
						onclick={async () => {
							let downloaded = await SysadService.downloadCsv();

							if (!downloaded) await Toast.fire({
								title: "Unable to download csv.",
								icon: "error"
							})
						}}
					/>
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	.section-label {
		font-size: 0.7rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: #6b7280;
		margin-bottom: 0.75rem;
		padding-left: 0.625rem;
		border-left: 3px solid #16a34a;
	}
	.card-label {
		font-size: 0.65rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: #9ca3af;
		margin-bottom: 0.875rem;
	}
	.chip-green {
		font-size: 0.65rem;
		padding: 0.2rem 0.6rem;
		border-radius: 999px;
		background: #dcfce7;
		color: #16a34a;
		font-weight: 600;
	}
	.chip-gray {
		font-size: 0.65rem;
		padding: 0.2rem 0.6rem;
		border-radius: 999px;
		background: #f3f4f6;
		color: #6b7280;
		font-weight: 600;
	}
</style>