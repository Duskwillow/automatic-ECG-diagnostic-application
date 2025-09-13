# quick_convert.py
import numpy as np
import pandas as pd

# Load the .npy file
data = np.load('sample_ecg.npy')
print(f"Data shape: {data.shape}")

# Save as CSV
pd.DataFrame(data.reshape(-1, 12)).to_csv('sample_ecg.csv', index=False, header=False)
print("Conversion complete!")