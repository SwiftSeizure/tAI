from sqlalchemy import text
import sys
import os
from pathlib import Path

# Ensure project root is on sys.path so `backend` package can be imported when running the script
PROJECT_ROOT = Path(__file__).resolve().parents[2]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from backend.dependencies import engine
from datetime import datetime


def ensure_column(schema: str, table: str, column: str, ddl: str):
    with engine.begin() as conn:
        q = text(
            "SELECT COUNT(*) as cnt FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = :schema AND TABLE_NAME = :table AND COLUMN_NAME = :column"
        )
        res = conn.execute(q, {"schema": schema, "table": table, "column": column}).mappings().first()
        cnt = res["cnt"] if res is not None else 0
        if cnt == 0:
            print(f"Column {column} not found on {table}, adding...")
            conn.execute(text(ddl))
            print(f"Added column {column} to {table}.")
        else:
            print(f"Column {column} already exists on {table}, skipping.")


def create_backup(schema: str, table: str) -> str:
    ts = datetime.now().strftime("%Y%m%d%H%M%S")
    backup_name = f"{table}_backup_{ts}"
    with engine.begin() as conn:
        # Check if backup already exists (very unlikely with timestamp)
        chk = conn.execute(text("SELECT COUNT(*) as cnt FROM information_schema.TABLES WHERE TABLE_SCHEMA = :schema AND TABLE_NAME = :table"), {"schema": schema, "table": backup_name}).mappings().first()
        if chk and chk["cnt"] > 0:
            print(f"Backup table {backup_name} already exists, skipping creation.")
            return backup_name

        print(f"Creating backup table {backup_name} from {table}...")
        conn.execute(text(f"CREATE TABLE `{backup_name}` AS SELECT * FROM `{table}`"))
        print(f"Backup {backup_name} created.")
    return backup_name


if __name__ == "__main__":
    # derive DB name from engine url if possible
    try:
        db_name = engine.url.database
    except Exception:
        db_name = None

    if not db_name:
        print("Could not determine database name from engine. Please set DB name in script.")
        raise SystemExit(1)

    print(f"Using database schema: {db_name}")

    # create backups before making any schema changes
    print("Creating backups before altering tables...")
    assignment_backup = create_backup(db_name, "assignment")
    material_backup = create_backup(db_name, "material")
    print(f"Backups created: {assignment_backup}, {material_backup}")

    # Ensure remoteID exists on assignment and material
    ensure_column(
        schema=db_name,
        table="assignment",
        column="remoteID",
        ddl='ALTER TABLE `assignment` ADD COLUMN `remoteID` VARCHAR(255) NULL'
    )

    ensure_column(
        schema=db_name,
        table="material",
        column="remoteID",
        ddl='ALTER TABLE `material` ADD COLUMN `remoteID` VARCHAR(255) NULL'
    )

    print("Done.")
