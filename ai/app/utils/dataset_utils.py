import random

def split_data(data:list, ratio:float):
    train_size = int(ratio * len(data))
    random.shuffle(data)
    train_data = data[:train_size]
    val_data = data[train_size:]
    return train_data, val_data