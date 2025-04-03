import pandas as pd
import os
from collections import Counter
import re

# Converted the Excel file to a text file - more efficient in terms of runtime
# df = pd.read_excel("logs.txt.xlsx")
# df.to_csv("logs.txt", index=False, sep=",")

# Helper function to split the file into smaller parts

def split_log_file(log_file, chunk_size=100_000):
    os.makedirs("chunks", exist_ok=True)
    with open(log_file, "r") as infile:
        i = 0
        while True:
            lines = []
            for _ in range(chunk_size):
                line = infile.readline()
                if not line:
                    break
                lines.append(line)
            if not lines:
                break
            with open(f"chunks/chunk_{i}.txt", "w") as f:
                f.writelines(lines)
            i += 1

# Call the splitting function

split_log_file("logs.txt")


# Function to count the frequency of each error in a single file using Counter
# Receives path to chunk.txt file, extracts error codes and counts them
# Returns a Counter with the count

def count_errors_in_chunk(chunk_path):

    counter = Counter()

    with open(chunk_path, "r") as f:
        for line in f:
            match = re.search(r"Error:\s*(\w+)", line)
            if match:
                error_code = match.group(1)
                counter[error_code] += 1

    return counter

# Aggregates counts from all files -
# Runs the counting function on all the chunks in the "chunks" folder

def count_all_chunks(folder="chunks"):
    total_counter = Counter()

    for filename in os.listdir(folder):
        if filename.startswith("chunk_") and filename.endswith(".txt"):
            path = os.path.join(folder, filename)
            chunk_counter = count_errors_in_chunk(path)
            total_counter.update(chunk_counter)

    return total_counter


# Function to display the N most frequent error codes
def display_top_errors(counter, N):
    top_errors = counter.most_common(N)
    print(f"\nTop {N} most frequent error codes:")
    for code, count in top_errors:
        print(f"{code}: {count}")


# Main execution
if __name__ == "__main__":
    try:
        N = int(input("How many top error codes to display (N)? "))
    except ValueError:
        print("Please enter a valid number.")
        exit()

    total_counter = count_all_chunks()
    display_top_errors(total_counter, N)


# Time Complexity:
# O(T) - Linear
# Where T is the number of errors (lines) in the input file
# Explanation:
# 1. Splitting the file - loops through all lines in the file and writes every fixed number of lines to a new file: total O(T)
# 2. Counting error codes in each CHUNK - O(1) per line, so total for all CHUNKS is O(T)
# 3. Merging all counts is proportional to the number of unique error codes, which is at most O(T)
# 4. Finding the top N frequent codes - using most_common(N), which is O(T log T) in the worst case (if all codes are unique)
# In the best case (few unique codes), it’s much less, so overall: O(T)
# Total: O(T)*3 + O(T log T) = O(T log T)

# Space Complexity:
# ?
