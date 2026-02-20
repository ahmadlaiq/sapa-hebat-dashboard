<script>
  import { siswas, gurus, ortus } from "$lib/stores";
  import { db } from "$lib/firebase";
  import {
    collection,
    addDoc,
    doc,
    updateDoc,
    deleteDoc,
  } from "firebase/firestore";
  import Swal from "sweetalert2";

  let username = "";
  let password = "";
  let selectedGuruId = "";
  let selectedOrtuId = "";

  let editId = null;
  let isModalOpen = false;

  let filterGuruId = "";
  let filterOrtuId = "";

  // Pagination
  let currentPage = 1;
  let itemsPerPage = 10;

  $: {
    // Reset page on filter change
    if (filterGuruId || filterOrtuId) currentPage = 1;
  }

  $: filteredSiswas = $siswas.filter((siswa) => {
    // If filter is empty, return true (show all)
    // Otherwise check if siswa.guru_id matches filter
    // We use loose equality (==) or String() because IDs might be number or string
    const matchGuru =
      filterGuruId === "" ||
      siswa.guru_id == filterGuruId ||
      String(siswa.guru_id) === String(filterGuruId);

    const matchOrtu =
      filterOrtuId === "" ||
      siswa.ortu_id == filterOrtuId ||
      String(siswa.ortu_id) === String(filterOrtuId);

    return matchGuru && matchOrtu;
  });

  $: totalPages = Math.ceil(filteredSiswas.length / itemsPerPage);
  $: paginatedSiswas = filteredSiswas.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  function nextPage() {
    if (currentPage < totalPages) currentPage++;
  }

  function prevPage() {
    if (currentPage > 1) currentPage--;
  }

  function openModal(user = null) {
    if (user) {
      username = user.username;
      password = user.password;
      selectedGuruId = user.guru_id || "";
      selectedOrtuId = user.ortu_id || "";
      editId = user._id;
    } else {
      username = "";
      password = "";
      selectedGuruId = "";
      selectedOrtuId = "";
      editId = null;
    }
    isModalOpen = true;
  }

  async function save() {
    if (!username || !password || !selectedGuruId || !selectedOrtuId) {
      Swal.fire("Error", "Please fill all fields", "warning");
      return;
    }

    try {
      const payload = {
        username,
        password,
        guru_id: selectedGuruId,
        ortu_id: selectedOrtuId,
      };

      if (editId) {
        await updateDoc(doc(db, "users", editId), payload);
      } else {
        await addDoc(collection(db, "users"), {
          ...payload,
          role: "siswa",
          id: Date.now(),
        });
      }
      isModalOpen = false;
      Swal.fire({
        title: "Success!",
        text: "Data saved successfully",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (e) {
      console.error(e);
      Swal.fire("Error", "Error saving data: " + e.message, "error");
    }
  }

  async function remove(id) {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#4f46e5", // indigo-600
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await deleteDoc(doc(db, "users", id));
        Swal.fire("Deleted!", "The Siswa has been deleted.", "success");
      } catch (e) {
        Swal.fire("Error", e.message, "error");
      }
    }
  }

  // Helper to find name by ID (checks both numeric id and Firestore _id)
  $: getGuruName = (id) => {
    const guru = $gurus.find((g) => g.id == id || g._id == id);
    return guru ? guru.username : `Unknown (${id})`;
  };
  $: getOrtuName = (id) => {
    const ortu = $ortus.find((o) => o.id == id || o._id == id);
    return ortu ? ortu.username : `Unknown (${id})`;
  };
</script>

<div class="flex justify-between items-center mb-6">
  <div>
    <h1 class="text-3xl font-bold text-gray-800">Data Siswa</h1>
    <p class="text-gray-500 mt-1">Manage students and their relations</p>
  </div>
  <button
    on:click={() => openModal()}
    class="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg shadow transition-colors flex items-center"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-5 w-5 mr-2"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fill-rule="evenodd"
        d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
        clip-rule="evenodd"
      />
    </svg>
    Add Siswa
  </button>
</div>

<div class="mb-6 flex flex-wrap gap-4">
  <div class="w-full md:w-64">
    <label class="block text-sm font-medium text-gray-700 mb-1"
      >Filter by Guru</label
    >
    <select
      bind:value={filterGuruId}
      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white"
    >
      <option value="">All Gurus</option>
      {#each $gurus as guru}
        <option value={guru.id}>{guru.username}</option>
      {/each}
    </select>
  </div>

  <div class="w-full md:w-64">
    <label class="block text-sm font-medium text-gray-700 mb-1"
      >Filter by Ortu</label
    >
    <select
      bind:value={filterOrtuId}
      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white"
    >
      <option value="">All Ortus</option>
      {#each $ortus as ortu}
        <option value={ortu.id}>{ortu.username}</option>
      {/each}
    </select>
  </div>
</div>

<div
  class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
>
  <table class="min-w-full divide-y divide-gray-200">
    <thead class="bg-gray-50">
      <tr>
        <th
          class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >ID</th
        >
        <th
          class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >Siswa Name</th
        >
        <th
          class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >Guru</th
        >
        <th
          class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >Ortu</th
        >
        <th
          class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
          >Actions</th
        >
      </tr>
    </thead>
    <tbody class="bg-white divide-y divide-gray-200">
      {#each paginatedSiswas as siswa}
        <tr class="hover:bg-gray-50 transition-colors">
          <td
            class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-xs font-mono"
            >{siswa.id}</td
          >
          <td
            class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
            >{siswa.username}</td
          >
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
            <span
              class="bg-blue-100 text-blue-800 py-1 px-2 rounded-full text-xs font-medium"
            >
              {getGuruName(siswa.guru_id)}
            </span>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
            <span
              class="bg-green-100 text-green-800 py-1 px-2 rounded-full text-xs font-medium"
            >
              {getOrtuName(siswa.ortu_id)}
            </span>
          </td>
          <td
            class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
          >
            <button
              on:click={() => openModal(siswa)}
              class="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button
            >
            <button
              on:click={() => remove(siswa._id)}
              class="text-red-600 hover:text-red-900">Delete</button
            >
          </td>
        </tr>
      {:else}
        <tr>
          <td colspan="5" class="px-6 py-10 text-center text-gray-500">
            No students found matching the filters.
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<!-- Pagination Controls -->
{#if totalPages > 1}
  <div
    class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mb-6 rounded-lg shadow-sm"
  >
    <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
      <div>
        <p class="text-sm text-gray-700">
          Showing
          <span class="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span
          >
          to
          <span class="font-medium"
            >{Math.min(currentPage * itemsPerPage, filteredSiswas.length)}</span
          >
          of
          <span class="font-medium">{filteredSiswas.length}</span>
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
            class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 left-0"
          >
            <span class="sr-only">Previous</span>
            <!-- Heroicon name: solid/chevron-left -->
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
            <!-- Heroicon name: solid/chevron-right -->
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

<!-- Modal -->
{#if isModalOpen}
  <div
    class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4"
  >
    <div
      class="relative bg-white rounded-xl shadow-xl max-w-md w-full p-6 transform transition-all"
    >
      <h3 class="text-lg font-bold text-gray-900 mb-4">
        {editId ? "Edit Siswa" : "Add New Siswa"}
      </h3>

      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Username</label
          >
          <input
            type="text"
            bind:value={username}
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            placeholder="Enter username"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Password</label
          >
          <input
            type="text"
            bind:value={password}
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            placeholder="Enter password"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Assign Guru</label
          >
          <select
            bind:value={selectedGuruId}
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white"
          >
            <option value="" disabled>Select a Guru</option>
            {#each $gurus as guru}
              <option value={guru.id}>{guru.username}</option>
            {/each}
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Assign Ortu</label
          >
          <select
            bind:value={selectedOrtuId}
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white"
          >
            <option value="" disabled>Select an Ortu</option>
            {#each $ortus as ortu}
              <option value={ortu.id}>{ortu.username}</option>
            {/each}
          </select>
        </div>
      </div>

      <div class="mt-6 flex justify-end space-x-3">
        <button
          on:click={() => (isModalOpen = false)}
          class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-colors"
        >
          Cancel
        </button>
        <button
          on:click={save}
          class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors shadow-sm"
        >
          Save Changes
        </button>
      </div>
    </div>
  </div>
{/if}
