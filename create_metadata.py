# Use the ollama python api. For each icon in each folder in the 'icons' directory, create a metadata file.
# file for each directory, then for each icon, create a line in the metadata file with the icon's name and
# alternative search terms as returned by the ollama api.

# Example Ollama usage:
# import ollama
# response = ollama.chat(model='llama3', messages=[
#   {
#     'role': 'user',
#     'content': 'Why is the sky blue?',
#   },
# ])
# print(response['message']['content'])

import os

import ollama

banned_words = [
    "icon",
    "svg",
    "illustration",
    "logo",
    "set",
    "icon design",
    "icon set",
]

# Set the path to the icons directory
path = "public/icons"

# Set the path to the metadata directory
metadata_path = "metadata.txt"

# Set the model to use
model = "llama3"


def get_list_of_icons():
    # Get the list of directories in the icons directory
    return [f for f in os.listdir(path) if os.path.isdir(os.path.join(path, f))]


def get_list_of_files_in_directory(directory):
    # Get the list of svg files in the directory recursively
    files = []
    for root, dirnames, file_list in os.walk(os.path.join(path, directory)):
        for file in file_list:
            if file.endswith(".svg"):
                files.append(os.path.relpath(os.path.join(root, file), path))
            if metadata_path == file:
                files.append(metadata_path)
    return files


def get_alternative_search_terms(icon_name: str) -> list[str]:
    response = ollama.generate(
        model=model,
        prompt=f"There's an icon called '{icon_name}'. output a list of related search terms for that icon. only output \
            a comma-separated list and nothing else. be brief. don't use generic terms like 'icon', 'svg', 'illustration', \
            'logo', 'set', 'icon design', 'icon set'.",
        stream=False,
    )
    terms: str = response["response"]
    terms_list = terms.replace('"', "").replace(".", "").lower().split(", ")
    terms_set = set(a for a in terms_list)
    terms_set.add(icon_name.lower())
    # print(f"Icon: {icon_name}, Alternative search terms: {terms_set}")
    return [a for a in terms_set]


def create_metadata_file(directory):
    # Get the list of files in the directory
    files = get_list_of_files_in_directory(directory)
    print(files)
    # skip directory if the metadata file already exists
    if metadata_path in files:
        return
    # Create the metadata file
    with open(os.path.join(path, directory, metadata_path), "w") as metadata_file:
        # For each file, write the icon name and alternative search terms to the metadata file
        for file in files:
            icon_name = os.path.splitext(file.split("/")[-1])[0]
            alternative_search_terms = ", ".join(
                get_alternative_search_terms(icon_name)
            )
            out = f"{file}: {alternative_search_terms}\n"
            print(out)
            metadata_file.write(out)


def main():
    # Get the list of directories in the icons directory
    directories = get_list_of_icons()
    # For each directory, create a metadata file
    for directory in directories:
        create_metadata_file(directory)


if __name__ == "__main__":
    main()
