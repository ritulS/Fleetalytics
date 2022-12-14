

from math import radians, cos, sin, asin, sqrt

import geopy.distance


def calculate_distance() -> int:
    '''
    [1, "02-12-2019", "10:04:53", "A41121", 460.0, -22.98354, -43.217812, 0.0, "D", 02-12-2019, 10:04:53]                                       ", "10:32:33                      ", "A48044    ", 426.0, -22.970619, -43.188637, 41.48, "E    "]
    Calculate the distance using coordinates
    input => lt1, lt2, lg1, lg2
    Output => distance between prev gps and cur gps in KM
    '''

    prev_lat = -22.92864 # prev latitude
    prev_long = -43.69018 # prev longitude

    cur_lat = -22.89147 # Cur latitude
    cur_long = -43.59413# Cur longitude

    # Haversine formula
    dlon = cur_long - prev_long
    dlat = cur_lat - prev_lat
    a = sin(dlat / 2)**2 + cos(prev_lat) * cos(cur_lat) * sin(dlon / 2)**2
 
    c = 2 * asin(sqrt(a))
    
    # Radius of earth in kilometers. Use 3956 for miles
    r = 6371
    print(int(c * r))  
    coords_1 = (-22.92864, -43.69018)
    coords_2 = (-22.89147, -43.59413)
    print(geopy.distance.geodesic(coords_1, coords_2).km)
    # calculate the result
    return int(c * r)

calculate_distance()