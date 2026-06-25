from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from .. import models, schemas_task
from ..dependencies import get_current_user, get_db

router = APIRouter()

# Create a task
@router.post("/", response_model=schemas_task.TaskRead, status_code=status.HTTP_201_CREATED)
def create_task(task: schemas_task.TaskCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    db_task = models.Task(**task.dict(), owner_id=current_user.id)
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

# List tasks with optional status filter, search, sorting and pagination
@router.get("/", response_model=List[schemas_task.TaskRead])
def list_tasks(status: Optional[str] = None,
               search: Optional[str] = None,
               sort_by: str = "created_at",
               sort_order: str = "desc",
               skip: int = 0, limit: int = 10,
               db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    query = db.query(models.Task).filter(models.Task.owner_id == current_user.id)
    if status:
        query = query.filter(models.Task.status == status)
    
    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            (models.Task.title.ilike(search_filter)) | 
            (models.Task.description.ilike(search_filter))
        )
        
    # Sorting logic
    if sort_by == "due_date":
        if sort_order == "desc":
            query = query.order_by(models.Task.due_date.desc().nullslast())
        else:
            query = query.order_by(models.Task.due_date.asc().nullslast())
    elif sort_by == "priority":
        if sort_order == "desc":
            query = query.order_by(models.Task.priority.desc())
        else:
            query = query.order_by(models.Task.priority.asc())
    else: # created_at
        if sort_order == "asc":
            query = query.order_by(models.Task.created_at.asc())
        else:
            query = query.order_by(models.Task.created_at.desc())
            
    tasks = query.offset(skip).limit(limit).all()
    return tasks

# Get single task by ID
@router.get("/{task_id}", response_model=schemas_task.TaskRead)
def get_task(task_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    task = db.query(models.Task).filter(models.Task.id == task_id, models.Task.owner_id == current_user.id).first()
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    return task

# Update task (partial)
@router.patch("/{task_id}", response_model=schemas_task.TaskRead)
def update_task(task_id: int, task_update: schemas_task.TaskUpdate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    task = db.query(models.Task).filter(models.Task.id == task_id, models.Task.owner_id == current_user.id).first()
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    update_data = task_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(task, key, value)
    db.commit()
    db.refresh(task)
    return task

# Delete task
@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(task_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    task = db.query(models.Task).filter(models.Task.id == task_id, models.Task.owner_id == current_user.id).first()
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    db.delete(task)
    db.commit()
    return None
