Selamat datang di sesi kedua 👐. Di sesi kedua ini, Anda akan mengembangkan fitur Recommendation Engine untuk KelanaAI. Aplikasi konsol Anda akan ditingkatkan kemampuannya agar dapat memproses logika bisnis, mengelola koleksi data menggunakan lists, serta menerapkan arsitektur berlapis (layered architecture) dengan memisahkan fungsi bisnis ke dalam direktori modular.

📋 Checklist Pengerjaan
1. Modularisasi Arsitektur (backend/services/trip_service.py)
Pindahkan atau buat fungsi logika bisnis ke dalam file terpisah services/trip_service.py:
Kategori Perjalanan (get_trip_category): Tentukan kategori berdasarkan anggaran (budget):
< 1000 → "Backpacker"
1000 - 3000 →"Standard"
> 3000 → "Luxury"
Kategori Season (get_travel_season): MTentukan kategori berdasarkan bulan (month):
December → "Peak Season"
June → "Holiday Season"
Other Months → "Regular Season"
Kalkulasi Anggaran Harian (calculate_daily_budget): Hitung pembagian anggaran dengan hari (budget / days).
Rekomendasi Tempat: Gunakan tipe data list untuk menyimpan daftar tempat tujuan dan iterasi menggunakan loop for.
2. Implementasi Presentation Layer (backend/main.py)
Impor fungsi logika bisnis yang telah dibuat dari modul services.trip_service.
Tangani interaksi pengguna (I/O), seperti menerima masukan (input) dan menampilkan hasil akhir menggunakan f-strings.
3. Git & Version Control
Lakukan staging perubahan berkas (git add .).
Buat commit dengan pesan deskriptif fitur (git commit -m "Add recommendation engine").
Push perubahan ke repository GitHub (git push).
Buat tag Git untuk sesi ini dan push tag tersebut (git tag session-2 dan git push origin session-2).
🖥️ Contoh Tampilan Output
==================================

KelanaAI

==================================

Destination     : Japan

Days        : 5

Budget       : 1500 USD

Category      : Standard

Daily Budget    : 300 USD/Day

Travel Month: December

Season : Peak Season



Recommended Places

- Tokyo Tower

- Shibuya

- Mount Fuji