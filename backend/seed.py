from app.database import SessionLocal
from app.models import Author, Category, Book
from faker import Faker
import random

fake = Faker()


def seed():
    db = SessionLocal()

    try:
        # Authors
        authors = []

        for _ in range(50):
            author = Author(
                name=fake.name(),
                biography=fake.text(max_nb_chars=200),
                nationality=fake.country()
            )

            db.add(author)
            authors.append(author)

        db.flush()

        # Categories
        category_names = [
            "Fiction",
            "Non-Fiction",
            "Science Fiction",
            "Fantasy",
            "Mystery",
            "Thriller",
            "Romance",
            "Biography",
            "Technology",
            "Science"
        ]

        categories = []

        for name in category_names:
            category = Category(
                name=name,
                slug=name.lower().replace(" ", "-"),
                description=f"Books in the {name} category"
            )

            db.add(category)
            categories.append(category)

        db.flush()

        # Books
        for i in range(100):
            book = Book(
                title=fake.catch_phrase(),
                slug=fake.slug(),
                author_id=random.choice(authors).id,
                category_id=random.choice(categories).id,
                price=round(random.uniform(9.99, 49.99), 2),
                stock_quantity=random.randint(0, 100),
                isbn=fake.isbn13(),
                pages=random.randint(150, 800),
                description=fake.paragraph(),
                is_featured=random.choice([True, False]),
                is_bestseller=random.choice([True, False]),
                is_new_arrival=random.choice([True, False])
            )

            db.add(book)

        db.commit()

        print("✅ Database seeded successfully!")

    except Exception as e:
        db.rollback()
        print(f"❌ Error: {e}")

    finally:
        db.close()


if __name__ == "__main__":
    seed()