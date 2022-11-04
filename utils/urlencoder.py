import urllib.parse

if __name__ == "__main__":
    string = input("Provide the string you want to encode: ")
    print(urllib.parse.quote_plus(string))