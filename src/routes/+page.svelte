<script>
  import { siswas, gurus, ortus } from "$lib/stores";
</script>

<div class="mb-8">
  <h1 class="text-3xl font-bold text-gray-800">Dashboard Overview</h1>
  <p class="text-gray-500 mt-1">Summary of Sapa Hebat system</p>
</div>

<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
  <a href="/guru" class="block group">
    <div
      class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-all hover:shadow-md hover:border-indigo-200"
    >
      <div class="flex items-center justify-between mb-4">
        <h3
          class="text-lg font-medium text-gray-500 group-hover:text-indigo-600 transition-colors"
        >
          Total Guru
        </h3>
        <div
          class="p-2 bg-indigo-50 rounded-lg text-indigo-600 group-hover:bg-indigo-100 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        </div>
      </div>
      <p class="text-4xl font-bold text-gray-900">{$gurus.length}</p>
    </div>
  </a>

  <a href="/ortu" class="block group">
    <div
      class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-all hover:shadow-md hover:border-green-200"
    >
      <div class="flex items-center justify-between mb-4">
        <h3
          class="text-lg font-medium text-gray-500 group-hover:text-green-600 transition-colors"
        >
          Total Ortu
        </h3>
        <div
          class="p-2 bg-green-50 rounded-lg text-green-600 group-hover:bg-green-100 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        </div>
      </div>
      <p class="text-4xl font-bold text-gray-900">{$ortus.length}</p>
    </div>
  </a>

  <a href="/siswa" class="block group">
    <div
      class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-all hover:shadow-md hover:border-blue-200"
    >
      <div class="flex items-center justify-between mb-4">
        <h3
          class="text-lg font-medium text-gray-500 group-hover:text-blue-600 transition-colors"
        >
          Total Siswa
        </h3>
        <div
          class="p-2 bg-blue-50 rounded-lg text-blue-600 group-hover:bg-blue-100 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 14l9-5-9-5-9 5 9 5z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
            />
          </svg>
        </div>
      </div>
      <p class="text-4xl font-bold text-gray-900">{$siswas.length}</p>
    </div>
  </a>
</div>
