Tugas sesi 8 : Teaching KelanaAI to Know Its Users
Build an AI Travel Planner using Python, Next.js & Amazon Bedrock
Tugas
Selamat datang di tugas mandiri! 🚀 Malam ini fokus utama kita adalah mengamankan sistem secara menyeluruh, baik dari sisi backend maupun frontend. Anda diminta untuk mengunci seluruh endpoint CRUD serta mengimplementasikan fitur autentikasi agar privasi dan kepemilikan data pengguna tetap terjaga.



📋 Checklist Pengerjaan

View: Only own trips Pastikan endpoint GET /trips telah memfilter data berdasarkan user_id pengguna yang sedang login. Pengguna hanya boleh melihat perjalanan mereka sendiri.
Update: Reject other users'' trips Amankan endpoint pembaruan data. Pada endpoint PUT /trips/{id}, pastikan sistem menolak permintaan jika ada yang mencoba mengubah perjalanan milik orang lain. Kembalikan status error 403 (Forbidden) jika user_id tidak cocok.
Delete: Reject other users'' trips Amankan endpoint penghapusan data. Pada endpoint DELETE /trips/{id}, pastikan sistem menolak permintaan penghapusan jika user_id tidak cocok, dengan mengembalikan status error 403 (Forbidden).
Register + Login Page Buat halaman antarmuka pengguna (UI) khusus untuk proses Registrasi akun baru dan Login pengguna.
Proteksi Halaman (Route Protection) Pastikan halaman generate trip, trip list, trip detail, dan profile sepenuhnya dilindungi dan hanya bisa diakses setelah pengguna berhasil login. Jika ada pengguna yang belum login mencoba mengakses halaman-halaman tersebut, arahkan (redirect) mereka kembali secara otomatis ke halaman login.
Filter Tampilan Trip List Pastikan halaman trip list di antarmuka (frontend) hanya berisi dan menampilkan daftar perjalanan (trip) milik pengguna yang sedang login saat itu (menggunakan data dari poin 1).
Git & Version Control Simpan seluruh perubahan dari solusi Anda (Commit and push your solution) ke repositori GitHub:


git add .
git commit -m "Protect CRUD endpoints to respect user ownership"
git push
git tag session-8 
git push origin session-8


📤 Pengumpulan Tugas Untuk mengumpulkan tugas ini, silakan lampirkan tautan (link) commit terakhir dari pengerjaan perlindungan API ini dari repositori GitHub Anda.