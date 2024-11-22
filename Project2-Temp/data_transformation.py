import json
from functools import reduce

with open("lake.js", "r") as f:
    lake_data = json.loads(f.read().replace("const lake =", "").strip(" ;\n"))

warehouse = (
    reduce(
        lambda acc, entry: {**acc, entry["flower"]["zip_code"]: acc.get(entry["flower"]["zip_code"], 0) + 1},
        filter(lambda entry: "zip_code" in entry["flower"], lake_data),
        {}
    )
)

print("Warehouse Object:", warehouse)

with open("warehouse.js", "w") as f:
    f.write(f"const warehouse = {json.dumps(warehouse, indent=2)};\n")

print("Warehouse data has been saved to 'warehouse.js'")