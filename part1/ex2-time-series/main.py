import pandas as pd
from datetime import datetime
import os

# Converted the Excel file to a CSV file – more efficient in terms of runtime
# df = pd.read_excel("time_series.xlsx")
# df.to_csv("time_series.csv", index=False, sep=",")

df = pd.read_csv("time_series.csv")

# 1. Data validation

print("\nChecking how many missing values there are:")
print(df.isnull().sum())

# Function to check whether the timestamp format is valid
def is_valid_timestamp(ts):
    try:
        # Try converting the timestamp to datetime format
        datetime.strptime(ts, "%Y-%m-%d %H:%M:%S")
        # If successful, return True
        return True
    # Otherwise – the timestamp is not in a valid format, return False
    except:
        return False

# Add a column that indicates whether each timestamp is valid
df['timestamp_valid'] = df['timestamp'].apply(is_valid_timestamp)

# Filter all rows with invalid timestamps
invalid_timestamps = df[~df['timestamp_valid']]
print(f"\nNumber of invalid timestamps: {len(invalid_timestamps)}")

# Check whether the 'value' column is valid – i.e., contains numeric values
# Add a column indicating whether the value in each row is valid
df['value_valid'] = pd.to_numeric(df['value'], errors='coerce').notnull()

# Filter all rows with invalid values
invalid_values = df[~df['value_valid']]
print(f"\nNumber of invalid values: {len(invalid_values)}")

# Filter to keep only valid rows after all checks
clean_df = df[df['timestamp_valid'] & df['value_valid']].copy()

# Save to a new CSV file that contains only valid data
# clean_df[['timestamp', 'value']].to_csv("clean_time_series.csv", index=False)

# 2. Calculate average value for each hour
df = pd.read_csv("clean_time_series.csv")

# Convert the timestamp column to datetime format
df['timestamp'] = pd.to_datetime(df['timestamp'])

# Round down each timestamp to the nearest hour
df['hour'] = df['timestamp'].dt.floor('h')

# Calculate the average value per hour
avg_for_hour = df.groupby('hour')['value'].mean().reset_index()

# Rename columns for display
avg_for_hour.columns = ['start time', 'avg']

# Print the results
print(avg_for_hour)

#2.חישוב הממוצע לכל שעה בדרך של חלוקת הדאטה לקבוצות


df = pd.read_csv("clean_time_series.csv")
df['timestamp'] = pd.to_datetime(df['timestamp'])

# חלוקה לפי יום
df['date'] = df['timestamp'].dt.date
unique_dates = df['date'].unique()

df['date'] = df['timestamp'].dt.date

# Create a directory to hold the split files
output_dir = "split_files"
os.makedirs(output_dir, exist_ok=True)

# Split the file into separate files per date
for date in df['date'].unique():
    df_day = df[df['date'] == date].copy()
    filename = f"{output_dir}/split_by_date_{date}.csv"
    df_day.to_csv(filename, index=False)

import pandas as pd
import glob

# רשימת כל הקבצים בתיקיית split_files
files = glob.glob("split_files/split_by_date_*.csv")

# רשימה שתכיל את כל טבלאות הממוצע
avg_list = []

for file in files:

    df = pd.read_csv(file)
    df['timestamp'] = pd.to_datetime(df['timestamp'])

    # עיגול כל timestamp לשעה
    df['hour'] = df['timestamp'].dt.floor('h')

    # חישוב ממוצע לכל שעה
    avg_for_hour = df.groupby('hour')['value'].mean().reset_index()
    avg_for_hour.columns = ['start time', 'avg']

    # מוסיפים את התוצאה לרשימה
    avg_list.append(avg_for_hour)

# שילוב כל התוצאות לקובץ אחד
final_df = pd.concat(avg_list, ignore_index=True)

# המרה ודירוג לפי זמן
final_df['start time'] = pd.to_datetime(final_df['start time'])
final_df = final_df.sort_values(by='start time')

# שמירה סופית לקובץ אחד
final_df.to_csv("avg_for_hour_full.csv", index=False)
print(final_df)

