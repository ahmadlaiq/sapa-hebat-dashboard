<script>
  import { activities, siswas } from "$lib/stores";
  import { select2Action } from "$lib/select2";
  import { db } from "$lib/firebase";
  import { deleteDoc, doc } from "firebase/firestore";
  import Swal from "sweetalert2";

  let filterSiswaId = "";
  let filterType = "";
  let filterStatus = "";
  let searchTerm = "";

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
    const studentName = getSiswaName(act.user_id).toLowerCase();
    const type = (act.activity_type || "").toLowerCase();
    const detail = (act.items || act.notes || "").toLowerCase();
    const search = searchTerm.toLowerCase();

    const matchSearch =
      searchTerm === "" ||
      studentName.includes(search) ||
      type.includes(search) ||
      detail.includes(search);

    const matchSiswa =
      filterSiswaId === "" ||
      act.user_id == filterSiswaId ||
      String(act.user_id) === String(filterSiswaId);

    const matchType = filterType === "" || act.activity_type === filterType;

    const matchStatus =
      filterStatus === "" ||
      act.status_guru === filterStatus ||
      act.status_ortu === filterStatus;

    return matchSearch && matchSiswa && matchType && matchStatus;
  });

  // Reset pagination when filter or search changes
  $: {
    if (filterSiswaId || filterType || filterStatus || searchTerm) {
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

  async function remove(id) {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#4f46e5",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await deleteDoc(doc(db, "activities", id));
        Swal.fire("Deleted!", "The Activity has been deleted.", "success");
      } catch (e) {
        Swal.fire("Error", e.message, "error");
      }
    }
  }
</script>

<div class="mb-6">
  <h1 class="text-3xl font-bold text-gray-800">Data Aktivitas</h1>
  <p class="text-gray-500 mt-1">Monitor and verify student activities</p>
</div>

<!-- Filters -->
<div
  class="mb-6 flex flex-wrap items-end gap-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm"
>
  <div class="flex-1 min-w-[300px]">
    <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">Cari Aktivitas</label>
    <div class="relative">
      <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <input
        type="text"
        bind:value={searchTerm}
        placeholder="Cari siswa, tipe, atau detail kegiatan..."
        class="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium text-gray-700 hover:bg-white"
      />
    </div>
  </div>

  <div class="w-full md:w-48">
    <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-1"
      >Filter Siswa</label
    >
    <select
      use:select2Action={{ value: filterSiswaId, placeholder: "All Siswa" }}
      on:select2_change={(e) => filterSiswaId = e.detail}
      class="w-full"
    >
      <option value="">All Siswa</option>
      {#each $siswas as siswa}
        <option value={siswa.id}>{siswa.username}</option>
      {/each}
    </select>
  </div>

  <div class="w-full md:w-48">
    <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-1"
      >Filter Tipe</label
    >
    <select
      use:select2Action={{ value: filterType, placeholder: "All Types" }}
      on:select2_change={(e) => filterType = e.detail}
      class="w-full"
    >
      <option value="">All Types</option>
      {#each activityTypes as type}
        <option value={type}>{type}</option>
      {/each}
    </select>
  </div>

  <div class="w-full md:w-48">
    <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-1"
      >Filter Status</label
    >
    <select
      use:select2Action={{ value: filterStatus, placeholder: "All Statuses" }}
      on:select2_change={(e) => filterStatus = e.detail}
      class="w-full"
    >
      <option value="">All Statuses</option>
      <option value="pending">Pending</option>
      <option value="verified">Verified</option>
      <option value="rejected">Rejected</option>
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
            >Date</th
          >
          <th
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >Siswa</th
          >
          <th
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >Type</th
          >
          <th
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >Items/Notes</th
          >
          <th
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >Guru Status</th
          >
          <th
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >Ortu Status</th
          >
          <th
            class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
            >Actions</th
          >
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        {#each paginatedActivities as activity}
          <tr class="hover:bg-gray-50 transition-colors">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {new Date(activity.created_at).toLocaleDateString()}
              <div class="text-xs text-gray-400">
                {new Date(activity.created_at).toLocaleTimeString()}
              </div>
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
              {#if activity.status_guru === "verified"}
                <span
                  class="bg-green-100 text-green-800 py-1 px-2 rounded-full text-xs font-medium"
                  >Verified</span
                >
              {:else if activity.status_guru === "rejected"}
                <span
                  class="bg-red-100 text-red-800 py-1 px-2 rounded-full text-xs font-medium"
                  >Rejected</span
                >
              {:else}
                <span
                  class="bg-yellow-100 text-yellow-800 py-1 px-2 rounded-full text-xs font-medium"
                  >Pending</span
                >
              {/if}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              {#if activity.status_ortu === "verified"}
                <span
                  class="bg-green-100 text-green-800 py-1 px-2 rounded-full text-xs font-medium"
                  >Verified</span
                >
              {:else if activity.status_ortu === "rejected"}
                <span
                  class="bg-red-100 text-red-800 py-1 px-2 rounded-full text-xs font-medium"
                  >Rejected</span
                >
              {:else}
                <span
                  class="bg-yellow-100 text-yellow-800 py-1 px-2 rounded-full text-xs font-medium"
                  >Pending</span
                >
              {/if}
            </td>
            <td
              class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
            >
              <button
                on:click={() => remove(activity._id)}
                class="text-red-600 hover:text-red-900">Delete</button
              >
            </td>
          </tr>
        {:else}
          <tr>
            <td colspan="7" class="px-6 py-10 text-center text-gray-500">
              No activities found matching criteria.
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>

  <!-- Pagination Controls -->
  {#if totalPages > 1}
    <div
      class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6"
    >
      <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p class="text-sm text-gray-700">
            Showing
            <span class="font-medium"
              >{(currentPage - 1) * itemsPerPage + 1}</span
            >
            to
            <span class="font-medium"
              >{Math.min(
                currentPage * itemsPerPage,
                filteredActivities.length,
              )}</span
            >
            of
            <span class="font-medium">{filteredActivities.length}</span>
            results
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
