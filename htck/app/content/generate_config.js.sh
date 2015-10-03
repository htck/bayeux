#!/bin/bash
CONF_NAME="config.js"
PATH_PREFIX="content/"

echo "Enter a name for your fork :"
read fork_title

TEXT="var constants = {
  \"config\": {
    \"appTitle\": \"$fork_title\"
  },
  \"tabs\": ["

for dir in images/*
do
  if [[ -d "$dir" ]]; then
    echo "Enter a name for tab : \"$dir\""
    read tab_name
    TEXT+="
   {
      \"title\": \"$tab_name\",
      \"images\": ["
    for file in $dir/*
    do
      if [[ -f $file ]]; then
        TEXT+="
        \"$PATH_PREFIX/$file\","
      fi
    done
    TEXT+="
      ]
    },"
  fi
done

TEXT+="
  ]
}
"

echo "$TEXT" > "$CONF_NAME"