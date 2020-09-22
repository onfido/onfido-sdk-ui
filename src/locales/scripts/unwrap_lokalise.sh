#!/usr/bin/env bash
set -o errexit
set -o pipefail
set -o nounset

readonly GREEN="\033[0;32m"
readonly RED="\033[0;31m"
readonly YELLOW="\033[1;33m"
readonly NORMAL="\033[0m"
readonly COMMAND="unwrap_lokalise"

DRY_RUN=false
INPUT_FILES=()
OUTPUT_SUFFIX="unwrapped"
WRAP_KEY="onfido"

function print_help_message() {
  local error_message=${1-}

  if [[ ! -z $error_message ]]; then
    printf "${RED}Error: $error_message${NORMAL}\n\n" >&2
  fi

  printf "$COMMAND - unwrap lokalise2 translated keys

Usage:  $COMMAND [options] [flags] file...

Example:
        $COMMAND *.json
        $COMMAND -k locales -s updated *.json
        $COMMAND -d *.json

Available options:
  -k, --key <string>          Specify the key to unwrap from, default to 'onfido'.
  -s, --suffix <string>       String to be appended to output file names, default to 'unwrapped'.

Available flags
  -d, --dry-run               List affected files and possible outputs.
  -h, --help                  Print this message
"
}

function parse_option_arg() {
  if [[ -n "${2-}" ]] && [[ ${2:0:1} != "-" ]]; then
    echo $2
  else
    print_help_message "Argument for $1 is missing"
    exit 1
  fi
}

function parse_args() {
  while (( "$#" )); do
    case "$1" in
      -k|--key)
        WRAP_KEY=$(parse_option_arg "$@")
        shift 2
        ;;
      -s|--suffix)
        OUTPUT_SUFFIX=$(parse_option_arg "$@")
        shift 2
        ;;
      -d|--dry-run)
        DRY_RUN=true
        shift
        ;;
      -h|--help)
        print_help_message
        exit 1
        ;;
      -*|--*=) # unsupported args
        print_help_message "Unsupported argument $1"
        exit 1
        ;;
      *) # preserve positional args
        INPUT_FILES+=($1)
        shift
        ;;
    esac
  done

  if [[ ${#INPUT_FILES[@]} == 0 ]]; then
    print_help_message "Missing files list"
    exit 1
  fi
}

function print_check_result() {
  local result=${1:-""}
  [[ ! -z $result ]] && printf "${GREEN}✔︎${NORMAL}" || printf "${RED}✗${NORMAL}"
}

function check_dependencies() {
  local jq_check=$(command -v jq)

  if [[ -z $jq_check ]]; then
    printf "
${RED}Error:${NORMAL} following dependencies are required:
  $(print_check_result $jq_check) qrencode (https://stedolan.github.io/jq)
"
    exit 1
  fi
}

function unwrap_files() {
  for input_file in "${INPUT_FILES[@]}"; do
    local output_file="${input_file%.json}.$OUTPUT_SUFFIX.json"


    if $DRY_RUN; then
      printf "[DRY RUN] ${GREEN}Unwrapping${NORMAL} $input_file -> $output_file\n"
    else
      printf "${GREEN}Unwrapping${NORMAL} $input_file -> $output_file\n"
      cat "$input_file" | jq "if .$WRAP_KEY == null then . else .$WRAP_KEY end" > $output_file
    fi
  done
}

function wrap_files() {
  for file in src/locales/**/*.json; do
    local output_file="${input_file%.json}.wrapped.json"

    printf "${GREEN}Wrapping${NORMAL} $input_file -> $output_file\n"
    cat "$input_file" | jq "if .$WRAP_KEY == null then { $WRAP_KEY: . } else . end" > $output_file
  done
}

function main() {
  check_dependencies
  parse_args "$@"
  unwrap_files
}

main "$@"
