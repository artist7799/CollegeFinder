from datetime import datetime
from app.extensions import db

class Review(db.Model):
    __tablename__ = 'reviews'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    college_id = db.Column(db.Integer, db.ForeignKey('colleges.id', ondelete='CASCADE'), nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    comment = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'college_id': self.college_id,
            'rating': self.rating,
            'comment': self.comment,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

    def __repr__(self):
        return f"<Review User #{self.user_id} -> College #{self.college_id} ({self.rating}★)>"
