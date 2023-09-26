from fastapi import FastAPI, Query
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from pymongo import MongoClient
from fastapi.responses import JSONResponse
import certifi

ca = certifi.where()

client = MongoClient('mongodb+srv://dataliteracy:test@cluster0.ferfyto.mongodb.net/?retryWrites=true&w=majority', tlsCAFile=ca)
db = client.memoApp
collection = db.crudMemo

class Memo(BaseModel):
    id: str
    content: str

app = FastAPI()

@app.get('/memos')
def read_memos(
    sort_by: str = Query(None),
    sort_order: str = Query("asc")
):
    memos = list(collection.find({}))

    if sort_by == "created":
        memos.sort(key=lambda x: x['id'], reverse=sort_order == "desc")
    elif sort_by == "content":
        memos.sort(key=lambda x: x['content'], reverse=sort_order == "desc")

    memos_without_id = [{"id": memo["id"], "content": memo["content"]} for memo in memos]

    return JSONResponse(content=memos_without_id)

@app.post('/memos')
def create_memo(memo: Memo):
    memo_data = {
        "id": memo.id,
        "content": memo.content
    }
    collection.insert_one(memo_data)

@app.put('/memos/{memo_id}')
def put_memo(memo_id: str, req_memo: Memo):
    collection.update_one({"id": memo_id}, {"$set": {"content": req_memo.content}})
    return '성공했습니다.'

@app.delete('/memos/{memo_id}')
def delete_memo(memo_id: str):
    collection.delete_one({"id": memo_id})
    return '성공했습니다.'

app.mount('/', StaticFiles(directory="static", html=True), name="static")
