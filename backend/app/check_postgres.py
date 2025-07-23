import psycopg2
try:
    conn = psycopg2.connect(
        host="db.evonenipegvhfjqjttqw.supabase.co",
        dbname="postgres",
        user="postgres",
        password="Aruvarinfy16",
        connect_timeout=3
    )
    print("Connection successful!")
except Exception as e:
    print(f"Error: {e}")