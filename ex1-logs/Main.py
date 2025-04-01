import pandas as pd
import os
from collections import Counter
import re

#המרת קובץ האקסל לקובץ טקסט -יותר יעיל מבחינת זמן ריצה
#df = pd.read_excel("logs.txt.xlsx")
#df.to_csv("logs.txt", index=False, sep=",")

#פעולת עזר שתפצל את הקובץ לחלקים קטנים יותר

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

#קריאה לפונקצית הפיצול

split_log_file("logs.txt")


#פונקציה לספירת שכיחות של כל שגיאה בקובץ אחד ע"י שימוש בCounter
#מקבל נתיב לקובץ chunk.txt, מחלץ קודי שגיאה וסופר
#מחזיר Counter עם ספירה.

def count_errors_in_chunk(chunk_path):

    counter = Counter()

    with open(chunk_path, "r") as f:
        for line in f:
            match = re.search(r"Error:\s*(\w+)", line)
            if match:
                error_code = match.group(1)
                counter[error_code] += 1

    return counter

