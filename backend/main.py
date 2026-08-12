def print_trip_summary(destination, country, days, budget, currency, travel_month):
    """Mencetak ringkasan perjalanan dalam format yang rapi."""
    print()
    print("=" * 30)
    print(f"{'KelanaAI':^30}")
    print("=" * 30)
    print()
    print(f"  Destination  : {destination}")
    print(f"  Country      : {country}")
    print(f"  Days         : {days}")
    print(f"  Budget       : {budget:.0f} {currency}")
    print(f"  Currency     : {currency}")
    print(f"  Travel Month : {travel_month}")
    print()


def main():
    """Fungsi utama untuk mengambil input pengguna dan menampilkan ringkasan."""
    print("Selamat datang di KelanaAI - Trip Summary Generator!")
    print("-" * 50)

    destination = input("Masukkan destinasi       : ")
    country = input("Masukkan negara         : ")
    days = int(input("Masukkan jumlah hari    : "))
    budget = float(input("Masukkan budget         : "))
    currency = input("Masukkan mata uang      : ")
    travel_month = input("Masukkan bulan perjalanan: ")

    print_trip_summary(destination, country, days, budget, currency, travel_month)


if __name__ == "__main__":
    main()
