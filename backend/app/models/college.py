from datetime import datetime
from app.extensions import db

class College(db.Model):
    __tablename__ = 'colleges'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(255), nullable=False, index=True)
    description = db.Column(db.Text, nullable=True)
    city = db.Column(db.String(100), nullable=False, index=True)
    state = db.Column(db.String(100), nullable=False, index=True)
    address = db.Column(db.Text, nullable=True)
    college_type = db.Column(db.String(50), nullable=True)  # e.g., Private, Public, Autonomous
    university = db.Column(db.String(255), nullable=True)
    established_year = db.Column(db.Integer, nullable=True)
    website = db.Column(db.String(255), nullable=True)
    email = db.Column(db.String(120), nullable=True)
    phone = db.Column(db.String(50), nullable=True)
    logo = db.Column(db.String(500), nullable=True)
    rating = db.Column(db.Float, default=0.0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    courses = db.relationship('Course', backref='college', lazy=True, cascade='all, delete-orphan')
    placements = db.relationship('Placement', backref='college', lazy=True, cascade='all, delete-orphan')
    reviews = db.relationship('Review', backref='college', lazy=True, cascade='all, delete-orphan')
    favorites = db.relationship('Favorite', backref='college', lazy=True, cascade='all, delete-orphan')

    def to_dict(self, include_relations=False):
        data = {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'city': self.city,
            'state': self.state,
            'address': self.address,
            'college_type': self.college_type,
            'university': self.university,
            'established_year': self.established_year,
            'website': self.website,
            'email': self.email,
            'phone': self.phone,
            'logo': self.logo,
            'rating': float(self.rating) if self.rating is not None else 0.0,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
        if include_relations:
            data['courses'] = [course.to_dict() for course in self.courses] if self.courses else []
            data['placement'] = self.placements[0].to_dict() if self.placements and len(self.placements) > 0 else None

        return data

    def __repr__(self):
        return f"<College {self.name}>"
