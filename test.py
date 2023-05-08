import json
import numpy as np
import pandas as pd
from collections import defaultdict

xlsx = pd.read_excel("Boriladigan maktablar (1).xlsx")

regions = defaultdict(dict)

for row in xlsx.iloc:
    regions[row["Туман (шаҳар)"]][row["мактаб"]] = {
        "value_9": int(row["9-синф  Ўқувчилар сони"]) if not np.isnan(row["9-синф  Ўқувчилар сони"]) else None,
        "value_11": int(row["11-синф  Ўқувчилар сони"]) if not np.isnan(row["11-синф  Ўқувчилар сони"]) else None
    }

with open("schools.json", "w", encoding="utf8") as file:
    json.dump(regions, file, ensure_ascii=False)
