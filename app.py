#! /usr/bin/env python
# -*- coding: utf-8 -*-
# vim:fenc=utf-8
#
# Copyright © 2020 gabbar1947 <gabbar1947@Rathores-MacBook-Pro.local>
#
# Distributed under terms of the MIT license.


from sklearn.manifold import MDS
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
from sklearn.cluster import KMeans
from sklearn import metrics
from scipy.spatial.distance import cdist
import numpy as np
import matplotlib.pyplot as plt
import pandas as pn
from flask import Flask, render_template, request, redirect, Response, jsonify
import json
import copy 


app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")



#TASK 1 - area chart
@app.route("/AREA_CHART", methods = ['POST','GET'])
def death_chart():
    if request.method == 'POST':
        df_ = pn.DataFrame()

        df_ = covid_D
        chart_data = df_.to_dict(orient='records')
        chart_data = json.dumps(chart_data, indent=2)
        df_ = {'chart_data': chart_data}
        
        return jsonify(df_)

#TASK 1 - kmeans - elbow
@app.route("/BAR", methods = ['POST','GET'])
def barATTR_chart():
    if request.method == 'POST':
        df_ = pn.DataFrame()

        df_ = covid_D
        chart_data = df_.to_dict(orient='records')
        chart_data = json.dumps(chart_data, indent=2)
        df_ = {'chart_data': chart_data}
        
        return jsonify(df_)




def main():

    global covid_D
    global covid_W
    Country_List = pn.DataFrame()

    #------------------------------------------------------------------------------------------------
    #------------------------------------------------------------------------------------------------    
    #Process Deaths
    covid_DRAW = pn.read_csv("COVID_DEATH.csv")
    covid_DRAW = covid_DRAW.sort_values(by = 'Country/Region')


    #Processing Corona Death/Confirmed data
    covid_D = pn.DataFrame()
    covid_D['Country'] = covid_DRAW['Country/Region']
    covid_D['Deaths'] = covid_DRAW['Deaths']
    covid_D['Date'] = covid_DRAW['Date']
    covid_D['Confirmed'] = covid_DRAW['Confirmed']

#    print(covid_D)

    #----------------------------------------------------------------------------------------------------
    #----------------------------------------------------------------------------------------------------
    #Processing Weather
    covid_WRAW = pn.read_csv("COVID_WEATHER.csv")

    Country_List = copy.deepcopy(covid_WRAW['Country/Region'])
    Country_List.drop_duplicates(inplace=True)
    Country_List = Country_List.values.tolist()

    weather_data = {}
    for i in Country_List:
        af = covid_WRAW[(covid_WRAW['Country/Region'] == i)]
        Dates = af.columns[2:].tolist()
        maxTemp = []
        minTemp = []
        humidity = []
        count = 0
        for index,key in af.iterrows():
            for j in Dates:
                if count == 0:
                    maxTemp.append(af.loc[index][j])
                elif count == 1:
                    minTemp.append(af.loc[index][j])
                elif count == 2:
                    humidity.append(af.loc[index][j])
            count = count + 1
  
        # Weather dataframe now has four columns - Dates, maxTemp, minTemp, humidity
        weather_data[i] = pn.DataFrame({"Date": Dates,"maxTemp":maxTemp,"minTemp": minTemp,"humidity":humidity})

    covid_W = weather_data
    print(covid_W)
    

    

if __name__ == "__main__":
    main()
    app.run(debug=True)
