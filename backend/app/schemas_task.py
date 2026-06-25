from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class TaskBase(BaseModel):
    title: str = Field(..., min_length=1)
    description: Optional[str] = None
    status: Optional[str] = Field(default="pending")
    priority: Optional[int] = Field(default=3, ge=1, le=5)
    due_date: Optional[datetime] = None

class TaskCreate(TaskBase):
    pass

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[int] = None
    due_date: Optional[datetime] = None

class TaskRead(TaskBase):
    id: int
    created_at: datetime
    owner_id: int

    class Config:
        orm_mode = True
