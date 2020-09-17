#Generating unique and silly "real" sounding names

import random as r
import pandas as pd

#IMPORTANT  -   This file is used to generate the database file. It can only be run manually
# through dbint.py.                  It is not part of the server.

def runEvt():
    vowels = ['a','e','i','o','u','y','oo','ou','ee','ae','ie']
    constanants = ['b','c','d','f','g','h','j','k','l','m','n','p','q','r','s','t','v','w','x','y','z','sh','ch','ph','ck','zh']
    CVsyllables = []    #initial variable setup
    VCsyllables = []
    name = ("")
    namelist = []

    for i in constanants: #adds vowels to constanants
        for j in vowels:
            CVsyllables.append(j + i)
            
        for j in vowels: #adds constanants to vowels
            VCsyllables.append(i + j)

    def NameCombo():
        """Creates names"""
        global name
        syls = []
        name = ""
        sylnum = r.randint(2,4) #number of syllable choice
        choice = r.choice([1,0]) #choosing what first syllable type is
        while sylnum > 0:
            if choice == 1:
                syl1 = r.choice(CVsyllables)
                syls.append(syl1)   #Con-Vow syllable append
                sylnum -= 1
            else:
                syl2 = r.choice(VCsyllables)
                syls.append(syl2)   #Vow-Con sullable append
                sylnum -=1
        for i in syls:
            name = name + i
            name = name[0].upper() + name[1::] #capitalisation

        namelist.append(name)

    for i in range(50000): #makes X diff names
        NameCombo()

    # print(namelist)
    df = pd.DataFrame({"name": namelist, "used": [False]*len(namelist)}) #Using panda to create dataframe
    # print(df)
    return df