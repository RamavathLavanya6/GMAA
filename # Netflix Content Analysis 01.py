# Netflix Content Analysis
# Data Cleaning, EDA and Visualization

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

# ==========================
# Load Dataset
# ==========================

df = pd.read_csv(
    "C:\Users\lavanya ramavath\Downloads\archive.zip"
)


print("Dataset Shape:")
print(df.shape)

print("\nFirst 5 Rows:")
print(df.head())

print("\nDataset Info:")
print(df.info())

# ==========================
# Missing Values
# ==========================

print("\nMissing Values:")
print(df.isnull().sum())

plt.figure(figsize=(10,6))
sns.heatmap(df.isnull(), cbar=False)
plt.title("Missing Values Heatmap")
plt.show()

# ==========================
# Data Cleaning
# ==========================

df.drop_duplicates(inplace=True)

df['director'].fillna('Unknown', inplace=True)
df['country'].fillna('Unknown', inplace=True)
df['rating'].fillna(df['rating'].mode()[0], inplace=True)

df['date_added'] = pd.to_datetime(
    df['date_added'],
    errors='coerce'
)

print("\nAfter Cleaning:")
print(df.isnull().sum())

# ==========================
# Movies vs TV Shows
# ==========================

plt.figure(figsize=(7,5))
sns.countplot(data=df, x='type')
plt.title('Movies vs TV Shows')
plt.show()

# ==========================
# Top Countries
# ==========================

top_countries = (
    df['country']
    .value_counts()
    .head(10)
)

plt.figure(figsize=(10,6))
sns.barplot(
    x=top_countries.values,
    y=top_countries.index
)
plt.title("Top 10 Countries")
plt.xlabel("Count")
plt.ylabel("Country")
plt.show()

# ==========================
# Content Ratings
# ==========================

plt.figure(figsize=(10,6))
sns.countplot(
    data=df,
    y='rating',
    order=df['rating'].value_counts().index
)

plt.title("Content Ratings Distribution")
plt.show()

# ==========================
# Release Year Trend
# ==========================

release_year = (
    df['release_year']
    .value_counts()
    .sort_index()
)

plt.figure(figsize=(14,6))
release_year.plot()
plt.title("Content Release Trend")
plt.xlabel("Year")
plt.ylabel("Count")
plt.show()

# ==========================
# Top Genres
# ==========================

genres = (
    df['listed_in']
    .str.split(',')
    .explode()
)

top_genres = genres.value_counts().head(10)

plt.figure(figsize=(10,6))
sns.barplot(
    x=top_genres.values,
    y=top_genres.index
)

plt.title("Top 10 Genres")
plt.show()

# ==========================
# Content Added Over Time
# ==========================

added_year = (
    df['date_added']
    .dt.year
    .value_counts()
    .sort_index()
)

plt.figure(figsize=(12,6))
added_year.plot(marker='o')
plt.title("Netflix Content Added Over Time")
plt.xlabel("Year")
plt.ylabel("Number of Titles")
plt.show()

# ==========================
# Top Directors
# ==========================

top_directors = (
    df[df['director'] != 'Unknown']
    ['director']
    .value_counts()
    .head(10)
)

plt.figure(figsize=(10,6))
sns.barplot(
    x=top_directors.values,
    y=top_directors.index
)

plt.title("Top 10 Directors")
plt.show()

# ==========================
# Movie Duration Analysis
# ==========================

movies = df[df['type'] == 'Movie'].copy()

movies['duration_num'] = (
    movies['duration']
    .str.extract(r"(\d+)")
    .astype(float)
)

plt.figure(figsize=(10,6))
sns.histplot(
    movies['duration_num'],
    bins=30
)

plt.title("Movie Duration Distribution")
plt.xlabel("Minutes")
plt.show()

# ==========================
# Summary Statistics
# ==========================

print("\nDataset Summary:")
print(df.describe(include='all'))

print("\nEDA Completed Successfully!")