from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os
from pathlib import Path
from dotenv import load_dotenv

# Load the root .env file
env_path = Path(__file__).resolve().parents[2] / ".env"
load_dotenv(dotenv_path=env_path)

# When running under pytest we switch to an in‑memory SQLite DB to avoid needing a real Postgres server.
if os.getenv("PYTEST_RUNNING") == "1":
    # Use an absolute path for the temporary SQLite DB to avoid cwd issues
    from pathlib import Path
    db_path = Path(__file__).resolve().parents[2] / "test.db"
    DATABASE_URL = f"sqlite:///{db_path}"
else:
    # Fallback to a local SQLite file for development if no DATABASE_URL is provided
    DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./dev.db")

# Use a StaticPool so that the in‑memory/file SQLite DB is shared across threads/tests
from sqlalchemy.pool import StaticPool
if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(
        DATABASE_URL,
        echo=True,
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
else:
    engine = create_engine(
        DATABASE_URL,
        echo=True,
    )
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Auto‑create tables on startup
Base.metadata.create_all(bind=engine)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
