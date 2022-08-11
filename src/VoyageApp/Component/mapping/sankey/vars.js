export var voyage_pivot_tables_source = [
    // 'voyage_itinerary__imp_principal_region_of_slave_purchase__geo_location__name':{
    //     "flatlabel":"Itinerary : Imputed broad region of slave disembarkation (MJSELIMP1) : Location : Location name"
    // },
    // 'voyage_itinerary__imp_principal_place_of_slave_purchase__geo_location__name' :{
    //     "flatlabel":"Itinerary : Imputed principal place of slave purchase (MJBYPTIMP) : Location : Location name"
    // },
    // 'voyage_itinerary__imp_broad_region_of_slave_purchase__geo_location__name':{
    //     "flatlabel":"Itinerary : Imputed principal broad region of slave purchase (MAJBYIMP1) : Location : Location name"
    // }

    'voyage_itinerary__imp_principal_region_of_slave_purchase__geo_location__name',
    'voyage_itinerary__imp_principal_place_of_slave_purchase__geo_location__name',
    'voyage_itinerary__imp_broad_region_of_slave_purchase__geo_location__name'
]

export var voyage_pivot_tables_target =[
    'voyage_itinerary__imp_principal_region_slave_dis__geo_location__name',
    'voyage_itinerary__imp_broad_region_slave_dis__geo_location__name',
    'voyage_itinerary__imp_principal_port_slave_dis__geo_location__name',
]

export var voyage_maps =[
    'id',
    'voyage_itinerary__imp_broad_region_voyage_begin__geo_location__id',
    'voyage_itinerary__imp_region_voyage_begin__geo_location__id',
    'voyage_itinerary__imp_port_voyage_begin__geo_location__id',
    'voyage_itinerary__imp_principal_region_of_slave_purchase__geo_location__id',
    'voyage_itinerary__imp_principal_place_of_slave_purchase__geo_location__id',
    'voyage_itinerary__imp_principal_region_slave_dis__geo_location__id',
    'voyage_itinerary__imp_broad_region_slave_dis__geo_location__id',
    'voyage_itinerary__imp_principal_port_slave_dis__geo_location__id',
    "voyage_itinerary__imp_broad_region_of_slave_purchase__geo_location__id",
    'voyage_id',
    'voyage_itinerary__imp_principal_port_slave_dis__id',
    'voyage_itinerary__imp_principal_place_of_slave_purchase__id',
    'voyage_ship__imputed_nationality__name',
    'voyage_ship__tonnage_mod',
    'voyage_ship__ship_name',
    'voyage_slaves_numbers__imp_total_num_slaves_embarked',
    'voyage_slaves_numbers__imp_total_num_slaves_disembarked',
    'voyage_dates__imp_arrival_at_port_of_dis_yyyy',
    ]