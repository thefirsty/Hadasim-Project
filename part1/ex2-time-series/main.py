import pandas as pd
from datetime import datetime


# Converted the Excel file to a csv file - more efficient in terms of runtime
#df = pd.read_excel("time_series.xlsx")
#df.to_csv("time_series.csv", index=False, sep=",")

df = pd.read_csv("time_series.csv")

#1. בדיקות על הנתונים

print("\n בדיקה כמה ערכים חסרים יש :")
print(df.isnull().sum())

#פונקציה שבודקת האם הפורמט של חותמת הזמן תקין
def is_valid_timestamp(ts):
    try:
        #מנסה להמיר אותו לתאריך הפורמט תקין
        datetime.strptime(ts, "%Y-%m-%d %H:%M:%S")
        #אם הצליחה מחזירה TRUE
        return True
    # אחרת - חותמת הזמן לא בפורמט תקין - תחזיר FALSE
    except:
        return False

#הוספת עמודה שתסמן בכל שורה האם חותמת הזמן בפורמט תקין או לא
df['timestamp_valid'] = df['timestamp'].apply(is_valid_timestamp)

#סינון כל השורות עם חותמת זמן לא תקינה
invalid_timestamps = df[~df['timestamp_valid']]
print(f"\nמספר חותמות הזמן לא תקינות: {len(invalid_timestamps)}")


#בדיקה האם ערכי הVALUE תקינים - האם כולם מספריים
#הוספת עמודה שתסמן עבור כל שורה האם הערך תקין או לא
df['value_valid'] = pd.to_numeric(df['value'], errors='coerce').notnull()

#סינון כל השורות עם ערך לא תקין
invalid_values = df[~df['value_valid']]
print(f"\nמספר הערכים הלא תקינים: {len(invalid_values)}")


#עיבוד הנתונים לנתונים תקינים בלבד לאחר הבדיקות
clean_df = df[df['timestamp_valid'] & df['value_valid']].copy()

#שמירה לקובץ חדש שיכיל רק נתונים תקינים
#clean_df[['timestamp', 'value']].to_csv("clean_time_series.csv", index=False)

#2. חישוב הממוצע עבור כל שעה
df = pd.read_csv("clean_time_series.csv")
# המרה של עמודת הזמן לפורמט datetime
df['timestamp'] = pd.to_datetime(df['timestamp'])
# עיגול הזמן לשעה (כל שורה מקבלת את שעת ההתחלה שלה)
df['hour'] = df['timestamp'].dt.floor('h')
# חישוב ממוצע ערכים לכל שעה
avg_for_hour = df.groupby('hour')['value'].mean().reset_index()
# שינוי שם לעמודות
avg_for_hour.columns = ['start time', 'avg']
#הדפסת התוצאות
print(avg_for_hour)