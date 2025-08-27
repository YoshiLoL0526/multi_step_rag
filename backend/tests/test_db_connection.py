import pytest
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession


class TestDatabaseConnection:

    @pytest.mark.asyncio
    async def test_database_connection_success(self, test_db_session: AsyncSession):
        """Prueba que la conexión a la base de datos sea exitosa"""
        result = await test_db_session.execute(text("SELECT 1 as test"))
        row = result.fetchone()

        assert row is not None
        assert row.test == 1
