<script>
  import { activities, siswas } from "$lib/stores";
  import { select2Action } from "$lib/select2";

  let filterSiswaId = "";
  let filterKelas = "";
  let filterWaktu = "semua"; // "semua", "mingguan", "bulanan", "tahunan"
  let filterType = "";

  // Pagination
  let currentPage = 1;
  let itemsPerPage = 10;

  // Helper to find name by ID
  $: getSiswaName = (id) => {
    const siswa = $siswas.find((s) => s.id == id || s._id == id);
    return siswa ? siswa.username : `Unknown (${id})`;
  };

  // Get unique activity types for filter
  $: activityTypes = [...new Set($activities.map((a) => a.activity_type))];

  // Logic Filtering
  $: filteredActivities = $activities.filter((act) => {
    const matchSiswa =
      filterSiswaId === "" ||
      act.user_id == filterSiswaId ||
      String(act.user_id) === String(filterSiswaId);

    // Get the student's class to apply the class filter
    const siswa = $siswas.find(
      (s) => s.id == act.user_id || s._id == act.user_id,
    );
    const siswaKelas = siswa ? siswa.kelas || "7" : "7";
    const matchKelas = filterKelas === "" || siswaKelas === filterKelas;

    const matchType = filterType === "" || act.activity_type === filterType;

    let matchWaktu = true;
    if (filterWaktu !== "semua" && act.created_at) {
      const actDate = new Date(act.created_at);
      const now = new Date();

      if (filterWaktu === "mingguan") {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(now.getDate() - 7);
        matchWaktu = actDate >= sevenDaysAgo && actDate <= now;
      } else if (filterWaktu === "bulanan") {
        matchWaktu =
          actDate.getMonth() === now.getMonth() &&
          actDate.getFullYear() === now.getFullYear();
      } else if (filterWaktu === "tahunan") {
        matchWaktu = actDate.getFullYear() === now.getFullYear();
      }
    }

    return matchSiswa && matchType && matchWaktu && matchKelas;
  });

  // Calculate Grouped Activities (Date + Student)
  $: groupedActivities = (() => {
    const map = new Map();
    
    // Process filtered activities
    filteredActivities.forEach(act => {
      if (!act.created_at) return;
      
      const dateObj = new Date(act.created_at);
      const dateStr = dateObj.toLocaleDateString("id-ID", {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
      const name = getSiswaName(act.user_id);
      const key = `${dateStr}_${act.user_id}`;
      
      if (!map.has(key)) {
        const s = $siswas.find(x => x.id == act.user_id || x._id == act.user_id);
        map.set(key, {
          date: dateStr,
          rawDate: dateObj,
          studentName: name,
          studentId: act.user_id,
          kelas: s ? s.kelas || "7" : "7",
          acts: []
        });
      }
      
      map.get(key).acts.push(act);
    });
    
    // Convert to array and sort by date (newest first)
    return Array.from(map.values()).sort((a, b) => b.rawDate - a.rawDate);
  })();

  // Calculate Summary
  $: totalActivities = filteredActivities.length;
  $: verifiedActivities = filteredActivities.filter(
    (a) => a.status_guru === "verified" && a.status_ortu === "verified",
  ).length;
  $: pendingActivities = filteredActivities.filter(
    (a) => a.status_guru !== "verified" || a.status_ortu !== "verified",
  ).length;

  // Reset pagination when filter changes
  $: {
    if (filterSiswaId || filterType || filterWaktu || filterKelas) {
      currentPage = 1;
    }
  }

  // Pagination Logic (Grouped)
  $: totalPages = Math.ceil(groupedActivities.length / itemsPerPage);
  $: paginatedActivities = groupedActivities.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  function nextPage() {
    if (currentPage < totalPages) currentPage++;
  }

  function prevPage() {
    if (currentPage > 1) currentPage--;
  }

  function printReport() {
    window.print();
  }

  function exportToCSV() {
    const headers = ["Tanggal", "Nama Siswa", "Kelas", "Kegiatan", "Status"];
    const rows = groupedActivities.map(g => {
      const kegiatan = g.acts.map(a => `${a.activity_type}: ${a.items || a.notes || "-"}`).join("; ");
      const isVerified = g.acts.every(a => a.status_guru === "verified" && a.status_ortu === "verified");
      const status = isVerified ? "Terverifikasi" : "Pending/Ditolak";
      
      return [
        g.date,
        g.studentName,
        g.kelas,
        `"${kegiatan.replace(/"/g, '""')}"`,
        status
      ];
    });

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Laporan_Aktivitas_${new Date().toLocaleDateString('id-ID').replace(/\//g, '-')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
</script>

<div class="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
  <div>
    <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight">Laporan Aktivitas</h1>
    <p class="text-gray-500 mt-1 font-medium">
      Ringkasan kegiatan harian siswa kelas {filterKelas || "semua"}
    </p>
  </div>
  <div class="flex gap-2 w-full sm:w-auto">
    <button
      on:click={exportToCSV}
      class="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl font-semibold shadow-sm transition-all flex items-center justify-center gap-2 active:scale-95"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      Excel (.csv)
    </button>
    <button
      on:click={printReport}
      class="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-semibold shadow-sm transition-all flex items-center justify-center gap-2 active:scale-95"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
        />
      </svg>
      Cetak PDF
    </button>
  </div>
</div>

<!-- Header for Print -->
<div class="hidden print:block mb-10 text-center border-b-2 border-gray-900 pb-6">
  <h1 class="text-3xl font-bold uppercase tracking-widest">Laporan Aktivitas Harian Siswa</h1>
  <p class="text-lg font-medium text-gray-700 mt-2">
    SAPA HEBAT - Sistem Aplikasi Pantau Anak
  </p>
  <div class="flex justify-center gap-10 mt-4 text-sm font-semibold">
    <p>Periode: {filterWaktu === "semua" ? "Semua Waktu" : filterWaktu}</p>
    <p>Kelas: {filterKelas || "Semua"}</p>
    <p>Tanggal Cetak: {new Date().toLocaleDateString('id-ID')}</p>
  </div>
</div>

<!-- Summary Cards -->
<div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 print:mb-10">
  <div class="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-sm border border-gray-100 p-6 relative overflow-hidden group">
    <div class="relative z-10">
      <div class="text-sm font-bold text-gray-400 uppercase tracking-tighter mb-1">Total Aktivitas</div>
      <div class="text-4xl font-black text-gray-900">{totalActivities}</div>
    </div>
    <div class="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    </div>
  </div>
  <div class="bg-gradient-to-br from-white to-green-50 rounded-2xl shadow-sm border border-green-100 p-6 relative overflow-hidden group">
    <div class="relative z-10">
      <div class="text-sm font-bold text-green-600/60 uppercase tracking-tighter mb-1">Terverifikasi</div>
      <div class="text-4xl font-black text-green-600">{verifiedActivities}</div>
    </div>
    <div class="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform text-green-600">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>
  </div>
  <div class="bg-gradient-to-br from-white to-amber-50 rounded-2xl shadow-sm border border-amber-100 p-6 relative overflow-hidden group">
    <div class="relative z-10">
      <div class="text-sm font-bold text-amber-600/60 uppercase tracking-tighter mb-1">Menunggu/Ditolak</div>
      <div class="text-4xl font-black text-amber-500">{pendingActivities}</div>
    </div>
    <div class="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform text-amber-500">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>
  </div>
</div>

<!-- Filters (Hidden on Print) -->
<div
  class="mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-md shadow-gray-200/50 print:hidden"
>
  <div>
    <label
      for="filter-waktu"
      class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">Periode</label
    >
    <select
      id="filter-waktu"
      use:select2Action={{ value: filterWaktu }}
      on:select2_change={(e) => filterWaktu = e.detail}
      class="w-full"
    >
      <option value="semua">Semua Waktu</option>
      <option value="mingguan">7 Hari Terakhir</option>
      <option value="bulanan">Bulan Ini</option>
      <option value="tahunan">Tahun Ini</option>
    </select>
  </div>

  <div>
    <label
      for="filter-siswa"
      class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">Siswa</label
    >
    <select
      id="filter-siswa"
      use:select2Action={{ value: filterSiswaId, placeholder: "Semua Siswa" }}
      on:select2_change={(e) => filterSiswaId = e.detail}
      class="w-full"
    >
      <option value="">Semua Siswa</option>
      {#each $siswas as siswa}
        <option value={siswa.id}>{siswa.username}</option>
      {/each}
    </select>
  </div>

  <div>
    <label
      for="filter-tipe"
      class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">Tipe</label
    >
    <select
      id="filter-tipe"
      use:select2Action={{ value: filterType, placeholder: "Semua Tipe" }}
      on:select2_change={(e) => filterType = e.detail}
      class="w-full"
    >
      <option value="">Semua Tipe</option>
      {#each activityTypes as type}
        <option value={type}>{type}</option>
      {/each}
    </select>
  </div>

  <div>
    <label
      for="filter-kelas"
      class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">Kelas</label
    >
    <select
      id="filter-kelas"
      use:select2Action={{ value: filterKelas, placeholder: "Semua Kelas" }}
      on:select2_change={(e) => filterKelas = e.detail}
      class="w-full"
    >
      <option value="">Semua Kelas</option>
      <option value="7">Kelas 7</option>
      <option value="8">Kelas 8</option>
      <option value="9">Kelas 9</option>
    </select>
  </div>
</div>

<!-- Table -->
<div
  class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-6"
>
  <div class="overflow-x-auto">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th
            class="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-200"
            >Tanggal</th
          >
          <th
            class="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-200"
            >Nama Siswa</th
          >
          <th
            class="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-200"
            >Kelas</th
          >
          <th
            class="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-200"
            >Kegiatan</th
          >
          <th
            class="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-200"
            >Status</th
          >
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-100">
        {#each paginatedActivities as group}
          <tr class="hover:bg-gray-50/50 transition-colors">
            <td class="px-6 py-5 whitespace-nowrap text-sm font-semibold text-gray-600">
              {group.date}
            </td>
            <td class="px-6 py-5 whitespace-nowrap">
              <div class="text-sm font-bold text-gray-900">{group.studentName}</div>
            </td>
            <td class="px-6 py-5 whitespace-nowrap">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-600">
                Kelas {group.kelas}
              </span>
            </td>
            <td class="px-6 py-5">
              <div class="flex flex-wrap gap-1.5 max-w-lg">
                {#each group.acts as act}
                  <div class="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-medium border border-indigo-100 mb-1">
                    <span class="font-bold uppercase tracking-tight">{act.activity_type}</span>
                    <span class="text-indigo-300">|</span>
                    <span class="text-indigo-600/80 italic">{act.items || act.notes || "-"}</span>
                  </div>
                {/each}
              </div>
            </td>
            <td class="px-6 py-5 whitespace-nowrap">
              {#if group.acts.every(a => a.status_guru === "verified" && a.status_ortu === "verified")}
                <span
                  class="bg-green-100 text-green-700 py-1.5 px-3 rounded-xl text-xs font-bold uppercase tracking-tighter"
                  >Tuntas</span
                >
              {:else}
                <span
                  class="bg-amber-100 text-amber-700 py-1.5 px-3 rounded-xl text-xs font-bold uppercase tracking-tighter"
                  >Pending</span
                >
              {/if}
            </td>
          </tr>
        {:else}
          <tr>
            <td colspan="5" class="px-6 py-16 text-center text-gray-400 font-medium">
              <div class="flex flex-col items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Belum ada data untuk filter ini
              </div>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>

  <!-- Pagination Controls (Hidden on Print) -->
  {#if totalPages > 1}
    <div
      class="bg-gray-50/50 px-6 py-4 flex items-center justify-between border-t border-gray-100 print:hidden"
    >
      <div class="flex-1 flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-500 font-medium">
            Hal. <span class="text-gray-900">{currentPage}</span> dari <span class="text-gray-900">{totalPages}</span>
            <span class="mx-2 opacity-30">|</span>
            <span class="text-gray-400">{groupedActivities.length} Entri Harian</span>
          </p>
        </div>
        <div class="flex gap-2">
          <button
            on:click={prevPage}
            disabled={currentPage === 1}
            class="px-4 py-2 border border-gray-200 rounded-xl bg-white text-sm font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
          >
            Kembali
          </button>
          <button
            on:click={nextPage}
            disabled={currentPage === totalPages}
            class="px-4 py-2 border border-gray-200 rounded-xl bg-white text-sm font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
          >
            Lanjut
          </button>
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  @media print {
    :global(body) {
      background-color: white !important;
    }
    .print-hide {
      display: none !important;
    }
    table {
      border-collapse: collapse;
      width: 100%;
    }
    th, td {
      border: 1px solid #e5e7eb !important;
      padding: 12px 8px !important;
    }
    th {
      background-color: #f9fafb !important;
      color: black !important;
    }
    /* Ensure kegiatan list looks good in print */
    .inline-flex {
      border: 1px solid #e2e8f0 !important;
      background: none !important;
      color: black !important;
      margin-right: 4px;
      margin-bottom: 2px;
    }
  }
</style>
