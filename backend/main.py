"""
main.py - Presentation Layer untuk KelanaAI Recommendation Engine.
Menangani interaksi pengguna (I/O) dan menampilkan hasil rekomendasi perjalanan.
"""

from services.trip_service import (
    get_trip_category,
    get_travel_season,
    calculate_daily_budget,
    get_recommended_places,
)


def main():
    # Header
    print("=" * 34)
    print()
    print("           KelanaAI")
    print()
    print("=" * 34)
    print()

    # Input dari pengguna
    destination = input("Enter destination: ")
    days = int(input("Enter number of days: "))
    budget = float(input("Enter budget (USD): "))
    travel_month = input("Enter travel month: ")

    # Proses logika bisnis menggunakan fungsi dari trip_service
    category = get_trip_category(budget)
    daily_budget = calculate_daily_budget(budget, days)
    season = get_travel_season(travel_month)
    places = get_recommended_places(destination)

    # Tampilkan hasil menggunakan f-strings
    print()
    print(f"Destination     : {destination}")
    print()
    print(f"Days            : {days}")
    print()
    print(f"Budget          : {int(budget)} USD")
    print()
    print(f"Category        : {category}")
    print()
    print(f"Daily Budget    : {int(daily_budget)} USD/Day")
    print()
    print(f"Travel Month    : {travel_month}")
    print()
    print(f"Season          : {season}")
    print()
    print()

    # Tampilkan rekomendasi tempat menggunakan list dan loop for
    print("Recommended Places")
    print()
    for place in places:
        print(f"  - {place}")


if __name__ == "__main__":
    main()
