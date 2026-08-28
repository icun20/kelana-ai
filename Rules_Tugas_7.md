Tugas Sesi 7: Connecting KelanaAI's Brain and Face (Trip History Dashboard)
Build an AI Travel Planner using Python, Next.js & Amazon Bedrock
Tugas
Selamat datang di sesi ketujuh! 🚀 Pada sesi ini, KelanaAI bertransformasi dari prototipe satu halaman (single-page) menjadi aplikasi multi-page yang utuh. Anda akan menghubungkan antarmuka frontend (Next.js) dengan persistent storage (PostgreSQL via FastAPI) untuk membangun halaman Trip History Dashboard.

Tujuan tugas rumah ini adalah mempercantik tampilan kartu perjalanan (Trip Cards) pada dashboard agar memuat informasi yang lebih kaya, interaktif, serta memberikan pengalaman pengguna (UX) yang profesional.



📋 Checklist Pengerjaan
1. Meningkatkan Tampilan Kartu Perjalanan (frontend/components/TripCard.tsx)
Perbarui komponen TripCard agar menampilkan elemen-elemen informasi tambahan berikut:

Destination Icon/Flag: Tambahkan ikon flag atau landmark visual untuk setiap destinasi perjalanan.
Currency & Budget Formatting: Ubah format tampilan angka anggaran (budget), contohnya menampilkan USD 2,000 alih-alih angka polos 2000.
Category Badge: Tampilkan badge dengan warna berbeda (color-coded) berdasarkan kategori anggaran:
Backpacker
Standard
Luxury
Travel Style Badge: Tampilkan badge gaya perjalanan pada setiap kartu:
Family
Solo
Couple


2. Fitur Bonus (Opsional)
Pagination: Tambahkan logika/komponen paginasi jika daftar riwayat perjalanan pada dashboard melebihi 10 items.


3. Git & Version Control
Simpan seluruh perubahan Anda dan lakukan commit serta tag ke repositori GitHub:

Bash



git add .
git commit -m "Create trip dashboard and enhance trip card components"
git push
git tag session-7
git push origin session-7

📤 Pengumpulan Tugas
Untuk mengumpulkan tugas ini, silakan lampirkan tautan (link) commit terakhir dari pengerjaan sesi ini, atau tautan tag session-7 dari repositori GitHub Anda.