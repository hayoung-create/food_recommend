"""NutriPick 도메인 모델 — SQLite(SQLModel)."""

from typing import Optional

from sqlmodel import Field, SQLModel


class Product(SQLModel, table=True):
    """가공식품 영양성분. 값은 100g(또는 100ml) 기준이며, 결측은 NULL."""

    __tablename__ = "products"

    id: Optional[int] = Field(default=None, primary_key=True)
    food_cd: Optional[str] = Field(default=None, index=True, unique=True)
    name: str = Field(index=True)
    category: Optional[str] = Field(default=None, index=True)
    maker: Optional[str] = Field(default=None)
    serving_size: Optional[str] = Field(default=None)

    calories: Optional[float] = Field(default=None)
    carb: Optional[float] = Field(default=None)
    protein: Optional[float] = Field(default=None)
    fat: Optional[float] = Field(default=None)
    sugar: Optional[float] = Field(default=None)
    sodium: Optional[float] = Field(default=None)
    saturated_fat: Optional[float] = Field(default=None)
    cholesterol: Optional[float] = Field(default=None)
