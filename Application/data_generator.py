import random
import pandas as pd

# Bus C51623 selected to be the test vehicle
print('hi')
df = pd.read_csv('/home/ritul/Documents/Fleetalytics/Fleet_data/test_vehicle.csv')
#print(df.head())


def gen_bus_data(df):
    for i in range(5):
        print(df.loc[i].to_json(orient ='index'))
        #print(df.loc[i, "date"], df.loc[i, "time"])

    pass

gen_bus_data(df)