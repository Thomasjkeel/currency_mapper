import pandas as pd
import numpy as np
import json

# read JSON file
with open('countries.geojson') as f:
    data = json.load(f)
overall = []
for i in data["features"]:
    overall.append(list(i['properties'].values()))
currency_codes = pd.DataFrame(overall, columns=["Country", "ISO_3"])

countries = pd.read_csv("all_countries.csv")
currencies = pd.read_csv("country-code-to-currency-code-mapping.csv")

# Check the differences between the country codes
# countries_unique = set(countries["alpha-2"].unique())
# currencies_unique = set(currencies["CountryCode"].unique())
# codes_unqiue = set(currency_codes.ISO_3.unique())

# update the json GeoJSON
for i in data["features"]:
    try:
        i["properties"].update({"value":1})
        # differences 
        if i["properties"]["ISO_A3"] == "CUW":
            i["properties"].update({'currency':"ANG"})
        if i["properties"]["ISO_A3"] == "SSD":
            i["properties"].update({'currency':"SSP"})
        if i["properties"]["ADMIN"] == "Kosovo":
            i["properties"].update({'currency':"EUR"})
        
        else:
            val = country_currency.loc[country_currency["alpha-3"] == i["properties"]["ISO_A3"]].Code.values[0]
            i["properties"].update({'currency':val})
    except:
        i["properties"].update({"value":1})
        i["properties"].update({'currency':None})
        print(i["properties"], "None")
        
# write JSON file
with open('countries_currencies.geojson', 'w') as outfile:
    json.dump(data, outfile)
    