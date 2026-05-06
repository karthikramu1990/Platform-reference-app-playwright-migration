# -------------------------------------------------------------------------------------
# Date        Author     Referene    Comments
# 28-Jun-24   ATK                    Created
# -------------------------------------------------------------------------------------

#!/bin/bash

# Check if jq is installed
if ! command -v jq &> /dev/null; then
    echo "jq is not installed. Please install jq before running this script."
    exit 1
fi

# Set the path to your JSON file
json_file=$JSON_FILE_PATH

# Set the key and new value for the entry you want to update
key_to_update=$JSON_KEY_TO_UPDATE
new_value=$JSON_VALUE

# Check if the key exists in the JSON file
if jq --arg key "$key_to_update" 'has($key)' "$json_file" &> /dev/null; then
    # Update the value of the specified key
    jq --arg key "$key_to_update" --arg value "$new_value" '.[$key] = $value' "$json_file" > tmpfile && mv tmpfile "$json_file"
    echo "Entry $key_to_update was updated to $new_value successfully in $json_file"
else
    echo "Key not found in the JSON file."
fi