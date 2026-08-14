"""
trip_service.py - Modul logika bisnis untuk KelanaAI Recommendation Engine.
Berisi fungsi-fungsi untuk menentukan kategori perjalanan, season,
kalkulasi anggaran harian, dan rekomendasi tempat wisata.
"""


def get_trip_category(budget):
    """
    Tentukan kategori perjalanan berdasarkan anggaran (budget).

    Args:
        budget (float): Total anggaran perjalanan dalam USD.

    Returns:
        str: Kategori perjalanan ("Backpacker", "Standard", atau "Luxury").
    """
    if budget < 1000:
        return "Backpacker"
    elif budget <= 3000:
        return "Standard"
    else:
        return "Luxury"


def get_travel_season(month):
    """
    Tentukan kategori season berdasarkan bulan perjalanan.

    Args:
        month (str): Nama bulan dalam bahasa Inggris (e.g., "December").

    Returns:
        str: Kategori season ("Peak Season", "Holiday Season", atau "Regular Season").
    """
    month_lower = month.strip().lower()

    if month_lower == "december":
        return "Peak Season"
    elif month_lower == "june":
        return "Holiday Season"
    else:
        return "Regular Season"


def calculate_daily_budget(budget, days):
    """
    Hitung anggaran harian berdasarkan total anggaran dan jumlah hari.

    Args:
        budget (float): Total anggaran perjalanan dalam USD.
        days (int): Jumlah hari perjalanan.

    Returns:
        float: Anggaran per hari (budget / days).
    """
    return budget / days


def get_recommended_places(destination):
    """
    Dapatkan daftar rekomendasi tempat wisata berdasarkan destinasi.
    Menggunakan tipe data list dan iterasi dengan loop for.

    Args:
        destination (str): Nama destinasi tujuan.

    Returns:
        list: Daftar tempat wisata yang direkomendasikan.
    """
    recommendations = {
        "japan": ["Tokyo Tower", "Shibuya", "Mount Fuji"],
        "bali": ["Tanah Lot", "Ubud Rice Terraces", "Kuta Beach"],
        "paris": ["Eiffel Tower", "Louvre Museum", "Champs-Élysées"],
        "new york": ["Statue of Liberty", "Central Park", "Times Square"],
        "london": ["Big Ben", "Tower Bridge", "Buckingham Palace"],
        "korea": ["Gyeongbokgung Palace", "Myeongdong", "Jeju Island"],
        "singapore": ["Marina Bay Sands", "Sentosa Island", "Gardens by the Bay"],
        "thailand": ["Grand Palace", "Phi Phi Islands", "Chiang Mai"],
    }

    destination_lower = destination.strip().lower()
    return recommendations.get(destination_lower, ["Local Attractions", "City Center", "Cultural Sites"])
