import xmltodict
import json

# Load XML file
with open('./uploads/data.xml') as xml_file:
    data_dict = xmltodict.parse(xml_file.read())

# Convert dictionary to JSON
with open('data.json', 'w') as json_file:
    json.dump(data_dict, json_file, indent=4)
