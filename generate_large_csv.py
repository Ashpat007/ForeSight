import csv
import random
import os
from datetime import datetime, timedelta

# Faster data creation
file_path = os.path.join(r"C:\Users\Ashmit\Downloads\Projmern", "perf_test_100mb.csv")
num_rows = 1800000 

products = [
    ("P001", "Laptop", "Electronics", 1200),
    ("P002", "Smartphone", "Electronics", 800),
    ("P003", "Desk Chair", "Furniture", 150),
    ("P004", "Coffee Maker", "Appliances", 80),
    ("P005", "Headphones", "Electronics", 200),
]

start_date = datetime(2023, 1, 1)

print(f"Creating 100MB benchmark file...")

with open(file_path, 'w', newline='') as csvfile:
    writer = csv.writer(csvfile)
    writer.writerow(['ProductID', 'ProductName', 'Category', 'UnitsSold', 'UnitPrice', 'TotalRevenue', 'OrderDate'])
    
    # Pre-generate some random dates to speed up the loop
    random_dates = [(start_date + timedelta(days=random.randint(0, 500))).strftime('%Y-%m-%d') for _ in range(1000)]
    
    for i in range(num_rows):
        prod = random.choice(products)
        units = random.randint(1, 100)
        revenue = units * prod[3]
        
        writer.writerow([
            prod[0], # ID
            prod[1], # Name
            prod[2], # Category
            units,
            prod[3], # Price
            revenue,
            random.choice(random_dates)
        ])
        
        if i % 500000 == 0 and i > 0:
            print(f"Progress: {i}/{num_rows} rows...")

file_size = os.path.getsize(file_path) / (1024 * 1024)
print(f"Benchmark file created at: {file_path}")
print(f"Final Size: {file_size:.2f} MB")
