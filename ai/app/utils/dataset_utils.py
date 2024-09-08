import random
from typing import List, Any, Optional

def split_data(data:List[Any], ratio:float, seed:Optional[int] = None):
    random.seed(seed)
    train_size = int(ratio * len(data))
    random.shuffle(data)
    random.seed(None)
    train_data = data[:train_size]
    val_data = data[train_size:]
    return train_data, val_data