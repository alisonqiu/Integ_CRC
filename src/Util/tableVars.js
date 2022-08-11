export const idxRelation = {
  "Ship nation owner": 0,
  Outcome: 1,
  Itinerary: 2,
  Dates: 3,
  "Captain and crew": 4,
  Labor: 5,
  Source: 6,
};

export const skeleton = {
  "Ship nation owner": ["voyage_id", "voyage_ship__imputed_nationality__name"],
  Outcome: [
    "voyage_outcome__outcome_owner__name",
    "voyage_outcome__vessel_captured_outcome__name",
    "voyage_outcome__outcome_slaves__name",
    "voyage_outcome__particular_outcome__name",
    "voyage_outcome__resistance__name",
  ],
  Itinerary: [
    "voyage_itinerary__first_landing_place__geo_location__name",
    "voyage_itinerary__first_place_slave_purchase__geo_location__name",
    "voyage_itinerary__imp_port_voyage_begin__geo_location__name",
    "voyage_itinerary__imp_principal_place_of_slave_purchase__geo_location__name",
    "voyage_itinerary__imp_principal_port_slave_dis__geo_location__name",
    "voyage_itinerary__imp_region_voyage_begin__geo_location__name",
    "voyage_itinerary__imp_broad_region_voyage_begin__geo_location__name",
    "voyage_itinerary__port_of_departure__geo_location__name",
    "voyage_itinerary__principal_place_of_slave_purchase__geo_location__name",
    "voyage_itinerary__principal_port_of_slave_dis__geo_location__name",
    "voyage_itinerary__place_voyage_ended__geo_location__name",
    "voyage_itinerary__port_of_call_before_atl_crossing__geo_location__name",
    "voyage_itinerary__second_landing_place__geo_location__name",
    "voyage_itinerary__second_place_slave_purchase__geo_location__name",
    "voyage_itinerary__third_landing_place__geo_location__name",
    "voyage_itinerary__third_place_slave_purchase__geo_location__name",
  ],
  Dates: ["voyage_dates__imp_arrival_at_port_of_dis_yyyy"],
  "Captain and crew": ["voyage_captainconnection__captain__name"],
  Labor: [
    "voyage_slaves_numbers__imp_total_num_slaves_embarked",
    "voyage_slaves_numbers__imp_total_num_slaves_disembarked",
    "voyage_slaves_numbers__imp_mortality_during_voyage",
    "voyage_slaves_numbers__imp_mortality_ratio",
    "voyage_slaves_numbers__percentage_boys_among_embarked_slaves",
    "voyage_slaves_numbers__child_ratio_among_embarked_slaves",
    "voyage_slaves_numbers__percentage_girls_among_embarked_slaves",
    "voyage_slaves_numbers__male_ratio_among_embarked_slaves",
    "voyage_slaves_numbers__percentage_men_among_embarked_slaves",
    "voyage_slaves_numbers__percentage_women_among_embarked_slaves",
    "voyage_slaves_numbers__imp_jamaican_cash_price",
  ],
  Source: ["voyage_sourceconnection__source__full_ref"],
};

export const columnOptions = {
  "id": {
    "id": null,
    // "voyage_id": null,
  },


  "voyage_ownercrewandcaptain": {

    'voyage_shipownerconnection__owner__name': null,
    'voyage_captainconnection__captain__name': null,

    "voyage_crew": {
      'voyage_crew__crew_died_complete_voyage': null,
      'voyage_crew__crew_first_landing': null,
      'voyage_crew__crew_voyage_outset': null,
    },
  },

  "voyage_sourceconnection__text_ref": {
    'voyage_sourceconnection__text_ref': null,
  },


  "voyage_dates": {
    'voyage_dates__date_departed_africa_yyyy': null,
    // 'voyage_dates__departure_last_place_of_landing_yyyy': null,
    'voyage_dates__first_dis_of_slaves_yyyy': null,
    // 'voyage_dates__imp_length_home_to_disembark': null,
    'voyage_dates__imp_arrival_at_port_of_dis_yyyy': null,
    'voyage_dates__length_middle_passage_days': null,
    'voyage_dates__slave_purchase_began_yyyy': null,
    'voyage_dates__voyage_began_yyyy': null,
    'voyage_dates__voyage_completed_yyyy': null,
  },
  "voyage_outcome": {
    'voyage_outcome__outcome_owner__name': null,
    'voyage_outcome__vessel_captured_outcome__name': null,
    'voyage_outcome__outcome_slaves__name': null,
    'voyage_outcome__particular_outcome__name': null,
    'voyage_outcome__resistance__name': null,
  },
  "voyage_ship":
  {
    'voyage_ship__guns_mounted': null,
    'voyage_ship__imputed_nationality__name': null,
    // 'voyage_ship__nationality_ship': null,
    'voyage_ship__registered_place__geo_location__name': null,
    'voyage_ship__registered_year': null,
    'voyage_ship__rig_of_vessel__name': null,
    'voyage_ship__ship_name': null,
    'voyage_ship__tonnage': null,
    'voyage_ship__tonnage_mod': null,
    'voyage_ship__vessel_construction_place__geo_location__name': null,
    'voyage_ship__year_of_construction': null

  },
  "voyage_itinerary": {
    'voyage_itinerary__first_landing_place__geo_location__name': null,
    'voyage_itinerary__first_place_slave_purchase__geo_location__name': null,
    'voyage_itinerary__imp_port_voyage_begin__geo_location__name': null,
    'voyage_itinerary__imp_principal_place_of_slave_purchase__geo_location__name': null,
    'voyage_itinerary__imp_principal_port_slave_dis__geo_location__name': null,
    'voyage_itinerary__imp_region_voyage_begin__geo_location__name': null,
    'voyage_itinerary__imp_broad_region_voyage_begin__geo_location__name': null,
    'voyage_itinerary__port_of_departure__geo_location__name': null,
    'voyage_itinerary__principal_place_of_slave_purchase__geo_location__name': null,
    'voyage_itinerary__principal_port_of_slave_dis__geo_location__name': null,
    'voyage_itinerary__place_voyage_ended__geo_location__name': null,
    'voyage_itinerary__port_of_call_before_atl_crossing__geo_location__name': null,
    'voyage_itinerary__second_landing_place__geo_location__name': null,
    'voyage_itinerary__second_place_slave_purchase__geo_location__name': null,
    'voyage_itinerary__third_landing_place__geo_location__name': null,
    'voyage_itinerary__third_place_slave_purchase__geo_location__name': null,
  },
  "voyage_slaves_numbers": {
    'voyage_slaves_numbers__imp_total_num_slaves_embarked': null,
    'voyage_slaves_numbers__imp_total_num_slaves_disembarked': null,
    'voyage_slaves_numbers__imp_mortality_during_voyage': null,
    'voyage_slaves_numbers__imp_mortality_ratio': null,
    'voyage_slaves_numbers__percentage_boys_among_embarked_slaves': null,
    'voyage_slaves_numbers__child_ratio_among_embarked_slaves': null,
    'voyage_slaves_numbers__percentage_girls_among_embarked_slaves': null,
    'voyage_slaves_numbers__male_ratio_among_embarked_slaves': null,
    'voyage_slaves_numbers__percentage_men_among_embarked_slaves': null,
    'voyage_slaves_numbers__percentage_women_among_embarked_slaves': null,
    'voyage_slaves_numbers__imp_jamaican_cash_price': null,
    'voyage_slaves_numbers__num_slaves_carried_first_port': null,
    'voyage_slaves_numbers__num_slaves_carried_second_port': null,
    'voyage_slaves_numbers__num_slaves_carried_third_port': null,
    'voyage_slaves_numbers__num_slaves_disembark_first_place': null,
    'voyage_slaves_numbers__num_slaves_disembark_second_place': null,
    'voyage_slaves_numbers__num_slaves_disembark_third_place': null,
    'voyage_slaves_numbers__num_slaves_intended_first_port': null,
    'voyage_slaves_numbers__total_num_slaves_arr_first_port_embark': null,
  }

}

export const voyage_default_list = [
  "id",
  'voyage_ship__ship_name',
  'voyage_itinerary__imp_port_voyage_begin__geo_location__name',
  'voyage_itinerary__principal_place_of_slave_purchase__geo_location__name',
  'voyage_itinerary__principal_port_of_slave_dis__geo_location__name',
  'voyage_dates__imp_arrival_at_port_of_dis_yyyy',
  'voyage_slaves_numbers__imp_total_num_slaves_disembarked',
  'voyage_captainconnection__captain__name',
  //"voyage_sourceconnection__source__full_ref"
]