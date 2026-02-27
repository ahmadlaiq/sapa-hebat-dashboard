<script>
  import { activities, siswas } from "$lib/stores";

  let filterSiswaId = "";
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

    const matchType = filterType === "" || act.activity_type === filterType;

    let matchWaktu = true;
    if (filterWaktu !== "semua" && act.created_at) {
      const actDate = new Date(act.created_at);
      const now = new Date();

      if (filterWaktu === "mingguan") {
        // Pengecekan apakah dalam 7 hari terakhir
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(now.getDate() - 7);
        matchWaktu = actDate >= sevenDaysAgo && actDate <= now;
      } else if (filterWaktu === "bulanan") {
        // Pengecekan apakah di bulan yang sama di tahun ini
        matchWaktu =
          actDate.getMonth() === now.getMonth() &&
          actDate.getFullYear() === now.getFullYear();
      } else if (filterWaktu === "tahunan") {
        // Pengecekan apakah di tahun yang sama
        matchWaktu = actDate.getFullYear() === now.getFullYear();
      }
    }

    return matchSiswa && matchType && matchWaktu;
  });

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
    if (filterSiswaId || filterType || filterWaktu) {
      currentPage = 1;
    }
  }

  // Pagination Logic
  $: totalPages = Math.ceil(filteredActivities.length / itemsPerPage);
  $: paginatedActivities = filteredActivities.slice(
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
</script>

<div class="mb-6 flex justify-between items-center print:hidden">
  <div>
    <h1 class="text-3xl font-bold text-gray-800">Laporan Aktivitas Siswa</h1>
    <p class="text-gray-500 mt-1">
      Laporan kegiatan siswa berdasarkan periode waktu
    </p>
  </div>
  <button
    on:click={printReport}
    class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors flex items-center gap-2"
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
    Cetak Laporan
  </button>
</div>

<!-- Header for Print -->
<div class="hidden print:block mb-8 text-center">
  <h1 class="text-2xl font-bold">Laporan Aktivitas Siswa</h1>
  <p class="text-gray-600">
    Periode:
    {filterWaktu === "semua"
      ? "Semua Waktu"
      : filterWaktu === "mingguan"
        ? "7 Hari Terakhir"
        : filterWaktu === "bulanan"
          ? "Hingga Bulan Ini"
          : "Tahun Ini"}
  </p>
</div>

<!-- Summary Cards -->
<div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
  <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
    <div class="text-sm font-medium text-gray-500 mb-1">Total Aktivitas</div>
    <div class="text-3xl font-bold text-gray-900">{totalActivities}</div>
  </div>
  <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
    <div class="text-sm font-medium text-gray-500 mb-1">
      Aktivitas Terverifikasi
    </div>
    <div class="text-3xl font-bold text-green-600">{verifiedActivities}</div>
  </div>
  <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
    <div class="text-sm font-medium text-gray-500 mb-1">Menunggu/Ditolak</div>
    <div class="text-3xl font-bold text-amber-500">{pendingActivities}</div>
  </div>
</div>

<!-- Filters (Hidden on Print) -->
<div
  class="mb-6 flex flex-wrap gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm print:hidden"
>
  <div class="w-full md:w-64">
    <label
      for="filter-waktu"
      class="block text-sm font-medium text-gray-700 mb-1">Periode Waktu</label
    >
    <select
      id="filter-waktu"
      bind:value={filterWaktu}
      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white"
    >
      <option value="semua">Semua Waktu</option>
      <option value="mingguan">Mingguan (7 Hari Terakhir)</option>
      <option value="bulanan">Bulanan (Bulan Ini)</option>
      <option value="tahunan">Tahunan (Tahun Ini)</option>
    </select>
  </div>

  <div class="w-full md:w-64">
    <label
      for="filter-siswa"
      class="block text-sm font-medium text-gray-700 mb-1">Filter Siswa</label
    >
    <select
      id="filter-siswa"
      bind:value={filterSiswaId}
      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white"
    >
      <option value="">Semua Siswa</option>
      {#each $siswas as siswa}
        <option value={siswa.id}>{siswa.username}</option>
      {/each}
    </select>
  </div>

  <div class="w-full md:w-64">
    <label
      for="filter-tipe"
      class="block text-sm font-medium text-gray-700 mb-1"
      >Filter Tipe Aktivitas</label
    >
    <select
      id="filter-tipe"
      bind:value={filterType}
      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white"
    >
      <option value="">Semua Tipe</option>
      {#each activityTypes as type}
        <option value={type}>{type}</option>
      {/each}
    </select>
  </div>
</div>

<!-- Table -->
<div
  class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6"
>
  <div class="overflow-x-auto">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >Tanggal</th
          >
          <th
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >Siswa</th
          >
          <th
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >Tipe</th
          >
          <th
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >Detail Info</th
          >
          <th
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >Status Verifikasi</th
          >
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        {#each paginatedActivities as activity}
          <tr class="hover:bg-gray-50 transition-colors">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {new Date(activity.created_at).toLocaleDateString()}
            </td>
            <td
              class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
            >
              {getSiswaName(activity.user_id)}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
              <span
                class="bg-blue-50 text-blue-700 py-1 px-2 rounded text-xs font-semibold uppercase tracking-wide"
              >
                {activity.activity_type}
              </span>
            </td>
            <td class="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
              {activity.items || activity.notes || "-"}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              {#if activity.status_guru === "verified" && activity.status_ortu === "verified"}
                <span
                  class="bg-green-100 text-green-800 py-1 px-2 rounded-full text-xs font-medium"
                  >Terverifikasi Penuh</span
                >
              {:else if activity.status_guru === "rejected" || activity.status_ortu === "rejected"}
                <span
                  class="bg-red-100 text-red-800 py-1 px-2 rounded-full text-xs font-medium"
                  >Ditolak</span
                >
              {:else}
                <span
                  class="bg-yellow-100 text-yellow-800 py-1 px-2 rounded-full text-xs font-medium"
                  >Menunggu Verifikasi</span
                >
              {/if}
            </td>
          </tr>
        {:else}
          <tr>
            <td colspan="5" class="px-6 py-10 text-center text-gray-500">
              Tidak ada aktivitas ditemukan untuk filter saat ini.
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>

  <!-- Pagination Controls (Hidden on Print) -->
  {#if totalPages > 1}
    <div
      class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 print:hidden"
    >
      <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p class="text-sm text-gray-700">
            Menampilkan
            <span class="font-medium"
              >{(currentPage - 1) * itemsPerPage + 1}</span
            >
            hingga
            <span class="font-medium"
              >{Math.min(
                currentPage * itemsPerPage,
                filteredActivities.length,
              )}</span
            >
            dari
            <span class="font-medium">{filteredActivities.length}</span>
            hasil
          </p>
        </div>
        <div>
          <nav
            class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
            aria-label="Pagination"
          >
            <button
              on:click={prevPage}
              disabled={currentPage === 1}
              class:opacity-50={currentPage === 1}
              class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <span class="sr-only">Previous</span>
              <svg
                class="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>

            {#each Array(totalPages) as _, i}
              <button
                on:click={() => (currentPage = i + 1)}
                class="relative inline-flex items-center px-4 py-2 border text-sm font-medium
                            {currentPage === i + 1
                  ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                  : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'}"
              >
                {i + 1}
              </button>
            {/each}

            <button
              on:click={nextPage}
              disabled={currentPage === totalPages}
              class:opacity-50={currentPage === totalPages}
              class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <span class="sr-only">Next</span>
              <svg
                class="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </nav>
        </div>
      </div>
    </div>
  {/if}
</div>
