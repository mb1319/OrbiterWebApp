import sqlite3
import namegenerator as ng
#This file runs the namegenerator and creates planetnames.db

conn = sqlite3.connect('planetnames.db')
c = conn.cursor()

c.execute('''CREATE TABLE IF NOT EXISTS names (generated_id INTEGER PRIMARY KEY,Planet_Name TEXT, Used_Yet BOOLEAN)''')

df = ng.runEvt() #run generator and store resulted DataFrame grom namegen

# print(df)
df.to_sql("names", conn, if_exists="replace") #could change to if_exists="append"?

conn.commit()
conn.close()