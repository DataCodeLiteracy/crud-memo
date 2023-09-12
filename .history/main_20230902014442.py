from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

app = FastAPI()

items=['확인']

@app.get('/items')
def get_items():
    return items

@app.post('/items')
def add_item():
    return items

app.mount('/', StaticFiles(directory="static", html=True), name="static")