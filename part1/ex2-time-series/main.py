import pandas as pd
from datetime import datetime
import os
import glob


# Converted the Excel file to a CSV file – more efficient in terms of runtime
# df = pd.read_excel("time_series.xlsx")
# df.to_csv("time_series.csv", index=False, sep=",")

# Load the CSV file
df = pd.read_csv("time_series.csv")
# Save to Parquet format
df.to_parquet("time_series.parquet", index=False)

# 1. Data validation

df = pd.read_parquet("time_series.parquet")

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

#Save to a new parquet file that contains only valid data
clean_df[['timestamp', 'value']].to_parquet("clean_time_series.parquet", index=False)


# 2. Calculate average value for each hour
df = pd.read_parquet("clean_time_series.parquet")

# Explicitly convert the 'value' column to numeric
df['value'] = pd.to_numeric(df['value'], errors='coerce')

# Filter out invalid rows (if any remain)
df = df[df['value'].notnull()]


# Convert the timestamp column to datetime format
df['timestamp'] = pd.to_datetime(df['timestamp'])

# Round down each timestamp to the nearest hour
df['hour'] = df['timestamp'].dt.floor('h')

# Calculate the average value per hour
avg_for_hour = df.groupby('hour')['value'].mean().reset_index()

# Rename columns for display
avg_for_hour.columns = ['start time', 'avg']

# Print the results
#print(avg_for_hour)

# 2. Calculating hourly averages by splitting the data into groups

df = pd.read_parquet("clean_time_series.parquet")
df['timestamp'] = pd.to_datetime(df['timestamp'])
df['value'] = pd.to_numeric(df['value'], errors='coerce')
df = df[df['value'].notnull()]

# Split by date (extract just the date part)
df['date'] = df['timestamp'].dt.date
unique_dates = df['date'].unique()

# Create a directory to hold the split files
output_dir = "split_files"
os.makedirs(output_dir, exist_ok=True)

# Split the file into separate files per date
for date in df['date'].unique():
    df_day = df[df['date'] == date].copy()
    filename = f"{output_dir}/split_by_date_{date}.parquet"
    df_day.to_parquet(filename, index=False)


# List of all split parquet files in the split_files directory
files = glob.glob("split_files/split_by_date_*.parquet")

# List to hold all the hourly average DataFrames
avg_list = []

for file in files:
    df = pd.read_parquet(file)
    df['timestamp'] = pd.to_datetime(df['timestamp'])

    # Round each timestamp down to the hour
    df['hour'] = df['timestamp'].dt.floor('h')

    # Calculate hourly average
    avg_for_hour = df.groupby('hour')['value'].mean().reset_index()
    avg_for_hour.columns = ['start time', 'avg']

    # Append the result to the list
    avg_list.append(avg_for_hour)

# Combine all hourly averages into a single DataFrame
final_df = pd.concat(avg_list, ignore_index=True)

# Convert and sort by time
final_df['start time'] = pd.to_datetime(final_df['start time'])
final_df = final_df.sort_values(by='start time')

# Save final combined result to a parquet file
final_df.to_parquet("avg_for_hour_full.parquet", index=False)
print(final_df)

# 3. How do we update the hourly average in real-time when data comes in a stream and not from a file?
# Answer: For each hour, we store the sum of values and the count of values.
# That way, we can simply add each new incoming value to the relevant hour’s sum and count,
# and divide to get the new average — without needing to go over all previous data every time.

# 4. Advantages of storing data in Parquet format
# 1. The file size in this format is significantly smaller compared to a CSV file
# 2. In this format, data types are preserved, whereas in CSV everything is stored as a string



