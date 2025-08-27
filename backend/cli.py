from typer import Typer, Option, secho, colors
from sqlalchemy.orm import Session

from src.core.security import get_password_hash
from src.models.user_model import User
from src.dependencies import get_db


app = Typer()


@app.command()
def create_user(
    email: str = Option(..., prompt=True, help="Email del usuario"),
    password: str = Option(..., prompt=True, hide_input=True, confirmation_prompt=True),
):
    db: Session = next(get_db())
    hashed = get_password_hash(password)
    user = User(email=email, hashed_password=hashed)
    db.add(user)
    db.commit()
    secho(f"✅ User '{email}' created!", fg=colors.GREEN)


if __name__ == "__main__":
    app()
