<script>
  import "../app.css";
  import { page } from "$app/stores";
</script>

<div class="flex h-screen bg-gray-100 font-sans">
  <!-- Sidebar -->
  <aside class="w-64 bg-white shadow-xl z-10 flex flex-col">
    <div class="p-6 border-b border-gray-100">
      <h1 class="text-2xl font-bold text-indigo-600 tracking-tight">
        Sapa Hebat
      </h1>
      <p
        class="text-xs text-gray-400 mt-1 uppercase tracking-wider font-semibold"
      >
        Admin Panel
      </p>
    </div>

    <nav class="flex-1 py-6 space-y-1">
      <a
        href="/guru"
        class="flex items-center px-6 py-3 transition-colors duration-200 {$page.url.pathname.startsWith(
          '/guru',
        )
          ? 'bg-indigo-50 text-indigo-600 border-r-4 border-indigo-600 font-medium'
          : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 mr-3"
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
        Data Guru
      </a>

      <a
        href="/ortu"
        class="flex items-center px-6 py-3 transition-colors duration-200 {$page.url.pathname.startsWith(
          '/ortu',
        )
          ? 'bg-indigo-50 text-indigo-600 border-r-4 border-indigo-600 font-medium'
          : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 mr-3"
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
        Data Ortu
      </a>

      <a
        href="/siswa"
        class="flex items-center px-6 py-3 transition-colors duration-200 {$page.url.pathname.startsWith(
          '/siswa',
        )
          ? 'bg-indigo-50 text-indigo-600 border-r-4 border-indigo-600 font-medium'
          : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 mr-3"
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
        Data Siswa
      </a>

      <a
        href="/aktivitas"
        class="flex items-center px-6 py-3 transition-colors duration-200 {$page.url.pathname.startsWith(
          '/aktivitas',
        )
          ? 'bg-indigo-50 text-indigo-600 border-r-4 border-indigo-600 font-medium'
          : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 mr-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
          />
        </svg>
        Data Aktivitas
      </a>
    </nav>

    <div class="p-4 border-t border-gray-100">
      <div class="bg-indigo-50 rounded-lg p-3">
        <p class="text-sm text-indigo-700 font-medium">Logged in</p>
        <p class="text-xs text-indigo-500 mt-1">Admin User</p>
      </div>
    </div>
  </aside>

  <!-- Main Content -->
  <main class="flex-1 overflow-y-auto bg-gray-50">
    <div class="max-w-7xl mx-auto px-6 py-8">
      <slot />
    </div>
  </main>
</div>
