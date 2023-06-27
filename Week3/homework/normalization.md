# Normalization

**1. What columns violate 1NF?**

_'food_code'_ and _'food_description'_ - are not atomic (they contain multiple values separated by a comma).
_'dinner_date'_ - have inconsistent date format

**2. What entities do you recognize that could be extracted?**

Dinner, venue, food

**3. Name all the tables and columns that would make a 3NF compliant solution.**

_Member_- member_id, member_name, and member_address.
_Dinner_- dinner_id, dinner_date
_Venue_- venue_code, venue_description
_Food_- food_code, food_description
_Dinner_connection_ - member_id, dinner_id, venue_code, food_code
